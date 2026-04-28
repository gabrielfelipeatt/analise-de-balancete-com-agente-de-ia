import { env } from "../config/env.js";

let runtimeGroqApiKey = "";

export function saveGroqApiKey(apiKey) {
  runtimeGroqApiKey = apiKey;
}

export function getGroqApiKey() {
  return runtimeGroqApiKey || env.groqApiKey;
}

export function hasGroqApiKey() {
  return Boolean(getGroqApiKey());
}

export function maskApiKey(apiKey = getGroqApiKey()) {
  if (!apiKey) return "";
  if (apiKey.length <= 8) return "****";
  return `${apiKey.slice(0, 4)}****${apiKey.slice(-4)}`;
}
