import mongoose from "mongoose";
import Form from "../models/Form.js";
import Answer from "../models/Answer.js";

class AnswerController {
  async store(req, res) {
    try {
      if (!req.params.formId) {
        throw { code: 400, message: "REQUIRED_FORM_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.formId)) {
        throw { code: 400, message: "INVALID_ID" };
      }

      let fields = {};
      req.body.answers.forEach((answer) => {
        fields[answer.questionId] = answer.value;
      });

      const answers = await Answer.create({
        formId: req.params.formId,
        userId: req.jwt.id,
        ...fields,
      });

      if (!answers) {
        throw { code: 400, message: "ANSWER_FAILED" };
      }

      return res.status(200).json({
        status: true,
        message: "ANSWER_SUCCESS",
        answers,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new AnswerController();
