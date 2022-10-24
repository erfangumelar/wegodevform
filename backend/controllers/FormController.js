import mongoose from "mongoose";
import Form from "../models/Form.js";

class FormController {
  async store(req, res) {
    try {
      const form = await Form.create({
        userId: req.jwt.id,
        title: "Untitled Form",
        description: null,
        public: true,
      });

      if (!form) {
        throw { code: 500, message: "FAILED_CREATE_FORM" };
      }

      return res.status(200).json({
        status: true,
        message: "SUCCESS_CREATE_FORM",
        form,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async show(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 404, message: "REQUIRED_FORM_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }

      // mengecek form ke database
      const form = await Form.findOne({
        _id: req.params.id,
        userId: req.jwt.id,
      });

      // mengecek apakah form ada / tidak
      if (!form) {
        throw { code: 400, message: "FORM_NOT_FOUND" };
      }

      return res.status(200).json({
        status: true,
        message: "FORM_FOUND",
        form,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new FormController();
