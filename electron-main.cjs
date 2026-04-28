const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

const fs = require('fs');

let mainWindow;
let backendProcess;

// Função para ajudar no diagnóstico de erros em produção
function logToFile(message) {
  const logPath = path.join(app.getPath('userData'), 'backend-log.txt');
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
}

function startBackend() {
  logToFile('Iniciando tentativa de subir o backend (Modo No-ASAR)...');

  // Com o asar: false, o caminho é o mesmo tanto em dev quanto em prod relativo ao __dirname
  const serverPath = path.join(__dirname, 'backend', 'src', 'server.js');
  
  logToFile(`Caminho do servidor: ${serverPath}`);

  backendProcess = spawn(process.execPath, [serverPath], {
    env: { 
      ...process.env, 
      ELECTRON_RUN_AS_NODE: '1',
      DATA_DIR: app.getPath('userData')
    },
    cwd: __dirname
  });

  backendProcess.stdout.on('data', (data) => logToFile(`STDOUT: ${data}`));
  backendProcess.stderr.on('data', (data) => logToFile(`STDERR: ${data}`));

  backendProcess.on('error', (err) => {
    logToFile(`FALHA CRITICA AO INICIAR: ${err.message}`);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Agente Contabil",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    backgroundColor: '#212121'
  });

  if (app.isPackaged) {
    // Em produção, carregamos o arquivo index.html compilado
    mainWindow.loadFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
  } else {
    // Em desenvolvimento, carregamos o servidor do Vite
    mainWindow.loadURL('http://localhost:5173');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  startBackend();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  // Mata o processo do backend ao fechar todas as janelas
  if (backendProcess) {
    backendProcess.kill();
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Garante que o backend morra se o Electron for finalizado abruptamente
process.on('exit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});
