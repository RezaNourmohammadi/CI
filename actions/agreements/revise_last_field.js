  /**
   * Small description of your action
   * @title The title displayed in the flow editor
   * @category Custom
   * @author Your_Name
   * @param {string} name - An example string variable
   * @param {any} value - Another Example value
   */
  const lastField = async () => {
    // let question_fields = session.answered_questions_fields
    // if (session.isRepeat) {
    //   temp.interview_api_flow_field = question_fields[question_fields.length - 2]
    //   bp.logger.info('-----inside lastFied-----')
    //   bp.logger.info('temp.interview_api_flow_field')
    //   bp.logger.info(temp.interview_api_flow_field)
    // }

      bp.logger.info('-----inside lastFied-----')
      bp.logger.info('temp.interview_api_flow_field')
      bp.logger.info(temp.interview_api_flow_field)
      bp.logger.info('------session.answered_questions_fields-----')
      bp.logger.info(session.answered_questions_fields)
  }

  return lastField()