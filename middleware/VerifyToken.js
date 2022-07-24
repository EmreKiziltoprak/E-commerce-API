const jwt = require("jsonwebtoken")

//HANDLE GIVEN TOKEN IF TOKEN IS NOT VALID OR EXPIRED THROW AN ERROR
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];

        console.log( token)

        jwt.verify(token, process.env.JWT_SEC, (err, user) => {

            if (err) {
                console.log(err)
                res.status(403).json("Token is not valid!");
            }
            req.user = user;
            console.log("user", user)
            next();

        });
    } else {
        return res.status(401).json("You are not authenticated!");
    }
};

const verifyTokenAdmin = (req, res, next) => {

    //ONLY NEXT IS DECLARED
    verifyToken(req, res, () => {

        //DECONSTRUCT JWT AND CONTROL PARAMS ID WITH RESPECT TO JWT USER ID
        if(req.user.isAdmin){
            next() //CONTINUE ROUTE FUNCTION AUTHORIZED
        }
        else {
            res.status(403).json("Not authorized !")
        }

    })
}

const verifyTokenAndAuth = (req, res, next) => {

    //ONLY NEXT IS DECLARED
    verifyToken(req, res, () => {

        //DECONSTRUCT JWT AND CONTROL PARAMS ID WITH RESPECT TO JWT USER ID
        if((req.user.id === req.params.id) || req.user.isAdmin){
                next() //CONTINUE ROUTE FUNCTION AUTHORIZED
        }
        else {
            res.status(403).json("Not authorized !")
        }

    })
}
module.exports = {verifyToken,verifyTokenAdmin, verifyTokenAndAuth}