import dotenv from 'dotenv-safe'
import mongoose from 'mongoose'

dotenv.config()

async function main() {
  await mongoose.connect(
    `mongodb://${process.env.MONGO_DB_USERNAME}:${
      process.env.MONGO_DB_PASSWORD
    }@${
      !process.env.MONGO_DB_ADDRESS ? 'database' : process.env.MONGO_DB_ADDRESS
    }:27017/icfj?authSource=admin`
  )
  console.log(
    `Database connected to ${
      !process.env.MONGO_DB_ADDRESS
        ? 'database container'
        : process.env.MONGO_DB_ADDRESS
    }!`
  )
}

main().catch((err) => console.log(err))
