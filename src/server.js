import { WebSocketServer } from 'ws';
import url from 'node:url';

const CLIENT_BROWSER = 'browser';
const CLIENT_STREAMDECK = 'streamdeck';

const port = process.env.PORT || 5000;
console.log(`Starting WSS on port ${port}`);
const wss = new WebSocketServer({ port });

let browserClient, sdClient;

function handleMessages(sourceClientType, data) {
  const messageJson = data.toString();
  console.log('WS received from %s: %s', sourceClientType, messageJson);
  if (sourceClientType === CLIENT_STREAMDECK) {
    if (browserClient) {
      browserClient.send(messageJson);
    } else {
      console.error(`Cannot send action: Browser WS not available`);
      const originalData = JSON.parse(messageJson);
      sdClient.send(JSON.stringify({ type: 'not-delivered', data: originalData }));
    }
  } else if (sourceClientType === CLIENT_BROWSER) {
    if (sdClient) {
      sdClient.send(messageJson);
    } else {
      console.error(`Cannot send action: Stream Deck WS not available`);
      const originalData = JSON.parse(messageJson);
      browserClient.send(JSON.stringify({ action: 'not-delivered', data: originalData }));
    }
  }
}

wss.on('connection', (ws, req) => {
  const reqParams = url.parse(req.url, true);
  const clientType = reqParams.query['client-type'];
  console.log(`WS client connected: ${clientType}`);
  
  // Save client references
  if (clientType === CLIENT_BROWSER) {
    browserClient = ws;
  } else if (clientType === CLIENT_STREAMDECK) {
    sdClient = ws;
    browserClient?.send(JSON.stringify({ action: 'sd-connected' }));
  } else {
    console.error(`Unsupported client type: ${clientType}`);
  }

  ws.on('message', (data) => {
    handleMessages(clientType, data);
  });

  ws.on('close', () => {
    console.log(`WS client disconnected: ${clientType}`);
    if (clientType === CLIENT_BROWSER) {
      browserClient = undefined;
    } else if (clientType === CLIENT_STREAMDECK) {
      sdClient = undefined;
    }
  });
});