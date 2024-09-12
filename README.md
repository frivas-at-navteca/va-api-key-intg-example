# Voice Atlas API Key integration example

## Overview

This example includes a frontend and a backend that can be used to interact with Voice Atlas API Key integration.

The frontend is written in React/Typescript/ChakraUI
The backend is written in Python with FastAPI

## Architecture

![Voice Atlas API Key Integration](APIKey_Integration.png "Voice Atlas API Key Integration")

## Usage

1. Clone this repository
2. Open a terminal
3. `cd frontend`
4. `npm install`
5. Change the line 41 to the appropriate URL of the backend.
6. `npm run start`
7. Open a new terminal o a tab
8. `cd backend`
9. Change the lines 19 and 20 to include the appropriate URL and API Key from the configuration.
10. `pip install -r requirements.txt`
11. `uvicorn main:app --reload`
12. Visit `http://127.0.0.1:3000` in your browser
