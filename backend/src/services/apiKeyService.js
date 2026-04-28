import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import { geminiKeyPath, rootDir, secureDir } from "../utils/paths.js";
import { env } from "../config/env.js";

export function saveGeminiApiKey(apiKey) {
  fs.mkdirSync(secureDir, { recursive: true });
  const payload = encryptApiKey(apiKey);
  fs.writeFileSync(geminiKeyPath, JSON.stringify(payload, null, 2), { encoding: "utf8", mode: 0o600 });
}

export function getGeminiApiKey() {
  if (!fs.existsSync(geminiKeyPath)) return "";

  try {
    const payload = JSON.parse(fs.readFileSync(geminiKeyPath, "utf8"));
    return decryptApiKey(payload);
  } catch {
    return "";
  }
}

export function hasGeminiApiKey() {
  return Boolean(getGeminiApiKey());
}

export function removeGeminiApiKey() {
  if (fs.existsSync(geminiKeyPath)) {
    fs.unlinkSync(geminiKeyPath);
  }
}

export function maskApiKey(apiKey = getGeminiApiKey()) {
  if (!apiKey) return "";
  if (apiKey.length <= 8) return "****";
  return `${apiKey.slice(0, 4)}****${apiKey.slice(-4)}`;
}

function getEncryptionKey() {
  const userInfo = os.userInfo();
  const fingerprint = [
    env.encryptionSecret || "fallback-static-secret",
    userInfo.username,
    userInfo.homedir,
    os.hostname(),
    os.platform(),
    rootDir
  ].join("|");

  return crypto.createHash("sha256").update(fingerprint).digest();
}

function encryptApiKey(apiKey) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(apiKey, "utf8"), cipher.final()]);

  return {
    version: 1,
    algorithm: "aes-256-gcm",
    iv: iv.toString("base64"),
    authTag: cipher.getAuthTag().toString("base64"),
    ciphertext: encrypted.toString("base64")
  };
}

function decryptApiKey(payload) {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    Buffer.from(payload.iv, "base64")
  );
  decipher.setAuthTag(Buffer.from(payload.authTag, "base64"));

  return Buffer.concat([
    decipher.update(Buffer.from(payload.ciphertext, "base64")),
    decipher.final()
  ]).toString("utf8");
}
