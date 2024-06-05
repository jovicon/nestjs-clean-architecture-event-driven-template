# Websockets

## What is a WebSocket?

WebSocket is a protocol providing full-duplex communication channels over a single TCP connection. It was standardized by the IETF as RFC 6455 and is an essential part of the HTML5 specification. The WebSocket protocol allows for more interactive communication between a user's browser and a server, enabling real-time updates and efficient data exchange.

Unlike traditional HTTP requests, which follow a request-response pattern, WebSocket provides a persistent connection that remains open, allowing messages to be sent back and forth freely. This is particularly useful for applications that require real-time interaction, such as chat applications, live sports updates, online gaming, and collaborative tools.

## How Does It Work?

1. **Handshake**: The process starts with a WebSocket handshake, which is initiated by the client sending an HTTP request to the server with an `Upgrade` header requesting to switch to the WebSocket protocol.

2. **Connection**: If the server supports WebSocket, it responds with an HTTP 101 status code, indicating the protocol change, and the WebSocket connection is established.

3. **Communication**: Once established, the client and server can send messages to each other at any time. The connection remains open, reducing latency since there is no need to open and close a connection for each message.

4. **Closure**: Either the client or the server can close the connection by sending a close frame, after which the other party responds with a close frame, and the connection is terminated.

5. **Secure WebSocket (WSS)**: WebSocket connections can be secured using the Secure Sockets Layer (SSL) or Transport Layer Security (TLS) protocols. In this case, the URL starts with wss:// instead of ws://

### Benefits of WebSocket

1. **Real-Time Communication**: WebSocket enables real-time data transfer, making it ideal for applications requiring immediate updates like live feeds, notifications, and interactive gaming.

2. **Reduced Latency**: Because WebSocket maintains an open connection, there is no need to repeatedly establish and terminate connections, significantly reducing latency and making it faster than traditional HTTP requests.

3. **Efficient Resource Usage**: WebSocket reduces the overhead associated with HTTP, such as headers and connection setup/teardown. This leads to better utilization of bandwidth and server resources.

4. **Bidirectional Communication**: Both the client and the server can send and receive messages independently, allowing for more dynamic and responsive interactions.

5. **Scalability**: WebSocket can handle a large number of simultaneous connections, making it suitable for applications with high concurrency requirements.

## Drawbacks of WebSocket

1. **Complexity**: Implementing WebSocket requires more effort than simple HTTP requests. It involves managing a persistent connection and handling different types of messages and events.

2. **Resource Consumption**: While efficient in communication, maintaining numerous open WebSocket connections can consume significant server resources, especially memory.

3. **Firewall and Proxy Issues**: Some firewalls and proxy servers may not handle WebSocket traffic properly, leading to potential connectivity issues. WebSocket operates over standard HTTP ports (80 and 443), but since it is not pure HTTP, it might be blocked or throttled.

4. **Security Considerations**: Persistent connections can pose security risks if not managed correctly. Proper authentication, authorization, and data validation are critical to prevent unauthorized access and attacks like Cross-Site WebSocket Hijacking (CSWSH).

5. **Browser Support**: While most modern browsers support WebSocket, there may still be legacy systems or environments where it is not available or fully supported, requiring fallback mechanisms.

## Use Cases

- **Chat Applications**: Real-time messaging is a natural fit for WebSocket, providing instant updates to all participants.
- **Live Feeds**: Financial tickers, sports scores, and news updates benefit from the low latency and real-time nature of WebSocket.
- **Online Gaming**: Multiplayer games require continuous and rapid data exchange, making WebSocket ideal for ensuring smooth gameplay.
- **Collaborative Tools**: Applications like online whiteboards, document editing, and project management tools require real-time collaboration features.

## WebSocket Module in NestJS

### What this module does?

- Base websocket module for NestJS.
- Rooms and namespaces support.
- Adapter support.

## Sources

- <https://dev.to/jfrancai/demystifying-nestjs-websocket-gateways-a-step-by-step-guide-to-effective-testing-1a1f>
- <https://hrugvedprashantchavan.medium.com/nestjs-a-guide-to-websocket-implementation-655593fc73ab>
- <https://javascript.plainenglish.io/building-real-time-applications-with-websockets-in-nestjs-7f1c0716732b>
