import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import LoggerHelper from "../src/helpers/logger";
import ErrMiddleWareHandler from "../src/middlewares/errHandler";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import cors from "cors";
import corsOptions from "../src/config/corsConfig";
import AuthRouter from "../src/routes/auth/auth.routes";
import GooglePassportStrategy from "../src/config/passport-google-config";
import ProductRouter from "../src/routes/api/product.routes";
import DiscountRouter from "../src/routes/api/discounts.routes";
import CategoryRouter from "../src/routes/api/category.routes";
import OrdersRouter from "../src/routes/api/orders.routes";
import GraphRouter from "../src/routes/api/graphs.routes";
import UsersRouter from "../src/routes/api/users.routes";

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
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

// Request Logger
app.use(LoggerHelper.RequestLogger);

/* -------------- Routes Setup ----------------- */

app.get("/", (req,res) => res.send("Welcome to Madrigal"));

// Auth routes
app.use("/auth", AuthRouter);

//API routes
app.use("/api/users", UsersRouter);
app.use("/api/product", ProductRouter);
app.use("/api/discounts", DiscountRouter);
app.use("/api/category", CategoryRouter);
app.use("/api/orders", OrdersRouter);
app.use("/api/graphs",GraphRouter);

/** -------- End of Routes setup  */

// Error Logger 
app.use(ErrMiddleWareHandler.ErrHandler);


/** ----------- End of middlewares setup -------------- */

//Server port listener
app.listen(process.env.DEVELOPMENT_PORT, () => {
  console.log(
    "The sever is up and running on port: " + process.env.DEVELOPMENT_PORT
  );
});
