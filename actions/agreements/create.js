  const axios = require('axios')

  /**
   * Create Agreement
   * @title Save the agreement from interview in current session
   * @category Arty
   * @author Jonathan Arias
   * @param {number} studio_id - 11
   * @param {number} template_id - 11
   */
  const createAgreement = async (studio_id, template_id) => {
    const session_id = bp.dialog.createId(event)
    bp.logger.info('create.js')
    bp.logger.info('studio_id')
    bp.logger.info(studio_id)
    bp.logger.info('template_id')
    bp.logger.info(template_id)
    const id = template_id.replace(`interview_from_template_`, ``).replace(`.yml`, ``)
    const config = await bp.config.getBotpressConfig()
    const formsHost = config.services['arty-forms'].host
    const authToken = config.services['arty-forms'].authToken
    const payload = {
      workspaceId: studio_id
    }
    bp.logger.info(`Create Agreement Payload - : ` + JSON.stringify(payload))

    let api_response = await axios.post(formsHost + '/api/botpress/user/agreements/' + id, payload, {
      headers: {
        sessionId: session_id,
        AuthToken: authToken
      }
    })

    bp.logger.info(`Create Agreement API - : ` + JSON.stringify(api_response.data))

    temp.interview_api_agreement = typeof api_response.data.agreementIdentifier !== 'undefined' ? 
      api_response.data.agreementIdentifier : null
    bp.logger.info('---temp.interview_api_agreement---')
    bp.logger.info(temp.interview_api_agreement)
  }

  return createAgreement(args.studio_id, args.template_id)