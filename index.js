const express = require("express")
const authRoute = require("./routes/auth")
const userRoute = require("./routes/user")
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")

const productRoute = require("./routes/product")

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config()
mongoose.connect(process.env.MONGO_URL)
    .then(()=> {
        console.log("succesful")
    })
    .catch((e) => {
        console.log(e)
    })

app.use(express.json())
app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/product", productRoute)
app.use("/api/cart", cartRoute)
app.use("/api/order", orderRoute)

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

app.listen(process.env.PORT || 5000, ()=> {
    console.log("BACKEND SERVER IS RUNNING")
})