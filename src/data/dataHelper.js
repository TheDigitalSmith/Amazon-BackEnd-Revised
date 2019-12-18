const fs = require("fs-extra");
const path = require("path");

const productsFile = path.join(__dirname,"products.json");
const reviewsFile = path.join(__dirname,"reviews.json");

module.exports = {
    getProducts: async() =>{
        const buffer = await fs.readFile(productsFile);
        const content = buffer.toString();
        return JSON.parse(content)
    },
    getReviews: async ()=>{
        const buffer = await fs.readFile(reviewsFile);
        const content = buffer.toString();
        return JSON.parse(content)
    },
    writeProducts: async (data)=>{
        await fs.writeFile(productsFile,JSON.stringify(data))
    },
    writeReviews: async (data)=>{
        await fs.writeFile(reviewsFile,JSON.stringify(data))
    }
}