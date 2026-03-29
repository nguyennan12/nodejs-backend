import { loggerService } from '#loggers/discord.log.js'

const pushToLogDiscord = async (req, res, next) => {
  try {
    loggerService.sendToFormatCode({
      title: `Method: ${req.method}`,
      code: req.method === 'GET' ? req.query : req.body,
      message: `${req.get('host')}${req.originalUrl}`
    })
    return next()
  }
  catch (error) { next(error) }
}

export {
  pushToLogDiscord
}