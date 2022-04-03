const router = require('express').Router()
const User = require('../models/User')


//register
router.post('/register', async(req,res)=>{
    console.log(req.body)

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    })

    try{
        //save data to mongodb
        const savedUser = await newUser.save()

        //send respond to client
        res.status(201).json(savedUser)
    } catch (err) {
        res.status(500).json(err)
    }
})

//login
router.post('/login', async(req,res)=>{
try{
    //finding user
    const user = await User.findOne( { email: req.body.email} )
    const { password, ...others} = user._doc
  
    res.status(200).json(others)

} catch(err){
    res.status(500).json(err)
}
})

module.exports = router