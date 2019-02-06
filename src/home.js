const { ipcRenderer } = require('electron');
const { exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const buildStatus = Object.freeze({ select: 1, build: 2, run: 3 });

let moduleFolderPath = '';
let moduleName = '';
let inputs = new Array();

const selectModuleSection = document.getElementById('selectModuleSection');
const buildModuleSection = document.getElementById('buildModuleSection');

document.getElementById('openFolder').addEventListener('click', () => {
    ipcRenderer.send('open-folder');
});

ipcRenderer.on('selected-folder', (event, paths) => {
    [moduleFolderPath] = paths;
    moduleName = path.basename(moduleFolderPath);
    const files = fs.readdirSync(moduleFolderPath);

    if (files.find(x => x === 'DockerFile' || x === 'module_specification.json')) {
        status = buildStatus.run;
        document.getElementById('folderSelectError').style.display = 'none';
        selectModuleSection.style.display = 'none';
        buildModuleSection.style.display = 'block';
        document.getElementById('selectedModulePath').innerText = moduleFolderPath;
    } else {
        document.getElementById('folderSelectError').style.display = 'block';
    }
});

document.getElementById('btnBuildModule').onclick = () => {
    let buildModuleLog =
        'Building module for the first time might take some time, depending on your internet!\n\n';
    this.disabled = true;
    document.getElementById('buildStatus').innerText = 'Building Module...';

    const dockerBuildCommand = `docker build -t ${moduleName} .`;
    console.log('Docker Build Command', dockerBuildCommand);

    const child = exec(dockerBuildCommand, {
        async: true,
        cwd: moduleFolderPath,
        maxBuffer: 2000 * 1024
    });

    child.stdout.on('data', data => {
        buildModuleLog += data;
        document.getElementById('buildModuleLog').innerText = buildModuleLog;
    });

    child.stderr.on('error', data => {
        console.error('error', data);
    });

    child.on('exit', data => {
        console.log('exit', data);
        const buildStatusElement = document.getElementById('buildStatus');

        if (data == null || data !== 0) {
            buildModuleLog =
                // eslint-disable-next-line prefer-template
                buildModuleLog +
                '\n\nError: The log stream has exited without any code' +
                '\nPlease run the following command directly in terminal to build your module' +
                '\n cd ' +
                moduleFolderPath +
                '\n' +
                dockerBuildCommand;
            buildStatusElement.innerText = 'Module Build Failed';
            buildStatusElement.className += ' alert-danger';
        } else {
            buildStatusElement.innerText = 'Module Build Complete';
            buildStatusElement.className += ' alert-success';
            document.getElementById('runModuleSection').style.display = 'block'
            readModuleSpec()
        }

        status = buildStatus.run;
        document.getElementById('runModuleSection').style.display = 'block';
    });
};

function readModuleSpec() {
    var specFile = path.join(moduleFolderPath, 'module_specification.json');
    let rawdata = fs.readFileSync(specFile);
    let json = JSON.parse(rawdata);
    let html = '';
    let multipleFiles = false;

    var keys = Object.keys(json.spec.inputs);
    var tableRef = document.getElementById('inputsTable').getElementsByTagName('tbody')[0];

    keys.forEach(x => {
        var input = {
            name: x,
            type: Object.keys(json.spec.inputs[x])[0].replace(/^type:/g, '')
        };
        inputs.push(input);
        inputType = input.type.includes('file') ? 'file' : 'text';
        if (inputType == 'file') {
            multipleFiles = inputType.includes('list[file]') ? true : false;
        }
        
        var newRow   = tableRef.insertRow(tableRef.rows.length);
        newRow.innerHTML = '<tr><td><label>' + x + '</label></td>' + '<td><input type=' + inputType + '>' + '</td></tr>';
    });
}
