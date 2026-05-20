const jwt = require('jsonwebtoken');

const protect = async(req, res, next) => {
    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if(!token) {
            return res.status(401).json({
                message: "Not authorized login!!"
            });
        }
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            userId: verifiedToken.userId
        };
        next();
    }
    catch(error) {
        console.log(req.headers.authorization);
        res.status(500).json({
            message: "Error in authentication"
            
        });
    }
};

module.exports = { protect };