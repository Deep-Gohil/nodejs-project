const mongoose = require('mongoose')

const connectToDatabase = async()=>{
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log('Connected to MongoDB')
    } catch (error) {
        console.error('Failed to connect to MongoDB', error)
    }
}

module.exports = connectToDatabase;