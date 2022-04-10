const jwt = require("jsonwebtoken");

// jwt token verify
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) res.status(403).json("Token is not valid!");
            req.user = user;
            console.log(user);
            next();
        });
    } else {
        return res.status(401).json("Unauthorized request!");
    }
};

// admin or customer
const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin || req.user.isCustomer) {
            next();
        } else {
            res.status(403).json("Unauthorized request!");
        }
    });
};

// admin verify
const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("Unauthorized request!");
        }
    });
};

//admin or vendor
const verifyTokenAndAdminOrVendor = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin || req.user.isVendor) {
            next();
        } else {
            res.status(403).json("Unauthorized request!");
        }
    });
};

//admin or vendor or superadmin
const verifyTokenAndSuperAdminOrVendor = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin || req.user.isVendor || req.user.isSuperAdmin) {
            next();
        } else {
            res.status(403).json("Unauthorized request!");
        }
    });
};

module.exports = {
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
    verifyTokenAndAdminOrVendor,
    verifyTokenAndSuperAdminOrVendor,
};
