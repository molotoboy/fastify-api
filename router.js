// const { server } = require("./server")
// server.get("/", async () => "OK")
// https://www.youtube.com/watch?v=xgaHchlck-w
const path = require("path")
const glob = require("glob")
const has = require("lodash/has")
const forEach = require("lodash/forEach")
const isFunction = require("lodash/isFunction")
const isArray = require("lodash/isArray")
const { server } = require("./server")

const schemasRoot = path.join(__dirname, "schemas")
const schemas = glob.sync(`${schemasRoot}/**/*.json`)

const routesDir = path.join(__dirname, "routes")
glob.sync(`${routesDir}/**/*.js`).forEach((routePath) => {
  const extname = path.extname(routePath)
  const routeName = path.basename(routePath, extname)

  const routeMethods = require(routePath)
  //const routeMethods = Object.keys(module)

  const cleanedPath =
    routeName === "index"
      ? routePath.slice(routesDir.length, routePath.length - "index.js".length)
      : routePath.slice(routesDir.length, routePath.length - ".js".length)

  forEach(routeMethods, (methodArgs, methodName) => {
    const schema = has(schemas, `${routeName}.${methodName}`)
      ? schemas[routeName][methodName]
      : {}

    if (isFunction(methodArgs)) {
      server[methodName](cleanedPath, { schema }, methodArgs)
    } else if (isArray(methodArgs)) {
      const [options] = methodArgs

      if (!options.schema) options.schema = schema
      server[methodName](cleanedPath, ...methodArgs)
    }
  })
})
