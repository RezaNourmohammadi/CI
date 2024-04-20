  const axios = require('axios')

  /**
   * List all pending agreements for this user
   * @title List Pending Agreements
   * @category Arty
   * @author Jonathan Arias
   */
  const getPendingAgreements = async () => {
    const sessionId = bp.dialog.createId(event)
    const config = await bp.config.getBotpressConfig()
    const formsHost = config.services['arty-forms'].host
    const authToken = config.services['arty-forms'].authToken

    // let api_response = await axios.get(formsHost + '/api/bot/agreements', {
    //   headers: {
    //     sessionId: sessionId,
    //     AuthToken: authToken
    //   }
    // })

    let api_response = await axios.get(formsHost + '/api/botpress/user/pending_agreements', {
      headers: {
        sessionId: sessionId,
        AuthToken: authToken
      }
    })

    bp.logger.info('get pending agreements: api_response')
    bp.logger.info(bp.logger.info(JSON.stringify(api_response.data)))

    if (typeof api_response.data !== 'undefined') {
      let options = []
      for (let i in api_response.data) {
        let option = api_response.data[i]
        options.push({
          label: option.title,
          value: `${option.studioId}::${option.id}`
        })
      }

      temp.pending_agreements_count = options.length
      temp.pending_agreements = { options: options }
      bp.logger.info('--user input--')
      bp.logger.info(event.payload.text)
    }
  }

  return getPendingAgreements()