const express = require ("express");
const server = express();
const PORT = 4000;
const productsServices = require("./src/services/products/products");
const reviewsServices = require("./src/services/reviews/reviews");
const path = require ("path")
const cors = require ("cors")

server.use(cors())
server.use(express.json());
server.use("/products", productsServices);
server.use("/reviews", reviewsServices);
server.use("/images", express.static(path.join(__dirname,"images")))

server.listen(PORT, ()=>{
    console.log(`Yo my man, your server is running at port ${PORT} `)
})