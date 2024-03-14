import { Router } from "express";
import GooglePassportStrategy from "../../config/passport-google-config";
import JWTMiddlewareAssigner from "../../middlewares/jwtAssigner";
import verifyUser from "../../middlewares/verifyUser";
import RegisterController from "../../controllers/auth/Register.controller";

/**
 * Authentification Router
 *
 * Paths: "/login", "/logout", "/google", "/login/google", "/login/google/redirect", "/register"
 */

const AuthRouter = Router();

AuthRouter.post('/register', async(req,res) => {
  const registerController = new RegisterController(req,res);
  await registerController.createUser();
})
//Login route
AuthRouter.post('/login', verifyUser, JWTMiddlewareAssigner)

// Logout route
AuthRouter.get("/logout", (req, res) => {
  res.send("You are being logged out");
});

//Google strategy login
AuthRouter.get(
  "/login/google",
  GooglePassportStrategy.authenticate("google", {
    scope: ["email", "profile"],
  })
);

//Google callback redirect url
AuthRouter.get(
  "/login/google/redirect",
  GooglePassportStrategy.authenticate("google"),
  JWTMiddlewareAssigner,
  (req, res) => {
    res.status(200).json({msg: "Ok"});
  }
);

export default AuthRouter;
