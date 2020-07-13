[![Build Status](https://dev.azure.com/apeer-micro/apeer-open-source/_apis/build/status/apeer-micro.apeer-module-debugger?branchName=master)](https://dev.azure.com/apeer-micro/apeer-open-source/_build/latest?definitionId=1&branchName=master)
![Platform Supported](https://img.shields.io/badge/platform-windows%20%7C%20macos-lightgrey)
[![Github All Releases](https://img.shields.io/github/downloads/apeer-micro/apeer-module-debugger/total.svg)]()

## What it does
Our Apeer Module Debugger is an application that can be used to build and run [APEER](https://www.apeer.com) modules locally


## How to Use
- You can read a comprehensive tutorial at <https://docs.apeer.com/create-modules/module-debugging>
- Make sure docker is installed (for windows, make sure that you have shared your drive with docker)
- Select your module folder
- Click on "Build module"
- Choose the inputs for your module (currently only supports file, number and string inputs)
- Click on "Run module"

Selected input files will be copied to a new "input" folder in your module folder and the output of your module will be available in "output" folder also in your module folder
