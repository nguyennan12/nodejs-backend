import { Client, Events, GatewayIntentBits } from 'discord.js'
import 'dotenv/config'

class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages
      ]
    })

    //add chanelId
    this.channelId = process.env.DISCORD_CHANNEL_ID

    this.client.on(Events.ClientReady, readyClient => {
      console.log(`Discord connected, logged in as ${readyClient.user.tag}`)
    })

    this.client.login(process.env.DISCORD_REFRESH_TOKEN)
  }

  sendToFormatCode(logData) {
    const { code, message = 'this is some additional information aboout the code.', title = 'code expamle' } = logData
    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt('00ff00', 16),
          title: title,
          description: '```json\n' + JSON.stringify(code, null, 2) + '\n```',
          timestamp: new Date().toISOString(),
        }
      ]
    }
    this.sendToMessage(codeMessage)
  }

  sendToMessage(message = 'message') {
    const channel = this.client.channels.cache.get(this.channelId)
    if (!channel) {
      console.error('Could not find the channel...', this.channelId)
      return
    }
    channel.send(message).catch(e => console.error(e))
  }
}

export const loggerService = new LoggerService()

