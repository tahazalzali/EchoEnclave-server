# EchoEnclave Server

This is the backend server for EchoEnclave, an application that allows users to explore music genres, discover artists, and chat with an AI assistant about artists using the Google Gemini API.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Dockerization](#dockerization)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

- Express.js server with RESTful API endpoints.
- Integration with Spotify API to fetch genres and artists.
- Integration with Google Gemini API for AI chat functionality.
- MongoDB database for storing chat history.
- Environment variable configuration for secure API keys.
- Docker support for containerization.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (local or remote)
- [Spotify Developer Account](https://developer.spotify.com/)
- [Google Gemini API Access](https://ai.google.dev/gemini-api/docs/)
- [Docker](https://www.docker.com/) (optional, for containerization)

## Installation

### Clone the Repository

```bash
git clone https://github.com/tahazalzali/EchoEnclave-server.git
cd EchoEnclave-server
