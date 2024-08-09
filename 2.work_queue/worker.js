let amqp = require('amqplib/callback_api');

amqp.connect('amqp://admin:admin@localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }

    var queue = 'task_queue';

    channel.assertQueue(queue, {
      durable: true
    });
    channel.prefetch(1); // 한번에 하나의 메시지만 처리, fair work
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
    channel.consume(queue, function(msg) {
      console.log(" [x] Received %s", msg.content.toString());
      setTimeout(function() {
        console.log(" [x] Done");
        channel.ack(msg);
      }, 2000);
    }, {
      // automatic acknowledgment mode,
      // see /docs/confirms for details
      noAck: false
    });
  });
});