# Software architecture semester project

## Description

This is a small project for the software architecture subject.

## Technologies

- uuApp framework
    - Frontend: React
    - Backend: Node.js

## Project parts
 - uu_referencedata_maing01_hi
   - Human Interface - React
 - uu_referencedata_maing01_server
   - Server - Node.js (Express)

## Environemnt Setup
- Getting Started
    - https://uuapp.plus4u.net/uu-bookkit-maing01/63d0f03c73cc42b1b67b3e780cc4aad9/book/page?code=57050306
- Environment setup
    - Install Node.js
        - Node Version Manager (nvm) - recommended
            - https://github.com/coreybutler/nvm-windows
        - Classic
            - https://nodejs.org/en/download
    - Install npm
        - https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
    - Setup npm registry
        - `npm config set registry https://repo.plus4u.net/repository/public-javascript/`
    - Setup dev account
      - Go to 'https://uuapp-dev.plus4u.net/uu-identitymanagement-maing01/58ceb15c275c4b31bfe0fc9768aa6a9c/'
      - Sign in as `Production`
      - Setup account (uuid will be same as production)
      - Go to `Show token`
        - Click `Change scope`
          - Add `http://` in the scope
          - Save
    - Setup development asid (uuid)
      - Go to `src\uu_referenceData_maing01\uu_referencedata_maing01-server\env\
      - Modify `development.json`
        - Add your uuid asid_owner_license_list
            - Available at 'https://uuapp-dev.plus4u.net/uu-identitymanagement-maing01/58ceb15c275c4b31bfe0fc9768aa6a9c/'
            - Format of uuid: `0000-0000-0`
    - Install Insomnia Core
        - https://insomnia.rest
        - Import this file into Insomnia
            - `src\uu_referenceData_maing01\uu_referenceData_maing01-server\test\insomnia\insomnia-workspace.json`
        - Setup variables
          - Manage variables (CTRL + E)
          - In localhost, set:
            - `awidLicenseOwner` to your uuid, eg format `0000-0000-0`
          - In base environment, set:
            - `contextPath` to `uu-referencedata-maing01`
            - `token` to your token from 'https://uuapp-dev.plus4u.net/uu-identitymanagement-maing01/58ceb15c275c4b31bfe0fc9768aa6a9c/'
              - This is the token from the dev account setup

## Quick start guide
- Go to the server directory
```bash
  cd src\uu_referenceData_maing01\uu_referenceData_maing01-server
```

- Install dependencies
```bash
  npm install
```

- Start the server
```bash
  npm start
```

## Project setup
- Open Insomnia Core
    - Open uuSubAppInstance/sys/uuSubAppInstance/init
        - Run
    - Open uuSubAppInstance/sys/uuAppWorkspace/create
        - Run
    - Open uuSubAppInstance/sys/uuAppWorkspace/assign
        - Run
    - Open uuSubAppInstance/sys/uuAppWorkspace/init
      - Run

