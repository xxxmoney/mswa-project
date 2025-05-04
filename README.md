# Software architecture semester project

## Description
This is a small project for the software architecture subject.

## Technologies
- uuApp framework
    - Frontend: React
    - Backend: Node.js

## Guide
 - https://uuapp.plus4u.net/uu-bookkit-maing01/0238a88bac124b3ca828835b57144ffa/book/page?code=45697029

## Project parts
 - uu_referencedata_maing01_hi
   - Human Interface - React
 - uu_referencedata_maing01_server
   - Server - Node.js (Express)

## Initial Setup
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
      - Sign in as `Production` (use the account we already have)
      - Setup account (uuid will be same as production)
      - After logging with the account, go to `Show token`
        - Click `Change scope`
          - Add `http://` in the scope
          - Save
        - Copy token (this token will be used for setup via Insomnia)
        - You can also copy the uuid from the account - format `0000-0000-0`
    - Setup development asid (uuid)
      - Go to `src\uu_referenceData_maing01\uu_referencedata_maing01-server\env\
      - Modify `development.json`
        - Add your uuid asid_owner_license_list
            - Available at 'https://uuapp-dev.plus4u.net/uu-identitymanagement-maing01/58ceb15c275c4b31bfe0fc9768aa6a9c/'
            - Format of uuid: `0000-0000-0`
    - Install Insomnia Core
        - https://insomnia.rest
        - Open and import this file into Insomnia
            - `src\uu_referenceData_maing01\uu_referenceData_maing01-server\test\insomnia\insomnia-workspace.json`
        - Setup variables
          - Manage variables (CTRL + E)
          - In base environment, set:
          - `contextPath` to `uu-referencedata-maing01`
          - `token` to your token from 'https://uuapp-dev.plus4u.net/uu-identitymanagement-maing01/58ceb15c275c4b31bfe0fc9768aa6a9c/'
              - You can use the copied token the the dev account setup
          - In localhost, set:
            - `awidLicenseOwner` to your uuid, eg format `0000-0000-0` 

## Start up guide
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
    - Open uuSubAppInstance: 
      - Run `sys/uuSubAppInstance/init`
    - Open uuAppWorkspace: 
      - Run `sys/uuAppWorkspace/create`
      - Run `sys/uuAppWorkspace/assign`
      - Run `sys/uuAppWorkspace/init`

- **The site should be now available at**:
    - `http://localhost:8080/uu-referencedata-maing01/22222222222222222222222222222222`

