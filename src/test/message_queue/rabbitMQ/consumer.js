import amqp from 'amqplib'

const runConsumer = async () => {
  try {
    const connection = await amqp.connect('amqp://admin:Nann_1204@localhost')
    const channel = await connection.createChannel()

    const queueName = 'test-topic'
    await channel.assertQueue(queueName, { durable: true })

    channel.consume(queueName, message => {
      console.log('Received ', message.content.toString())

    }, { noAck: true })
  }
  catch (error) { console.error(error) }
}

runConsumer().catch(console.error)