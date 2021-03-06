const express = require("express")
const router = express.Router();

const uuidv4 = require("uuid/v4")
const fs = require("fs-extra");
const path = require("path");
const {getProducts,getReviews,writeReviews} = require("../../data/dataHelper");
// const reviewsFilePath = path.join(__dirname, "reviews.json")
// const productsFilePath = path.join(__dirname, "../products/products.json")

// const readFile = async () => {
//     const buffer = await fs.readFile(reviewsFilePath)
//     const content = buffer.toString();
//     return JSON.parse(content);
// }

// const readProductsData = async () => {
//     const buffer = await fs.readFile(productsFilePath)
//     const content = buffer.toString();
//     return JSON.parse(content)
// }

router.get("/", async (req, res) => {
    console.log(res.sendAt)
    const reviews = await getReviews();
    res.send(reviews);
})

router.get("/:id", async (req, res) => {
    const reviews = await getReviews();
    const review = reviews.find(review => review._id == req.params.id);
    if (review) {
        res.send(review);
    } else {
        res.status("404").send("Review not found");
    }
})

router.post("/", async (req, res) => {
    
    const products = await getProducts();
    const previousReviews = await getReviews();
    const reviewForProduct = products.find(product => product._id === req.body.elementId);
    if (reviewForProduct) {
        const newReview = {
            ...req.body,
            _id: uuidv4(),
            createdAt: new Date(),
            updatedAt: new Date()
        }
        previousReviews.push(newReview);
        await writeReviews(previousReviews);
        res.send(newReview);
    } else {
        res.status("404").send("Element not found")
    }
})

router.delete("/:id", async (req, res) => {
    const reviews = await getReviews();
    let reviewsToRemain = reviews.filter(review => review._id !== req.params.id);
    if (reviewsToRemain.length < reviews.length) {
        await writeReviews(reviewsToRemain);
        res.send("removed");
    } else {
        res.status("404").send("Review not found");
    }
})

// router.delete("/",(req,res)=>{
//     res.send("delete is working")
// })

router.put("/:id", async (req, res) => {
    const products = await getProducts();
    const reviews = await getReviews();
    const reviewForProductToEdit = products.find(product => product._id === req.body.elementId)
    if (req.body.elementId && reviewForProductToEdit) {
        const reviewToEdit = reviews.find(review => review._id === req.params.id);
        if (reviewToEdit) {
            delete req.body._id;
            delete req.body.createdAt;
            req.body.createdAt = new Date();
            let editedReview = Object.assign(reviewToEdit, req.body);
            let position = reviews.indexOf(reviewToEdit);
            reviews[position] = editedReview;
            await writeReviews(reviews);
            res.send(editedReview);
        } else {
            res.status("404").send("Review not found");
        }
    } else {
        res.status("404").send("Element not found")
    }
})

module.exports = router