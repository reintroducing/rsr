# reintroducing Script Runner
The reintroducing Script Runner (*rSR* for short) is a tool that extracts the front end build process out of your project so you don't have to worry about managing dependencies and build configuration.

## Prerequisites
* Node and npm installed on your machine.
    * [nvm](https://github.com/nvm-sh/nvm) is highly recommended for managing node/npm versions.
    * Currently supporting node version 12.8.0.

## Setup
Follow the steps below to install and initialize rSR in a new project.

1. Create new project.
    ```bash
    mkdir [project-name]
    cd [project-name]
    npm init
    ```
1. Install rSR.
    ```bash
    npm install @reintroducing/rsr -D
    ```
1. Add rSR's scripts to package.json.
    ```json
    "scripts": {
      "start": "rsr -e start",
      "build": "rsr -e build"
    },
    ```
1. Begin development.
    ```bash
    npm start
    ```
