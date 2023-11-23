"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = require("passport");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const dotenv_1 = __importDefault(require("dotenv"));
const AuthController_1 = __importDefault(require("../controllers/auth/AuthController"));
dotenv_1.default.config();
//Credentials set up
const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
//Google passport strategy initialization
const GooglePassportStrategy = new passport_1.Passport();
//AuthController intialization
const authController = new AuthController_1.default("google");
// Serialization and deserialization of users
GooglePassportStrategy.serializeUser((user, done) => {
    console.log("Serializing...");
    if ("id" in user)
        done(null, user.id);
});
GooglePassportStrategy.deserializeUser((id, done) => {
    console.log("Deserializing...");
    if (id) {
        authController
            .getUser(id)
            .then((user) => done(null, user))
            .catch((error) => done(error.message, false));
    }
});
GooglePassportStrategy.use(new passport_google_oauth20_1.Strategy({
    callbackURL: "/auth/login/google/redirect",
    clientID: clientID,
    clientSecret: clientSecret,
    scope: ['email', 'profile'],
}, (accessToken, refreshToken, profile, done) => {
    var _a, _b, _c;
    // Creates a new user profile obj thats maps with the schema of the user model
    const userProfile = {
        firstName: (_a = profile.name) === null || _a === void 0 ? void 0 : _a.givenName,
        lastName: (_b = profile.name) === null || _b === void 0 ? void 0 : _b.familyName,
        email: (_c = profile._json) === null || _c === void 0 ? void 0 : _c.email,
        role: "user",
        googleId: profile.id,
        profileUrl: profile.photos ? profile.photos[0].value : undefined,
    };
    console.log(profile._json.email ? profile._json.email : undefined);
    try {
        // Checks if user exists before creating a new user
        authController.CheckIfUserExists(userProfile).then((currentUser) => {
            console.log(currentUser);
            if (!currentUser) {
                authController.CreateUser(userProfile).then((user) => {
                    if (user)
                        done(null, user);
                });
            }
            else {
                done(null, currentUser);
            }
        });
    }
    catch (error) {
        console.log("Error......");
        console.error(error.message);
        done(error.message, false);
    }
}));
exports.default = GooglePassportStrategy;
