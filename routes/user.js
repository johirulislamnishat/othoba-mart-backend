const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const CryptoJS = require("crypto-js");
const userSchema = require("../schemas/userSchema");
const User = new mongoose.model("User", userSchema);
const {
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("./verifyToken");

// FETCH USERS
router.get("/all", verifyTokenAndAdmin, async (req, res) => {
    await User.find({})
        .populate("shop", "-__v -createdAt -updatedAt -vendor")
        .select("-__v -createdAt -updatedAt -password ")
        .exec((err, data) => {
            if (err) {
                res.status(500).json({
                    status: 1,
                    error: "There was a server side error!",
                });
            } else {
                res.status(200).json({
                    status: 0,
                    result: data,
                    message: "Users data retrieve successfully!",
                });
            }
        });
});

//GET SINGLE USER
router.get("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json({
            status: 0,
            result: others,
            message: "User data retrieve successfully!",
        });
    } catch (err) {
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

//UPDATE SINGLE USER
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString();
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json({
            status: 0,
            result: updatedUser,
            message: "User data updated successfully!",
        });
    } catch (err) {
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

//UPDATE USER PASSWORD
router.put(
    "/changepassword/:id",
    verifyTokenAndAuthorization,
    async (req, res) => {
        try {
            const newPass = CryptoJS.AES.encrypt(
                req.body.password,
                process.env.PASS_SECRET
            ).toString();
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: {
                        password: newPass,
                    },
                },
                { new: true }
            );
            res.status(200).json({
                status: 0,
                result: updatedUser,
                message: "Password updated successfully!",
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                status: 1,
                error: "There was a server side error!",
            });
        }
    }
);
//UPDATE SINGLE USER
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC
        ).toString();
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json({
            status: 0,
            result: updatedUser,
            message: "User data updated successfully!",
        });
    } catch (err) {
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

//DELETE A USER
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: 0,
            message: "User deleted successfully!",
        });
    } catch (err) {
        res.status(500).json({
            status: 1,
            error: "There was a server side error!",
        });
    }
});

module.exports = router;
