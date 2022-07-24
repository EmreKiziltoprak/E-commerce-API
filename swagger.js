const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger.json'
const endpointsFiles = ["./index.js", './routes/auth.js','./routes/cart.js','./routes/order.js','./routes/product.js','./routes/user.js']

swaggerAutogen(outputFile, endpointsFiles)