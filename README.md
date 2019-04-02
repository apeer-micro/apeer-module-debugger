Before starting, please install "npm" and "docker"
(Install npm using: https://www.npmjs.com/get-npm)

## Clone the repository
git clone https://github.com/apeer-micro/apeer-module-debugger.git

## Go into the repository
cd apeer-module-debugger

## Install dependencies
npm install

## Run the app
npm start


## How to Use
- Make sure docker is installed (for windows, make sure that you have shared your drive with docker)
- Select your module folder
- Click on "Build module"
- Choose the inputs for your module (currently only supports file, number and string inputs)
- Click on "Run module"

Selected input files will be copied to a new "input" folder in your module folder and the output of your module will be available in "output" folder also in your module folder


## Features backlog
- Support more input types
- Add input restriction (such as user should not be able to input beyond the range and file type restrictions)
- UI is very primitive right now. UI needs to be better
- Better error handling
