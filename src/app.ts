import express from "express";
import cors, { CorsOptions } from "cors";
import { env } from "./config/env";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import formRouter from "./routes/form.route";
import responseRouter from "./routes/response.route";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

const corsOptions: CorsOptions = {
  origin: env.FRONTEND_URL,
  methods: ["GET", "POST", "UPDATE", "PUT", "PATCH", "OPTIONS"],
  credentials: true,
};

//middlewares
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/form", formRouter);
app.use("/response", responseRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

//global error handler middleware
app.use(errorHandler);

export default app;
