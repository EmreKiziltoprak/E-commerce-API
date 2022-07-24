const {verifyTokenAndAuth, verifyTokenAdmin} = require("../middleware/VerifyToken");
const CryptoJs = require("crypto-js");
const Product = require("../models/Product");
const router = require("express").Router()

//ONLY ADMIN CAN CREATE A PRODUCT
router.post("/", verifyTokenAdmin, async (req, res) => {

    const newProduct = new Product(req.body)

    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }
})

//EDIT PRODUCT
router.put("/:id", verifyTokenAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {$set: req.body},
            {new: true}
        ); //UPDATES

        res.status(200).json(updatedProduct)

    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }
})

//DELETE PRODUCT

router.delete("/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }
})

//GET WITH ID
router.get("/:id", async (req, res) => {
    try {
        const Product = await Product.findById(req.params.id)
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }
})

//GET ALL PRODUCTS
router.get("/", async (req, res) => {

    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {

        let products;

        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(1);
        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                },
            });
        } else {
            products = await Product.find();
        }

        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router