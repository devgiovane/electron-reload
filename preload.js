const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('manager', {
    start: (url, interval) => ipcRenderer.send('start-bot', url, interval),
    stop: () => ipcRenderer.send('stop-bot'),
    onMessage: (callback) => ipcRenderer.on('message', (_event, value) => callback(value)),
});