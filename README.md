# Backend Server

A simple Node.js server used for demonstration purposes during BUET CSE FEST 2024 workshop.

## Contents

- [How to run this project](#how-to-run-this-project)
- [How to replicate the project](#how-to-replicate-the-project)
- [Run LLM locally](#run-llm-locally)
- [Use openai API](#use-openai-api)

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
  npm install express axios dotenv cors openai
  ```

- (Optional) Install `nodemon` to automatically restart the server when the code changes.

  ```bash
  npm install nodemon --global
  ```

  After installing `nodemon`, you can start the server using the following command.

  ```bash
  nodemon server.js
  ```

## Run LLM locally

- Install [Ollama](https://ollama.com/download)
- Pull model

  ```bash
  ollama pull <model_name>
  ```

  Models used in this project:

  - `llama3.2`
  - `llava`

## Use openai API

If you have subscription to OpenAI API, you can use the API to generate text.

- Copy .env.example to .env and add your OpenAI API key.

  ```bash
  cp .env.example .env
  ```

- Add your OpenAI API key to .env file
