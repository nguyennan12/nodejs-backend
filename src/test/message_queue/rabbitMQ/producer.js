import amqp from 'amqplib'

const message = 'RabbitMQ connected, hi nguyenan'

const runProducer = async () => {
  try {
    const connection = await amqp.connect('amqp://admin:Nann_1204@localhost')
    const channel = await connection.createChannel()

    const queueName = 'test-topic'
    await channel.assertQueue(queueName, { durable: true })
    channel.sendToQueue(queueName, Buffer.from(message))
    console.log('message sent: ', message)
  }
  catch (error) { console.error(error) }
}

runProducer().catch(console.error)