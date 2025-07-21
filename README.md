# Adobe Alloy Mini Site

This project serves as a sandbox and example implementation of a tiny version of [Adobe Alloy](https://github.com/adobe/alloy), maintaining the same basic ideas, API, and architecture.

## Project Structure

- **`./alloy-mini.js`** - The miniature version of the Alloy SDK, featuring the same dependency injection architecture, initialization logic, and `alloy(commandName, commandOptions)` API as the full-sized Alloy Web SDK library.
- **`./marketing.js`** - An example on-page integration demonstrating how to use the alloy-mini SDK.

## Installation

Install dependencies:

```bash
npm ci
```

## Usage

Start the development server:

```bash
npm run dev
```

The site will be available at the local server address shown in the terminal output. 
