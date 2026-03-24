const { app, BrowserWindow, ipcMain } = require('electron');

app.disableHardwareAcceleration();

const path = require('node:path');
const fs = require('node:fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
});

// ✅ IPC Handlers with async/await and error handling
ipcMain.handle('save-note', async (event, text) => {
  const filePath = path.join(app.getPath('documents'), 'quicknote.txt');
  try {
    await fs.promises.writeFile(filePath, text, 'utf-8');
    return { success: true };
  } catch (err) {
    console.error('Error saving note:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('load-note', async () => {
  const filePath = path.join(app.getPath('documents'), 'quicknote.txt');
  try {
    const data = await fs.promises.readFile(filePath, 'utf-8');
    return data;
  } catch (err) {
    // If file doesn’t exist or can’t be read, return empty string
    console.warn('No saved note found:', err.message);
    return '';
  }
});
