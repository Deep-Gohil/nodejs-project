const express = require('express');
const connectToDatabase = require('./config/db');
const userRouter = require('./routes/userRouter');
require("dotenv").config()
const cors = require('cors');

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors());

app.get("/",(req,res)=>{
    res.status(200).json({msg:"Default Route "});
});

app.use("/user",userRouter)



const PORT = process.env.PORT || 8090;
app.listen(PORT,()=>{
    console.log(`listening on https:localhost:${PORT}`);
    connectToDatabase()
})