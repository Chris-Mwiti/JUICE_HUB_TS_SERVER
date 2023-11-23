import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import LoggerHelper from "./helpers/logger";
import ErrMiddleWareHandler from "./middlewares/errHandler";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import cors from "cors";
import corsOptions from "./config/corsConfig";
import AuthRouter from "./routes/auth/auth.routes";
import GooglePassportStrategy from "./config/passport-google-config";
import ProductRouter from "./routes/api/product.routes";

/* ---------------- Server set up ----------------------- */

const app: Express = express();

/* -------------- MiddleWares Setup -------------- */

dotenv.config();
app.use(cors(corsOptions));

//Cookies setup
app.use(
  expressSession({
    secret: process.env.COOKIE_SESSION_KEY as string,
    saveUninitialized: true,
    resave: false,
    cookie: {
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

//Passport intialization
app.use(GooglePassportStrategy.initialize());
app.use(GooglePassportStrategy.session());
app.use(cookieParser());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request Logger
app.use(LoggerHelper.RequestLogger);

/* -------------- Routes Setup ----------------- */

// Auth routes
app.use("/auth", AuthRouter);
app.use("/api/product", ProductRouter);

// Error Logger 
app.use(ErrMiddleWareHandler.ErrHandler);

app.listen(process.env.DEVELOPMENT_PORT, () => {
  console.log(
    "The sever is up and running on port: " + process.env.DEVELOPMENT_PORT
  );
});
