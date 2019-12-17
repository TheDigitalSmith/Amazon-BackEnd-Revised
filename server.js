const express = require ("express");
const server = express();
const PORT = 4000;
const productsServices = require("./src/services/products/products");
const reviewsServices = require("./src/services/reviews/reviews");
const path = require ("path")
const cors = require ("cors")


const middle = (req, res, next) =>{
    res.sendAt = new Date();
    console.log("New request to the review endpoint: " + req.method)
    next()
}

server.use(cors())
server.use(express.json());
server.use("/products", productsServices);
server.use("/reviews", middle, reviewsServices);
server.use("/images", express.static(path.join(__dirname,"images")))

server.listen(PORT, ()=>{
    console.log(`Yo my man, your server is running at port ${PORT} `)
})