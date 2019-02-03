const { ipcRenderer } = require('electron')
const { exec, spawn } = require('child_process')
var path = require('path')
var fs = require('fs')
const buildStatus = Object.freeze({ "select": 1, "build": 2, "run": 3 })

var moduleFolderPath = ''
var moduleName = ''

const selectModuleSection = document.getElementById('selectModuleSection')
const buildModuleSection = document.getElementById('buildModuleSection')

document.getElementById('openFolder').addEventListener('click', _ => {
    ipcRenderer.send('open-folder')
})

ipcRenderer.on('selected-folder', (event, paths) => {
    moduleFolderPath = paths[0]
    moduleName = path.basename(moduleFolderPath)
    var files = fs.readdirSync(moduleFolderPath)

    if (files.find(x => x == 'DockerFile' || x == 'module_specification.json')) {
        status = buildStatus.build
        document.getElementById('folderSelectError').style.display = 'none'
        selectModuleSection.style.display = 'none'
        buildModuleSection.style.display = 'block'
        document.getElementById('selectedModulePath').innerText = moduleFolderPath
    }
    else {
        document.getElementById('folderSelectError').style.display = 'block'
    }
})

document.getElementById('btnBuildModule').onclick = function () {
    var buildModuleLog = 'Building module for the first time might take some time, depending on your internet!\n\n'
    this.disabled = true;
    document.getElementById('buildStatus').innerText = "Building Module..."

    const dockerBuildCommand = 'docker build -t ' + moduleName + ' .'
    console.log(dockerBuildCommand)
    // const command = 'docker build -t test_python_module -f /Users/m1ntripa/Documents/Modules/test_python_module_286e4ed5-342e-4757-b8fc-185be66d14b3/Dockerfile .'

    const child = exec(dockerBuildCommand, {
        async: true,
        cwd: moduleFolderPath,
        maxBuffer: 2000 * 1024
    })

    child.stdout.on('data', data => {
        buildModuleLog = buildModuleLog + data
        document.getElementById('buildModuleLog').innerText = buildModuleLog
    })

    child.stderr.on('error', data => {
        console.log('error' + data)
    })

    child.on('exit', data => {
        console.log('exit' + data)

        if (data == null || data != 0) {
            buildModuleLog = buildModuleLog
                + '\n\nError: The log stream has exited without any code'
                + '\nPlease run the following command directly in terminal to build your module'
                + '\n cd ' + moduleFolderPath
                + '\n' + dockerBuildCommand
            document.getElementById('buildStatus').innerText = "Module Build Failed"

        }
        document.getElementById('buildStatus').innerText = "Module Build Complete"

        status = buildStatus.run
        // document.getElementById('buildModuleSection').style.display = 'none'
        document.getElementById('runModuleSection').style.display = 'block'
    })
}