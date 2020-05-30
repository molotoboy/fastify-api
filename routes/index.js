// const { server } = require("./server")
// server.get("/", async () => "OK")
function getUserInfo() {
  return "OK"
}

module.exports = {
  get: getUserInfo,
  post: getUserInfo,
}
