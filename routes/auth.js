const router = require("express").Router()
const User = require("../models/User")
const dotenv = require("dotenv").config()
const CryptoJs = require("crypto-js")
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req, res) => {
    console.log(req)

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJs.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),

    })

    try {


        const savedUser = await newUser.save()
        console.log(savedUser)

        res.status(201).json(savedUser)

    } catch (e) {

        res.status(500).json(e)

    }

})

//LOGIN

router.post("/login", async (req, res) => {


    try {
        const user = await User.findOne(
            {
                username: req.body.username
            }
        );

        if (user == null) {
            res.status(401).json("Wrong User Name");
        } else {

            const hashedPassword = CryptoJs.AES.decrypt(
                user.password,
                process.env.PASS_SEC
            );

            const originalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);

            const inputPassword = req.body.password;


            console.log("ORIGINAL PASS: " + originalPassword)
            console.log("INPUT PASS: " + inputPassword)

            if (originalPassword != inputPassword) {
                res.status(401).json("Wrong Password");
            } else {

                const accessToken = jwt.sign(
                    {
                        id: user._id,
                        isAdmin: user.isAdmin,
                    },
                    process.env.JWT_SEC,
                    {expiresIn: "3d"}
                );

                const {password, ...others} = user._doc;
                res.status(200).json({...others, accessToken});

            }
        }
    } catch (e) {

        res.status(500).json(e)

        console.log(e)
    }

})


module.exports = router