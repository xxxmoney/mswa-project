# MSWA Project
 - This is a full-stack web application built with the *MERN* stack (MongoDB, Express.js, React/Next.js, Node.js).

## About The Project
 - Backend: An Express.js server connected to a MongoDB database for data persistence.
 - Frontend: A Next.js application for a modern, server-rendered React user interface.
 - Authentication: JWT-based authentication to secure routes and manage user sessions.
 - API: A RESTful API for communication between the frontend and backend.

## Getting Started
 - Follow these instructions to get a local copy up and running.

### Prerequisites
 - Node.js and npm (or yarn)
 - MongoDB (local installation or a cloud service like MongoDB Atlas)

### Backend Setup
 - Navigate to the backend directory and install dependencies:

```Bash
cd src/backend
npm install
```

 - Create a .env file in the src/backend directory and add the following environment variables:

```Bash
PORT=8000
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_strong_jwt_secret>
```

 - Start the backend server:

```Bash
npm run dev
```

### Frontend Setup
 - Navigate to the frontend directory and install dependencies:

```Bash
cd src/frontend
npm install
```

 - Create a .env.local file in the src/frontend directory and add the following:

```Bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<your_nextauth_secret>
```

 - Start the frontend development server:

```Bash
npm run dev
```

 - Your application should now be running, with the frontend available at http://localhost:3000 and the backend at http://localhost:8000.