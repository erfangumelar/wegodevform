import express from "express";
import jwtAuth from "../middlewares/jwtAuth.js";
import AuthController from "../controllers/AuthController.js";
import FormController from "../controllers/FormController.js";

const router = express.Router();

// Auth Controller
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh-token", jwtAuth(), AuthController.refreshToken);

// Form
router.post("/forms", jwtAuth(), FormController.store);

export default router;
