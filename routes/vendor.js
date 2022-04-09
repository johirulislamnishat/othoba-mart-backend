const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const vendorSchema = require("../schemas/vendorSchema");
const Vendor = new mongoose.model("Vendor", vendorSchema);

// vendor register
router.post("/register", async (req, res) => {
    // console.log(req.body);
    const newVendor = new Vendor({
        vendor_name: req.body.vendor_name,
        email: req.body.email,
        shop_name: req.body.shop_name,
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

// vendor login
router.post("/login", async (req, res) => {
    try {
        const vendor = await Vendor.findOne({
            vendor_name: req.body.vendor_name,
        });
        // console.log(Vendor);
        !vendor &&
            res.status(500).json({
                status: 1,
                error: "Wrong Vendor/Password!",
            });
        const hashedPassword = CryptoJS.AES.decrypt(
            vendor.password,
            process.env.PASS_SEC
        );
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        const inputPassword = req.body.password;

        originalPassword != inputPassword &&
            res.status(500).json({
                status: 1,
                error: "Wrong Vendor/Password!",
            });
        const accessToken = jwt.sign(
            {
                id: vendor._id,
                isVendor: vendor.isVendor,
                isAdmin: vendor.isAdmin,
            },
            process.env.JWT_SEC,
            { expiresIn: "1d" }
        );
        const { password, ...others } = vendor._doc;
        res.status(200).json({ status: 0, ...others, accessToken });
    } catch (err) {
        // console.log(err);
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

module.exports = router;
