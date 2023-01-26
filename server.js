require("dotenv").config(); // load all .env variables

const express = require("express");
const app = express();
const mongoose = require("mongoose");

const port = process.env.SERVER_PORT || 3301;

mongoose.set("strictQuery", true);
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.on("open", (error) => console.log("Connected to Database"));

app.use(express.json()); // use express json middleware;

const userRouter = require("./routes/users");
app.use("/users", userRouter);

app.listen(port, () => console.log(`server started on port:${port}`));
