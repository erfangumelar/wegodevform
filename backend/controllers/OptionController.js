import mongoose from "mongoose";
import Form from "../models/Form.js";

class OptionController {
  async store(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "REQUIRED_FORM_ID" };
      }
      if (!req.params.questionId) {
        throw { code: 400, message: "REQUIRED_QUESTION_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      if (!req.body.option) {
        throw { code: 400, message: "REQUIRE_OPTION" };
      }

      const option = {
        id: mongoose.Types.ObjectId(),
        value: req.body.option,
      };

      // store option
      const form = await Form.findOneAndUpdate(
        {
          id: req.params.id,
          userId: req.jwt.id,
        },
        { $push: { "questions.$[indexQuestion].options": option } },
        {
          arrayFilters: [
            {
              "indexQuestion.id": mongoose.Types.ObjectId(
                req.params.questionId
              ),
            },
          ],
          new: true,
        }
      );

      if (!form) {
        throw { code: 400, message: "ADD_OPTION_FAILED" };
      }

      return res.status(200).json({
        status: true,
        message: "ADD_OPTION_SUCCESS",
        option,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "REQUIRED_FORM_ID" };
      }
      if (!req.params.questionId) {
        throw { code: 400, message: "REQUIRED_QUESTION_ID" };
      }
      if (!req.params.optionId) {
        throw { code: 400, message: "REQUIRED_OPTION_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.questionId)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.optionId)) {
        throw { code: 400, message: "INVALID_ID" };
      }
      if (!req.body.option) {
        throw { code: 400, message: "REQUIRE_OPTION" };
      }

      // update option
      const form = await Form.findOneAndUpdate(
        {
          id: req.params.id,
          userId: req.jwt.id,
        },
        {
          $set: {
            "questions.$[indexQuestion].options.$[indexOption].value":
              req.body.option,
          },
        },
        {
          arrayFilters: [
            {
              "indexQuestion.id": mongoose.Types.ObjectId(
                req.params.questionId
              ),
            },
            { "indexOption.id": mongoose.Types.ObjectId(req.params.optionId) },
          ],
          new: true,
        }
      );

      if (!form) {
        throw { code: 400, message: "UPDATE_OPTION_FAILED" };
      }

      return res.status(200).json({
        status: true,
        message: "UPDATE_OPTION_SUCCESS",
        option: {
          id: req.params.optionId,
          value: req.body.option,
        },
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new OptionController();
