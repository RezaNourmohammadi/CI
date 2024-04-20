  const axios = require('axios')

  /**
   * Promt user studios or select default one
   * @title List User Studios
   * @category Arty
   * @author Jonathan Arias
   */
  const listStudios = async () => {
    const sessionId = bp.dialog.createId(event)
    const config = await bp.config.getBotpressConfig()
    const formsHost = config.services['arty-forms'].host
    const authToken = config.services['arty-forms'].authToken
    bp.logger.info('i am in studios/list')

    let api_response = await axios.get(formsHost + '/api/botpress/user/workspaces', {
      headers: {
        sessionId: sessionId,
        AuthToken: authToken
      }
    })

    temp.selected_studio = ' '
    bp.logger.info('---reading work spaces----')
    bp.logger.info(JSON.stringify(api_response.data))
    // bp.logger.info(JSON.stringify(api_response))
    //bp.logger.info(JSON.stringify(api_response.data.schema))
    if (typeof api_response.data !== 'undefined') {
      let options = []
      let workspaceIDs = []
      for (let i in api_response.data) {
        let option = api_response.data[i]
        options.push({
          label: option.name,
          value: option.id
        })
        workspaceIDs.push(option.id)

        if (option.current) {
          temp.default_studio = option
          temp.selected_studio = option.id
        }
      }

      bp.logger.info('selected_studio')
      bp.logger.info(temp.selected_studio)

      temp.available_studios_count = options.length
      temp.available_studios = { options: options }
      bp.logger.info('----workspace list----')
      bp.logger.info(workspaceIDs)
      session.workspaceIDs = workspaceIDs
    }
  }

  return listStudios()