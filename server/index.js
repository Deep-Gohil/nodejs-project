const express = require('express');
const connectToDatabase = require('./config/db');
require("dotenv").config()

const app = express()

app.get("/",(req,res)=>{
    res.status(200).json({msg:"Default Route "});
});




const PORT = process.env.PORT || 8090;
app.listen(PORT,()=>{
    console.log(`listening on https:localhost:${PORT}`);
    connectToDatabase()
})