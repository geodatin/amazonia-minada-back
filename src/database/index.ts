import dotenv from 'dotenv-safe'
import mongoose from 'mongoose'

dotenv.config()

async function main() {
  await mongoose.connect(
    `mongodb://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@database:27017/infoamdm?authSource=admin`
  )
  console.log('Database connected!')
}

main().catch((err) => console.log(err))
