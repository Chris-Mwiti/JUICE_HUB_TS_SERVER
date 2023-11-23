"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("./helpers/logger"));
const errHandler_1 = __importDefault(require("./middlewares/errHandler"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const corsConfig_1 = __importDefault(require("./config/corsConfig"));
const auth_routes_1 = __importDefault(require("./routes/auth/auth.routes"));
const passport_google_config_1 = __importDefault(require("./config/passport-google-config"));
const product_routes_1 = __importDefault(require("./routes/api/product.routes"));
/* ---------------- Server set up ----------------------- */
const app = (0, express_1.default)();
/* -------------- MiddleWares Setup -------------- */
dotenv_1.default.config();
app.use((0, cors_1.default)(corsConfig_1.default));
//Cookies setup
app.use((0, express_session_1.default)({
    secret: process.env.COOKIE_SESSION_KEY,
    saveUninitialized: true,
    resave: false,
    cookie: {
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
    },
}));
//Passport intialization
app.use(passport_google_config_1.default.initialize());
app.use(passport_google_config_1.default.session());
app.use((0, cookie_parser_1.default)());
// Body parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// Request Logger
app.use(logger_1.default.RequestLogger);
/* -------------- Routes Setup ----------------- */
// Auth routes
app.use("/auth", auth_routes_1.default);
app.use("/api/product", product_routes_1.default);
// Error Logger 
app.use(errHandler_1.default.ErrHandler);
app.listen(process.env.DEVELOPMENT_PORT, () => {
    console.log("The sever is up and running on port: " + process.env.DEVELOPMENT_PORT);
});
