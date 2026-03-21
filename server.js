import app from './src/app.js'

const PORT = 3032
const HOST = 'localhost'
const AUTHOR = 'nguyenan'

const server = app.listen(PORT, HOST, () => {
  console.log(`Hello ${AUTHOR}, I am running at  http://${HOST}:${PORT}`)
})


process.on('SIGINT', () => {
  console.log('Shutting down server...')
  server.close(() => {
    console.log('Server stopped')
    process.exit(0)
  })
})