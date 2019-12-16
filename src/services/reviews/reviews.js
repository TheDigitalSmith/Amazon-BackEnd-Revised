const express = require("express")
const router = express.Router();

const uuidv4 = require("uuid/v4")
const fs = require("fs-extra");
const path = require ("path");

const reviewsFilePath = path.join(__dirname, "reviews.json")
const readData = async ()=>{
    const buffer = await fs.readFile(reviewsFilePath)
    const content = buffer.toString();
    return JSON.parse(content);
}

router.get("/", async(req,res)=>{
    const reviews = await readData();
    res.send(reviews);
})

router.use("/:id", async(req,res)=>{
    const reviews = await readData();
    const review = reviews.find(review => review._id == req.params.id);
    if (review){
        res.send(review);
    }else{
        res.status("404").send("Review not found");
    }
})

router.post("/", async(req,res)=>{
    const previousReviews = await readData();
    const newReview = {
        ...req.body,
        _id: uuidv4(),
        createdAt: new Date(),
    }
    previousReviews.push(newReview);
    await fs.writeFile(reviewsFilePath,JSON.stringify(previousReviews));
    res.send(newReview);
})

router.delete("/:id", async (req,res)=>{
    const reviews =  await readData();
    let reviewsToStay = reviews.filter(review => review._id !== req.params.id)
    if (reviewsToStay.length < reviews.length){
        await fs.writeFile(reviewsFilePath, JSON.stringify(reviewsToStay))
        res.send("removed")
    } else {
        res.status("404").send("Review not found")
    }
})

router.put("/:id", async ( req,res)=>{
    const reviews = await readData();
    const reviewToEdit = reviews.find(review=> review._id == req.params.id);
    if (reviewToEdit){
        delete req.body._id
        delete req.body.createdAt
        req.body.createdAt = new Date();
        let editedReview = Object.assign(reviewToEdit, req.body);
        let position = reviews.indexOf(reviewToEdit);
        reviews[position] = editedReview
        await fs.writeFile(reviewsFilePath, JSON.stringify(reviews))
        res.send(editedReview)
    }else{
        res.status("404").send("Review not found");
    }
})

module.exports = router