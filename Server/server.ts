import 'dotenv/config'
import app from "./src/app.js";
import { connectToDB } from "./src/config/database.js";
import { ENV } from "./src/config/env.js";

await connectToDB()

app.listen(ENV.PORT, () => {
    console.log(`server is listening at port ${ENV.PORT}`)
})