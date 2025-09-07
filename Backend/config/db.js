    import mongoose from "mongoose"

export const connectDB = async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/todos")
        console.log(`Connected to MongoDB ${conn.connection.host}`)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
