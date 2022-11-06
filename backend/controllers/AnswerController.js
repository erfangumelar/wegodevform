import mongoose from "mongoose";
import Form from "../models/Form.js";
import Answer from "../models/Answer.js";
import answerDuplicate from "../libraries/answerDuplicate.js";
import questionRequiredButEmpty from "../libraries/questionRequiredButEmpty.js";
import optionValueNotExist from "../libraries/optionValueNotExist.js";

class AnswerController {
  async store(req, res) {
    try {
      if (!req.params.formId) {
        throw { code: 400, message: "REQUIRED_FORM_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.formId)) {
        throw { code: 400, message: "INVALID_ID" };
      }

      // mengambil data form
      const form = await Form.findById(req.params.formId);

      // cek duplicate answers
      const isDuplicate = await answerDuplicate(req.body.answers);
      if (isDuplicate) {
        throw { code: 400, message: "DUPLICATE_ANSWER" };
      }

      // cek answer required but empty
      const questionRequiredEmpty = await questionRequiredButEmpty(
        form,
        req.body.answers
      );
      if (questionRequiredEmpty) {
        throw { code: 400, message: "QUESTION_REQUIRED_BUT_EMPTY" };
      }

      // cek option value not exist
      const optionNotExist = await optionValueNotExist(form, req.body.answers);
      if (optionNotExist) {
        throw {
          code: 400,
          message: "OPTION_VALUE_IS_NOT_EXIST",
          question: optionNotExist,
        };
      }

      // insert to database
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
        question: error.question || null,
      });
    }
  }
}

export default new AnswerController();
