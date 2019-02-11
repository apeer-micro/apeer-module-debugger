const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 1200, height: 800 });
  const htmlPath = path.join('src', 'home.html');
  mainWindow.loadFile(htmlPath);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('open-folder', event => {
  dialog.showOpenDialog(
    {
      properties: ['openDirectory']
    },
    path => {
      event.sender.send('selected-folder', path);
    }
  );
});

ipcMain.on('open-input-folder', event => {
  dialog.showOpenDialog(
    {
      properties: ['openDirectory']
    },
    path => {
      event.sender.send('input-folder-selected', path);
    }
  );
});

ipcMain.on('open-output-folder', event => {
  dialog.showOpenDialog(
    {
      properties: ['openDirectory']
    },
    path => {
      event.sender.send('output-folder-selected', path);
    }
  );
});
