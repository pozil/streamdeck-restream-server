# Stream Deck Restream Server

## Overview

Server for the unofficial Elgato Stream Deck plugin that controls Restream Studio via a Chrome Extension.

![Screenshot of the Stream Deck plugin](https://github.com/pozil/streamdeck-restream-plugin/raw/main/src/org.pozil.restream.sdPlugin/previews/screenshot.png)

This solution requires three components to run:
1. A Node.js server (this project)
1. [A Chrome extension](https://github.com/pozil/restream-chrome-extension)
1. [A Stream Deck plugin](https://github.com/pozil/streamdeck-restream-plugin)

## Server Setup

1. Ensure that you have [Node.js](https://nodejs.org/en) v20 or above by running this command in a terminal:
    ```sh
    node -v
    ```

1. Install the server dependencies:
    ```sh
    npm install
    ```

1. Start the server:
    ```sh
    npm start
    ```

Now that the server is up and running, install the [Chrome extension](https://github.com/pozil/restream-chrome-extension).
