  /**
   * Small description of your action
   * @title The title displayed in the flow editor
   * @category Custom
   * @author Your_Name
   * @param {string} name - An example string variable
   * @param {any} value - Another Example value
   */
  const init_Question_info = async () => {
    session.questions_info = {}
    session.api_response = undefined
    session.answered_questions_fields = [];
  }

  return init_Question_info()