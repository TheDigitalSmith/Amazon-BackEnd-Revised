const express = require ("express");
const server = express();
const PORT = 4000;
const productsServices = require("./src/services/products/products");

server.use(express.json());
server.use("/products", productsServices);

server.listen(PORT, ()=>{
    console.log(`Yo my man, your server is running at port ${PORT} `)
})