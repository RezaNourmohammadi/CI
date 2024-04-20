
  const axios = require('axios')

  const domyjob = async (bp, event) => {
    bp.logger.info('--draft.js--')
    bp.logger.info('--event.state.session.templateValid--')
    bp.logger.info(event.state.session.templateValid)

    if (event.state.session.templateValid) {
      if (event.payload.text == '---draft---') {
        const sessionId = bp.dialog.createId(event)
        const config = await bp.config.getBotpressConfig()
        const formsHost = config.services['arty-forms'].host
        const authToken = config.services['arty-forms'].authToken
        const template_id = extractNumberFromString(event.state.temp.interview_api_template)
        bp.logger.error(event)
        let draft_response = await axios.post(
          formsHost + '/api/botpress/user/agreements/' + template_id + '/draft',
          null,
          {
            headers: {
              sessionid: sessionId,
              AuthToken: authToken
            }
          }
        )
        /////////////
        bp.logger.error(draft_response)
        await bp.events.replyToEvent(event, [
          {
            type: 'xss-event',
            function: 'vueGoToDashboard',
            payload: JSON.parse('{}')
          }
        ])
        bp.dialog.jumpTo(sessionId, event, 'main.flow.json', 'go_to_dashboard')
        //////////
      }
    } else {
      bp.logger.info('no template')
    }
  }
  return domyjob(bp, event)

  function extractNumberFromString(str) {
    const parsedNumber = parseInt(str)
    if (!isNaN(parsedNumber)) {
      return parsedNumber
    }

    const lastUnderscoreIndex = str.lastIndexOf('_')
    if (lastUnderscoreIndex !== -1) {
      const numberStr = str.substring(lastUnderscoreIndex + 1)
      const number = parseInt(numberStr)
      if (!isNaN(number)) {
        return number
      }
    }

    return null
  }