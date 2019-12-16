const express = require("express");
const router = express.Router();
const uuidv1 = require("uuid/v1")
const fs = require("fs-extra");
const path = require("path");

const productsFilePath = path.join(__dirname, "products.json");

const readData = async () => {
    const buffer = await fs.readFile(productsFilePath);
    const content = buffer.toString();
    return JSON.parse(content)
}

router.get("/", async (req, res) => {
    res.send(await readData());
})

router.get("/:id", async (req, res) => {
    const products = await readData();
    let product = products.find(product => product._id === req.params.id)
    if (product) {
        res.send(product)
    }else {
        res.status("404").send("Product not found")
    }
})

router.post("/", async (req, res) => {
    const products = await readData();
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

router.delete("/:id", async (req, res) => {
    const products = await readData();
    let productsToRemained = products.filter(product => product._id !== req.params.id);
    if (productsToRemained.length < products.length) {
        await fs.writeFile(productsFilePath, JSON.stringify(productsToRemained));
        res.send("removed");
    } else {
        res.status("404").send("product not found");
    }
})

router.put("/:id", async (req, res) => {
    const products = await readData();
    console.log(products)
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