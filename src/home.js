const { ipcRenderer } = require('electron')
const fs = require('fs')

document.getElementById('openFolder').addEventListener('click', _ => {
    ipcRenderer.send('open-folder')
})

ipcRenderer.on('selected-folder', (event, paths) => {
    const path = paths[0]
    var span = document.getElementById('path')
    span.textContent = path
    
    fs.readdir(path, (err, files) => {
        files.forEach(file => {
            console.log(file)
        });
    })
})