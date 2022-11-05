const questionRequiredButEmpty = async (form, answers) => {
  // mencari question didalam form
  const found = form.questions.filter((question) => {
    // pengecekan question yg memiliki required true
    if (question.required === true) {
      // mencocokan data answer id yg dikirim user dengan yang didatabase
      const answer = answers.find((answer) => answer.questionId == question.id);

      // pengecekan answer yang diinput oleh user
      if (
        answer == undefined ||
        answer.value == undefined ||
        answer.value == ""
      ) {
        return true;
      }
    }
  });
  return found.length > 0 ? true : false;
};

export default questionRequiredButEmpty;
