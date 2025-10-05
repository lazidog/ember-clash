# Mezon Bot Example - NestJS

This repository contains an example of a Mezon bot built using NestJS.

## Overview

This project demonstrates how to create a chatbot using NestJS as the backend framework for the Mezon bot. It provides a starting point for developers looking to build their own conversational applications.

## Getting Started

### Creating a Mezon Bot

1. Visit the [Mezon Developer Portal](https://mezon.ai/developers/applications)
2. Sign in with your Mezon account or create one
3. Click on "New Application" to create a new bot
4. Fill in the required details for your bot:
  - Name
  - Description
5. After creation, navigate to the "Bot" section to get your bot token
6. Copy the bot token and bot ID to use in your `.env` file

### Integrating with Your NestJS App

Once you have your bot credentials, you can use them to connect your NestJS application to the Mezon platform. The example code in this repository demonstrates how to set up the connection and handle bot events.

## Prerequisites

- Node.js (v14+)
- npm or yarn
- NestJS CLI

## Installation

```bash
# Clone the repository
git clone https://github.com/mezonai/mezon-bot-example-nestjs.git

# Navigate to the project directory
cd mezon-bot-example-nestjs

# Install dependencies
npm install
```

## Configuration

Create a `.env` file in the root directory and add the following configuration:

```
# Bot configuration
MEZON_TOKEN=your_bot_token_here
BOT_ID=your_bot_id_here

# Other environment variables
PORT=3000
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

## Project Structure

```
src/
├── bot/              # Bot-specific modules and services
├── main.ts           # Application entry point
└── app.module.ts     # Main application module
test/
```

## Features

- NestJS architecture with dependency injection
- Mezon bot framework integration
- Example conversation flows
- Middleware for message processing
- Ready for deployment

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.