import express from "express";
import authRouter from "./routes/auth.route";

const app = express();

//routes
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

export default app;
