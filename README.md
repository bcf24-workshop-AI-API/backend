# Backend Server

## Contents

-

## How to run this project

- Install Node.js
- Run the following command to start the server.
  The server will be running on http://localhost:8080

  ```bash
  node server.js
  ```

## How to replicate the project

Follow the steps below to replicate the project from scratch.

- Install Node.js
- Create a new project directory
- Run the following commands in the project directory to create a new Node.js project and install the required packages.

  ```bash
  npm init
  npm install express @tensorflow/tfjs @tensorflow/tfjs-node multer
  ```

- (Optional) Install `nodemon` to automatically restart the server when the code changes.

  ```bash
  npm install nodemon --global
  ```

## Workflow of the backend server

- Export a pre-trained model

  - Install dependencies

    ```bash
      pip install ultralytics
    ```

- Use the model in our nodeJS server
