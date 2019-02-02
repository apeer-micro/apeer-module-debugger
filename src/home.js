const { ipcRenderer } = require('electron')
const { exec } = require('child_process')
var path = require('path')
var fs = require('fs')

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
        document.getElementById('folderSelectError').style.display = 'none'
        selectModuleSection.style.display = 'none'
        buildModuleSection.style.display = 'block'
        document.getElementById('selectedModulePath').innerText = moduleFolderPath
        var buildModuleLog = ''

        document.getElementById('btnBuildModule').onclick = function () {
            this.disabled = true;
            document.getElementById('buildStatus').innerText = "Building Module..."

            const dockerBuildCommand = 'docker build -t ' + moduleName + ' .'
            console.log(dockerBuildCommand)
            // const command = 'docker build -t test_python_module -f /Users/m1ntripa/Documents/Modules/test_python_module_286e4ed5-342e-4757-b8fc-185be66d14b3/Dockerfile .'

            const child = exec(dockerBuildCommand, {
                async: true,
                cwd: moduleFolderPath
            })
            child.stdout.on('data', data => {
                buildModuleLog = buildModuleLog + data
                document.getElementById('buildModuleLog').innerText = buildModuleLog
            })

            child.on('exit', function () {
                document.getElementById('buildStatus').innerText = "Module Build Complete"
            })
        }
    }
    else {
        document.getElementById('folderSelectError').style.display = 'block'
    }
})