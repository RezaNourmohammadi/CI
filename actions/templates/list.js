  const axios = require('axios')

  /**
   * Fetch all available templates for logged in user
   * @title Get Available Templates
   * @category Arty
   * @author Jonathan Arias
   */
  const getTemplates = async () => {
    const sessionId = bp.dialog.createId(event)
    const config = await bp.config.getBotpressConfig()
    const formsHost = config.services['arty-forms'].host
    const authToken = config.services['arty-forms'].authToken

    bp.logger.info('----i am in template/list---')

    let api_response = await axios.get(formsHost + '/api/botpress/user/templates', {
      headers: {
        sessionId: sessionId,
        AuthToken: authToken
      }
    })

    bp.logger.info(`Bot Templates API - response: ` + JSON.stringify(api_response.data))

    session.templates = api_response.data
    // bp.logger.info('--session templates--')
    // bp.logger.info(session.templates)

    if (typeof api_response.data !== 'undefined') {
      let options = []
      for (let i in api_response.data) {
        let option = api_response.data[i]
        options.push({
          label: option.title,
          value: option.id
        })
      }
      const message = {
        type: 'widget',
        widget: 'select',
        payload: { options: options }
      }
      await bp.events.replyToEvent(event, [message])
    }
  }

  return getTemplates()