const express = require("express");
const router = express.Router();
const uuidv1 = require("uuid/v1")
const fs = require("fs-extra");
const path = require("path");
const multer = require("multer");

const productsFilePath = path.join(__dirname, "products.json");
const reviewsFilePath = path.join(__dirname,"../reviews/reviews.json")

const readFile = async () => {
    const buffer = await fs.readFile(productsFilePath);
    const content = buffer.toString();
    return JSON.parse(content)
}

const readReviewsFile = async () =>{
    const buffer = await fs.readFile(reviewsFilePath);
    const content = buffer.toString();
    return JSON.parse(content)
}

router.get("/", async (req, res) => {
    const products = await readFile();
    if (Object.keys(req.query).length !=0){
    let filteredProducts = products.filter(product => 
        product.hasOwnProperty("category") && 
        product.category.toLowerCase() == req.query.category.toLowerCase())
        res.send(filteredProducts)
    }else{
    res.send(products);
    }
})

router.get("/:id", async (req, res) => {
    const products = await readFile();
    let product = products.find(product => product._id === req.params.id)
    if (product) {
        res.send(product)
    } else {
        res.status("404").send("Product not found")
    }
})

router.get("/:id/reviews", async (req,res)=>{
    const reviews = await readReviewsFile();
    const reviewForProduct = reviews.filter(review => review.elementId == req.params.id);
    if (reviewForProduct){
        res.send(reviewForProduct)
    }else{
        res.status("404").send("No reviews found")
    }
})

router.post("/", async (req, res) => {
    const products = await readFile();
    let newProduct = {
        ...req.body,
        _id: uuidv1(),
        createdAt: new Date(),
        updateAt: new Date()
    }

    products.push(newProduct);
    await fs.writeFile(productsFilePath, JSON.stringify(products));
    res.send(newProduct);
})

const multerConfig = multer({});
router.post("/id/upload", multerConfig.single("prodPic"), async (req, res) => {
    const products = await readFile();
    const product = products.find(product => product._id == req.params.id)
    if (product) {
        const filedestination = path.join(__dirname,"../../images", req.params.id + path.extname(req.file.originalname))
        await fs.writeFile(filedestination, req.file.buffer)
        product.updateAt = new Date();
        product.imageURL = "/images/" + req.params.id + path.extname(req.file.originalname);
        await fs.writeFile(productsFilePath, JSON.stringify(products))
        res.send(product)
    } else {
        res.status("404").send("Product not found")
    }
})

router.delete("/:id", async (req, res) => {
    const products = await readFile();
    let productsToRemained = products.filter(product => product._id !== req.params.id);
    if (productsToRemained.length < products.length) {
        await fs.writeFile(productsFilePath, JSON.stringify(productsToRemained));
        res.send("removed");
    } else {
        res.status("404").send("product not found");
    }
})

router.put("/:id", async (req, res) => {
    const products = await readFile();
    let productsToEdit = products.find(product => product._id == req.params.id);
    if (productsToEdit) {
        delete req.body._id
        delete req.body.createdAt
        req.body.createdAt = new Date()
        let editedProduct = Object.assign(productsToEdit, req.body)
        let editedProductPosition = products.indexOf(productsToEdit)
        products[editedProductPosition] = editedProduct
        await fs.writeFile(productsFilePath, JSON.stringify(products))
        res.send(products)
    } else {
        res.status("404").send("product not found")
    }
})

module.exports = router;