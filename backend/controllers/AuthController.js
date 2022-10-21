import emailExist from "../libraries/emailExist.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

const env = dotenv.config().parsed;

// Membuat key accesstoken
const generateAccessToken = async (payload) => {
  return jsonwebtoken.sign(payload, env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  });
};

// Membuat refresh token
const generateRefreshToken = async (payload) => {
  return jsonwebtoken.sign(payload, env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  });
};

class AuthController {
  async register(req, res) {
    try {
      // Validasi form is required
      if (!req.body.fullname) {
        throw { code: 400, message: "FULLNAME_IS_REQUIRED" };
      }
      if (!req.body.email) {
        throw { code: 400, message: "EMAIL_IS_REQUIRED" };
      }
      if (!req.body.password) {
        throw { code: 400, message: "PASSWORD_IS_REQUIRED" };
      }
      if (req.body.password.length < 6) {
        throw { code: 400, message: "PASSWORD_MINIMUM_6_CHARACTERS" };
      }

      // Pengecekan Email Exist
      const isEmailExist = await emailExist(req.body.email);
      if (isEmailExist) {
        throw { code: 409, message: "EMAIL_ALREADY_EXIST" };
      }

      // Hash Password
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);

      const user = await User.create({
        fullname: req.body.fullname,
        email: req.body.email,
        password: hash,
      });

      // Pengecekan user login
      if (!user) {
        throw { code: 500, message: "USER_REGISTER_FAILED" };
      }

      return res.status(200).json({
        status: true,
        message: "USER_REGISTER_SUCCESS",
        user,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      // Cek form input
      if (!req.body.email) {
        throw { code: 400, message: "EMAIL_IS_REQUIRED" };
      }
      if (!req.body.password) {
        throw { code: 400, message: "PASSWORD_IS_REQUIRED" };
      }

      // cek email di database
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        throw { code: 404, message: "USER_NOT_FOUND" };
      }

      // cek password
      const isPasswordValid = await bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!isPasswordValid) {
        throw { code: 400, message: "INVALID_PASSWORD" };
      }

      // Acccess Token
      let payload = { id: user._id };
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);

      return res.status(200).json({
        status: true,
        message: "USER_LOGIN_SUCCESS",
        fullname: user.fullname,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async refreshToken(req, res) {
    try {
      if (!req.body.refreshToken) {
        throw { code: 400, message: "REFRESH_TOKEN_IS_REQUIRED" };
      }

      // Verify refresh token
      const verify = await jsonwebtoken.verify(
        req.body.refreshToken,
        env.JWT_REFRESH_TOKEN_SECRET
      );

      let payload = { id: verify.id };

      // Acccess Token Baru
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);

      return res.status(200).json({
        status: true,
        message: "REFRESH_TOKEN_SUCCESS",
        accessToken,
        refreshToken,
      });
    } catch (error) {
      //  cara 1 pengecekan error message
      /*
      if (error.message == "jwt expired") {
        error.message = "REFRESH_TOKEN_EXPIRED";
      } else if (
        error.message == "invalid signature" ||
        error.message == "jwt malformed" ||
        error.message == "jwt must be provided" ||
        error.message == "invalid token"
      ) {
        error.message = "INVALID_REFRESH_TOKEN";
      }
      */

      // cara 2 pengecekan error message
      const errorJwt = [
        "invalid signature",
        "jwt malformed",
        "jwt must be provided",
        "invalid token",
      ];

      if (error.message == "jwt expired") {
        error.message = "REFRESH_TOKEN_EXPIRED";
      } else if (errorJwt.includes(error.message)) {
        error.message = "INVALID_REFRESH_TOKEN";
      }

      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new AuthController();
