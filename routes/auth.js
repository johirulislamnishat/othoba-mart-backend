const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const userSchema = require("../schemas/userSchema");
const User = new mongoose.model("User", userSchema);

// customer register
router.post("/register", async (req, res) => {
    const newUser = new User({
        user_name: req.body.user_name,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SECRET
        ).toString(),
    });
    await newUser.save((err) => {
        if (err) {
            // console.log(err);
            res.status(500).json({
                status: 1,
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({
                status: 0,
                message: "User added successfully!",
            });
        }
    });
});

// vendor register
router.post("/register/vendor", async (req, res) => {
    // console.log(req.body);
    const newVendor = new User({
        user_name: req.body.user_name,
        email: req.body.email,
        shop_name: req.body.shop_name,
        isVendor: true,
        password: CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SECRET
        ).toString(),
    });
    await newVendor.save((err) => {
        if (err) {
            // console.log(err);
            res.status(500).json({
                status: 1,
                error: "There was a server side error!",
            });
        } else {
            res.status(200).json({
                status: 0,
                message: "Vendor added successfully!",
            });
        }
    });
});

//login
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({
            user_name: req.body.user_name,
        });
        // console.log(user);
        !user &&
            res.status(500).json({
                status: 1,
                error: "Wrong User/Password!",
            });
        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        const inputPassword = req.body.password;
        originalPassword !== inputPassword &&
            res.status(500).json({
                status: 1,
                error: "Wrong User/Password!",
            });
        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
                isSuperAdmin: user.isSuperAdmin,
                isCustomer: user.isCustomer,
                isVendor: user.isVendor,
                vendor_status: user.vendor_status,
                shop_id: user?.shop,
            },
            process.env.JWT_SEC,
            { expiresIn: "1d" }
        );
        const { password, ...others } = user._doc;
        res.status(200).json({ status: 0, ...others, accessToken });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

module.exports = router;
