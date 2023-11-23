import passport, { Passport } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import UserController from "../controllers/UserController";
import AuthController from "../controllers/auth/AuthController";
import trycatchHelper from "../util/functions/trycatch";
import { GoogleUser, IUser, UserRecordWithoutId } from "../models/Interfaces/IModels";

dotenv.config();

//Credentials set up
const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

//Google passport strategy initialization
const GooglePassportStrategy = new Passport();

//AuthController intialization
const authController = new AuthController("google");

// Serialization and deserialization of users
GooglePassportStrategy.serializeUser<string>((user, done) => {
  console.log("Serializing...");
  if ("id" in user) done(null, user.id);
});

GooglePassportStrategy.deserializeUser<string>((id, done) => {
  console.log("Deserializing...");
  if (id) {
    authController
      .getUser(id)
      .then((user) => done(null, user))
      .catch((error) => done((error as any).message, false));
  }
});

GooglePassportStrategy.use(
  new GoogleStrategy(
    {
      callbackURL: "/auth/login/google/redirect",
      clientID: clientID as string,
      clientSecret: clientSecret as string,
      scope: ["email", "profile"],
    },
    (accessToken, refreshToken, profile, done) => {
      // Creates a new user profile obj thats maps with the schema of the user model

      if("firstName" in profile && "lastName" in profile && "email" in profile){
        
      }

      const userProfile: UserRecordWithoutId = {
        firstName: profile.name?.givenName!,
        lastName: profile.name?.familyName!,
        email: profile._json?.email!,
        role: "user",
        googleId: profile.id,
        profileUrl: profile.photos ? profile.photos[0].value : null,
        phone: null,
        password:null
      };

      console.log(profile._json.email ? profile._json.email : undefined);

      try {
        // Checks if user exists before creating a new user
        authController.CheckIfUserExists(userProfile).then((currentUser) => {
          console.log(currentUser);
          if (!currentUser) {
            authController.CreateUser(userProfile).then((user) => {
              if (user) done(null, user);
            });
          } else {
            done(null, currentUser);
          }
        });
      } catch (error) {
        console.log("Error......");
        console.error((error as any).message);
        done((error as any).message, false);
      }
    }
  )
);

export default GooglePassportStrategy;
