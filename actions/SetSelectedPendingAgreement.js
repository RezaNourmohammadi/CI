  /**
   * Extract selected option and store into temp memory for control
   * @title Set Selected Pending Agreement
   * @category Arty
   * @author Jonathan Arias
   * @param {string} value - selected value encoded as {studioId}::{agreementId}
   */
  const setSelectedAgreement = async value => {
    const values = value.split('::')
    delete temp.pending_agreements_check
    bp.logger.info('--set selected pending agreement')
    bp.logger.info('--values--')
    bp.logger.info(values)
    bp.logger.info(`Selected Agreement: ` + temp.interview_api_template)
    bp.logger.info(event.payload.text)
    bp.logger.info('---pending agreements---')
    bp.logger.info(JSON.stringify(temp.pending_agreements))
    bp.logger.info('--temp.interview_api_template--')
    bp.logger.info(temp.interview_api_template)
    bp.logger.info(typeof temp.interview_api_template)

    const text = event.payload.text;

    if (text.includes('undefined')) {
      temp.pending_agreements_check = true
      bp.logger.info('true')
    } else {
      temp.pending_agreements_check = false
      bp.logger.info('false')
    }

    bp.logger.info('--pending agreements check--')
    bp.logger.info(temp.pending_agreements_check)

    if (values.length == 2) {
      temp.interview_api_studio = values[0]
      temp.interview_api_template = `interview_from_template_` + values[1] + `.yml`

      bp.logger.info('--set selected pending agreement')
      bp.logger.info(`Selected Agreement: ` + temp.interview_api_template)
      bp.logger.info(event.payload.text)
    }
  }

  return setSelectedAgreement(args.value)