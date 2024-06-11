# Message

A Message, is a data record that the `messaging system` can transmit through a `message channel`.

**A message consist of two basic parts:**

- **Header**: Information used by the messaging system that describes the data being transmitted, its origin, its destination, and so on.
- **Body**: The data being transmitted; generally ignored by the messaging system and simply transmitted as-is.

## Why default message structure reference?

- **Header**: The header is used by the messaging system to route the message to the correct destination, to ensure that the message is handled correctly, and to provide information that can be used by the recipient to process the message.

- **Body or Details**: The body is the data that is being transmitted. The messaging system does not care about the contents of the body and does not need to understand it. The body is simply transmitted from sender to receiver.

## Example

```json
{
  "header": {
    "version": "1.0",
    "id": "123",
    "detail-type": "OrderCreated",
    "time": "2021-01-01T00:00:00Z",
    "source": "microservice-sender-identification-name",
    "tenant": "product_1", // optional - not required
    "authorization": "Bearer token", // optional - not required
  },
  "detail": {
    "metadata": {
      "requestId": "123", // correlation ID
    },
    "data": {
      "orderId": "123",
    }
  }
}
```

## Message header

- **version**: The version of the message format. This can be used to ensure that the message is compatible with the recipient and to provide information about the structure of the message.

- **id**: A unique identifier for the message. This can be used to track the message as it moves through the system.

- **timestamp**: The time at which the message was created. This can be used to determine how long the message has been in the system and to help with debugging and troubleshooting.

- **source**: The name of the sender of the message. This can be used to route the message to the correct destination and to provide information about the origin of the message.

- **destination**: The name of the receiver of the message. This can be used to route the message to the correct destination and to provide information about the intended recipient of the message.

- **type**: The type of the message. This can be used to determine how the message should be processed and to provide information about the contents of the message.

## Message body or details

- **metadata**: Additional information about the message. This can include things like the correlation ID, which can be used to track the message as it moves through the system, and other information that is useful for processing the message.

- **data**: The actual data being transmitted. This can be anything that needs to be sent from the sender to the receiver, such as an order, a customer record, or any other type of data.

**Note:** in this example I prefer to use `detail` instead of `body` because it's more clear and easy to follow when you are working with complex events with metadata. Also as an AWS Enthusiast, EventBridge uses `detail` instead of `body`; but you can use `body` if you prefer.

## Sources & inspirations

- [Enterprise Integration Patterns - Messages: basic parts](https://www.enterpriseintegrationpatterns.com/patterns/messaging/Message.html)
- [Best Practices: When Working With Events, Schema Registry, and Amazon EventBridge](https://community.aws/content/2dhVUFPH16jZbhZfUB73aRVJ5uD/eventbridge-schema-registry-best-practices)
- [AWS - Events Data structure explanation](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-events-structure.html)
- [AWS - EventBridge schema registry](https://docs.aws.amazon.com/eventbridge/latest/userguide/schema-registry.html)
- [Defining events payloads](https://medium.com/p/bd5cc4809415)
- [Defining an event schema in an Event-Driven Architecture](https://pandaquests.medium.com/defining-an-event-schema-in-an-event-driven-architecture-4fc2d011a201)
