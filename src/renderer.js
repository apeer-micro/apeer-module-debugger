const { ipcRenderer } = require('electron')

document.getElementById('openFolder').addEventListener('click', _ => {
    ipcRenderer.send('open-folder')
})

ipcRenderer.on('selected-folder', (event, path) => {
    var span = document.getElementById('path')
    span.textContent = path
})