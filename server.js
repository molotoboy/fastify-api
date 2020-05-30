const fastify = require("fastify")

const server = fastify({ logger: true })
exports.server = server

server.listen(3000).catch(console.error)

module.exports = { server }
