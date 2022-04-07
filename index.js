const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const mongoose = require("mongoose");

//route import
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");

require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middle-wares
app.use(cors());
app.use(express.json());
app.use(
    fileUpload({
        useTempFiles: true,
    })
);

//mongodb connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.to2ak.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
async function run() {
    try {
        // mongoose connection
        mongoose.connect(
            uri,
            { useNewUrlParser: true, useUnifiedTopology: true },
            () => console.log(" Mongoose is connected")
        );

        //api endpoint
        app.use("/auth", authRoute);
        app.use("/product", productRoute);
        app.use("/user", userRoute);
    } finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("OthobaMart Backend API");
});

app.listen(port, () => {
    console.log(`listening at ${port}`);
});
