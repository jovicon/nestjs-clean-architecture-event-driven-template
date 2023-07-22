Distributed Data Patterns Bootcamp Lab: 01 - choreography-based sagas
=====================================================================

Chris Richardson <http://microservices.io>, 2022-07-08 14:59:01 -0700  
Copyright (c) 2020 Chris Richardson Consulting Inc. All rights reserved

Table of Contents

*   [1\. Lab: Review the choreography-based saga in `Order Service`](#_lab_review_the_choreography_based_saga_in_order_service)
    *   [1.1. Review the `OrderService` class](#_review_the_orderservice_class)
    *   [1.2. Review the event handler in the `Customer Service`](#_review_the_event_handler_in_the_customer_service)
    *   [1.3. Review the event handler in the `Order Service`](#_review_the_event_handler_in_the_order_service)
    *   [1.4. Explore the running application](#_explore_the_running_application)
        *   [1.4.1. Build and run the application.](#_build_and_run_the_application)
        *   [1.4.2. Use the Swagger UI to create customers and orders](#_use_the_swagger_ui_to_create_customers_and_orders)
            *   [Create a customer](#_create_a_customer)
            *   [Create Orders](#_create_orders)
        *   [1.4.3. Inspect the database](#_inspect_the_database)
        *   [1.4.4. Inspect the interaction between the services](#_inspect_the_interaction_between_the_services)
        *   [1.4.5. Inspect Apache Kafka](#_inspect_apache_kafka)
        *   [1.4.6. Cleanup](#_cleanup)

1\. Lab: Review the choreography-based saga in `Order Service`
--------------------------------------------------------------

**PLEASE NOTE** use the `eventuate-tram-examples-customers-and-orders` example for this lab.

The goal of this lab is to review the `Order Service`'s choreography-based `Create Order` saga, in the `eventuate-tram-examples-customers-and-orders` example.

The saga works as follows:

1.  `Order Service` creates an `Order` in the `PENDING_CUSTOMER_VALIDATION` state
    
2.  `Order Service` publishes an `OrderCreatedEvent`
    
3.  `Customer Service` consumes the `OrderCreatedEvent` and attempts to reserve credit for the `Order`
    
4.  `Customer Service` publishes either a `CustomerCreditReservedEvent` or a `CustomerCreditReservationFailedEvent`
    
5.  `Order Service` consumes the `CustomerCreditReservedEvent` or a `CustomerCreditReservationFailedEvent` and changes the state of the `Order` to either `APPROVED` or `REJECTED`
    

There are following parts to this lab:

1.  Review the code in the `Order Service` that publishes an `OrderCreatedEvent`
    
2.  Review the code in the `Customer Service`, which consumes this event, attempts to reserve credit and publishes either a `CustomerCreditReservedEvent` or a `CustomerCreditReservationFailedEvent`
    
3.  Review the code in the `Order Service` that subscribes to the events published by the `Customer Service` and approves or rejects the `Order`.
    
4.  Explore the running application
    

### 1.1. Review the `OrderService` class

The `OrderService` class is responsible for publishing events when orders are created, approved and rejected. Take a look at the file

./order-service/src/main/java/io/eventuate/examples/tram/ordersandcustomers/orders/service/OrderService.java

The `createOrder()` method publishes an `OrderCreatedEvent`.

### 1.2. Review the event handler in the `Customer Service`

The `Customer Service` consumes the `OrderCreatedEvent` and attempts to reserve credit for the `Order` It then publishes either a `CustomerCreditReservedEvent` or a `CustomerCreditReservationFailedEvent`. The code that implements the behavior is the `OrderEventConsumer` class.

Take a look at the file:

./customer-service/src/main/java/io/eventuate/examples/tram/ordersandcustomers/customers/service/OrderEventConsumer.java

The `handleOrderCreatedEvent()` method consumes an `OrderCreatedEvent` and attempts to reserve credit.

### 1.3. Review the event handler in the `Order Service`

The `CustomerEventConsumer` class consumes events published by the `Customer Service`. For example, the `handleCustomerCreditReservedEvent()` method consumes a `CustomerCreditReservedEvent` and approves the `Order`.

Take a look at the file:

./order-service/src/main/java/io/eventuate/examples/tram/ordersandcustomers/orders/service/CustomerEventConsumer.java

### 1.4. Explore the running application

Let’s now explore the running application.

#### 1.4.1. Build and run the application.

Follow the instructions for starting containers in the 'Running the commands' section of the setup guide.

#### 1.4.2. Use the Swagger UI to create customers and orders

##### Create a customer

In your browser, visit `[http://localhost:8082/swagger-ui.html](http://localhost:8082/swagger-ui.html)` to create a `Customer`.

Note: If `localhost` doesn’t work replace it with the IP address/hostname of where Docker is running. Note with Docker for Mac/Windows, `localhost` works in URLs.

##### Create Orders

In your browser, visit `[http://localhost:8081/swagger-ui.html](http://localhost:8081/swagger-ui.html)` to create an `Order`

#### 1.4.3. Inspect the database

Look at the tables in MySQL. You can see the customers and orders. You can also look at the Eventuate `MESSAGE` and `RECEIVED_MESSAGES` tables, which contain the messages sent and successfully processed.

$ ./mysql-cli.sh

mysql> show tables;
+------------------------------+
| Tables\_in\_eventuate          |
+------------------------------+
| customer                     |
| customer\_credit\_reservations |
| orders                       |
| message                      |
....

mysql> select \* from customer;
+----+---------------+---------+------+---------+
| id | creation\_time | amount  | name | version |
+----+---------------+---------+------+---------+
|  1 | 1589573355066 |   15.00 | Fred |       2 |
+----+---------------+---------+------+---------+
1 row in set (0.01 sec)

mysql> select \* from orders;
+----+-----------------+---------+----------+---------+
| id | customer\_id     | amount  | state    | version |
+----+-----------------+---------+----------+---------+
|  1 |               1 |   12.34 | APPROVED |       2 |
+----+-----------------+---------+----------+---------+
1 row in set (0.00 sec)


mysql> select \* from message\\G
\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\* 1. row \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
           id: 000001721a0dfe98-0242ac1700090000
  destination: io.eventuate.examples.tram.ordersandcustomers.customers.domain.Customer
      headers: {"PARTITION\_ID":"1","event-aggregate-type":"io.eventuate.examples.tram.ordersandcustomers.customers.domain.Customer","DATE":"Fri, 15 May 2020 20:37:04 GMT","event-aggregate-id":"1","event-type":"io.eventuate.examples.tram.ordersandcustomers.commondomain.CustomerCreatedEvent","DESTINATION":"io.eventuate.examples.tram.ordersandcustomers.customers.domain.Customer","ID":"000001721a0dfe98-0242ac1700090000"}
      payload: {"name":"Fred","creditLimit":{"amount":15.00}}
    published: 0
creation\_time: 1589575024296
\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\* 2. row \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
           id: 000001721a0dff9b-0242ac1700080000
  destination: io.eventuate.examples.tram.ordersandcustomers.orders.domain.Order
      headers: {"PARTITION\_ID":"1","event-aggregate-type":"io.eventuate.examples.tram.ordersandcustomers.orders.domain.Order","DATE":"Fri, 15 May 2020 20:37:04 GMT","event-aggregate-id":"1","event-type":"io.eventuate.examples.tram.ordersandcustomers.commondomain.OrderCreatedEvent","DESTINATION":"io.eventuate.examples.tram.ordersandcustomers.orders.domain.Order","ID":"000001721a0dff9b-0242ac1700080000"}
      payload: {"orderDetails":{"customerId":1,"orderTotal":{"amount":12.34}}}
    published: 0
creation\_time: 1589575024558
\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\* 3. row \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
           id: 000001721a0e003f-0242ac1700090000
  destination: io.eventuate.examples.tram.ordersandcustomers.customers.domain.Customer
      headers: {"PARTITION\_ID":"1","event-aggregate-type":"io.eventuate.examples.tram.ordersandcustomers.customers.domain.Customer","DATE":"Fri, 15 May 2020 20:37:04 GMT","event-aggregate-id":"1","event-type":"io.eventuate.examples.tram.ordersandcustomers.commondomain.CustomerCreditReservedEvent","DESTINATION":"io.eventuate.examples.tram.ordersandcustomers.customers.domain.Customer","ID":"000001721a0e003f-0242ac1700090000"}
      payload: {"orderId":1}
    published: 0
creation\_time: 1589575024705
\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\* 4. row \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
           id: 000001721a0e0074-0242ac1700080000
  destination: io.eventuate.examples.tram.ordersandcustomers.orders.domain.Order
      headers: {"PARTITION\_ID":"1","event-aggregate-type":"io.eventuate.examples.tram.ordersandcustomers.orders.domain.Order","DATE":"Fri, 15 May 2020 20:37:04 GMT","event-aggregate-id":"1","event-type":"io.eventuate.examples.tram.ordersandcustomers.commondomain.OrderApprovedEvent","DESTINATION":"io.eventuate.examples.tram.ordersandcustomers.orders.domain.Order","ID":"000001721a0e0074-0242ac1700080000"}
      payload: {"orderDetails":{"customerId":1,"orderTotal":{"amount":12.34}}}
    published: 0
creation\_time: 1589575024758
4 rows in set (0.01 sec)


mysql> select \* from received\_messages\\G
\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\* 1. row \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
  consumer\_id: customerServiceEvents
   message\_id: 000001721a0dfe98-0242ac1700090000
creation\_time: 1589575024557
\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\* 2. row \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
  consumer\_id: customerServiceEvents
   message\_id: 000001721a0e003f-0242ac1700090000
creation\_time: 1589575024744
\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\* 3. row \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
  consumer\_id: customerServiceEvents
   message\_id: 000001721a0e0268-0242ac1700090000
creation\_time: 1589575025284
\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\* 4. row \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*
  consumer\_id: customerServiceEvents
   message\_id: 000001721a0e029d-0242ac1700090000
creation\_time: 1589575025329
4 rows in set (0.00 sec)

mysql> quit
Bye

#### 1.4.4. Inspect the interaction between the services

This application is configured to use [distributed tracing](https://microservices.io/patterns/observability/distributed-tracing.html). You can view the traces in the Zipkin console:

1.  Open the web page `[http://localhost:9411](http://localhost:9411)`
    
2.  Click the `Find Traces Button`
    

You should see a trace for each time you created a customer or order.

#### 1.4.5. Inspect Apache Kafka

You can also look at the Kafka topics created by the application:

$ ./kafka-topics.sh --list
\_\_confluent.support.metrics
\_\_consumer\_offsets
io.eventuate.examples.tram.ordersandcustomers.customers.domain.Customer
io.eventuate.examples.tram.ordersandcustomers.orders.domain.Order
offset.storage.topic

$ ./kafka-topics.sh --describe --topic io.eventuate.examples.tram.ordersandcustomers.customers.domain.Customer
Topic:io.eventuate.examples.tram.ordersandcustomers.customers.domain.Customer	PartitionCount:1	ReplicationFactor:1	Configs:
	Topic: io.eventuate.examples.tram.ordersandcustomers.customers.domain.Customer	Partition: 0	Leader: 1001	Replicas: 1001	Isr: 1001

You can also view the Kafka consumer groups (a.k.a. Eventuate Tram subscriptions):

$ ./kafka-consumer-groups.sh --list
orderServiceEvents
customerHistoryServiceEvents
customerServiceEvents
orderHistoryServiceEvents

$  ./kafka-consumer-groups.sh --describe --group orderHistoryServiceEvents

TOPIC                                                             PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG             CONSUMER-ID                                     HOST            CLIENT-ID
io.eventuate.examples.tram.ordersandcustomers.orders.domain.Order 0          13              13              0               consumer-1-fdd11d3e-a535-40bc-8a8f-715f41190dc9 /172.23.0.7     consumer-1

#### 1.4.6. Cleanup

Once you are done with the lab, you can clean up by following the instructions for stopping containers in the 'Cleaning up' section.

Last updated 2020-05-23 11:47:26 -0700