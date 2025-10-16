const { app, BrowserWindow, ipcMain } = require('electron');

const path = require('node:path');
const child = require('node:child_process');

let mainWindow = null;
let botProcess = null;

const closeProcess = function () {
    if (!botProcess) return;
    botProcess.kill(); 
    botProcess = null;
}

const createWindow = function() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 600,
        resizable: false,
        icon: path.join(__dirname, 'duck.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    mainWindow.loadFile('index.html');
}

app.whenReady().then(function () {
    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

ipcMain.on('start-bot', function(_event, url, interval) {
    botProcess = child.spawn('node', ['bot.js', url, interval], {
        shell: true,
        detached: true,
    });
    botProcess.on('close', function () {
        mainWindow.webContents.send('message', '[~System] process closed');
    });
    botProcess.stdout.on('data', function (data) {
        mainWindow.webContents.send('message', data.toString());
    });
    botProcess.stderr.on('data', function (data) {
        mainWindow.webContents.send('message', data.toString());
    });
});

ipcMain.on('stop-bot', function () {
    closeProcess();
});

app.on('window-all-closed', function() {
    closeProcess();
    app.quit();
});