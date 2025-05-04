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

## Uu Environment Setup
- Setup development asid (uuid)
    - Go to `src\uu_referencedata_maing01-server\env\
    - Modify `development.json`
        - Add your uuid asid_owner_license_list
            - Available at 'https://uuidentity.plus4u.net'
            - Format of uuid: `0000-0000-0`

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


