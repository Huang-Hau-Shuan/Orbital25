const { app, BrowserWindow } = require('electron');
const express = require('express');
const path = require('node:path');
const server = express();
const unityBuildPath = path.join(__dirname, '../unity_build');
const NO_CACHE = true;
const FULLSCREEN = true;
const OPEN_DEV = false;
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}
if (NO_CACHE) {
  app.commandLine.appendSwitch("disable-http-cache");
}
const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    fullscreen: FULLSCREEN,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true
    },
  });

  //and load the index.html of the app.
  if (NO_CACHE) {
    mainWindow.webContents.session.clearCache().then(() => {
      mainWindow.loadFile(path.join(__dirname, 'index.html'), {
        extraHeaders: 'pragma: no-cache\ncache-control: no-cache'
      });
      if (OPEN_DEV)
        mainWindow.webContents.openDevTools();
    });
  }
  else {
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    // Open the DevTools.
    if (OPEN_DEV)
      mainWindow.webContents.openDevTools();
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
server.use('/', express.static(unityBuildPath, {
  setHeaders: (res, filePath) => {
    console.log(filePath);
    if (filePath.endsWith('.br')) {
      res.setHeader('Content-Encoding', 'br');
      console.log("nmsl");
      if (filePath.endsWith('.wasm.br')) {

        res.setHeader('Content-Type', 'application/wasm');
      } else if (filePath.endsWith('.js.br')) {
        res.setHeader('Content-Type', 'application/javascript');
      } else if (filePath.endsWith('.data.br')) {
        res.setHeader('Content-Type', 'application/octet-stream');
      } else {
        res.setHeader('Content-Type', 'application/octet-stream'); // fallback
      }
    }

    // Handle gzip just in case
    if (filePath.endsWith('.gz')) {
      res.setHeader('Content-Encoding', 'gzip');

      if (filePath.endsWith('.wasm.gz')) {
        res.setHeader('Content-Type', 'application/wasm');
      } else if (filePath.endsWith('.js.gz')) {
        res.setHeader('Content-Type', 'application/javascript');
      } else if (filePath.endsWith('.data.gz')) {
        res.setHeader('Content-Type', 'application/octet-stream');
      } else {
        res.setHeader('Content-Type', 'application/octet-stream');
      }
    }
  }
}));
app.whenReady().then(() => {

  server.listen(3000, () => console.log('Unity build served at http://localhost:3000'));
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
