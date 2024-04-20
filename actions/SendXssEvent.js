  /**
   * Small description of your action
   * @title Send Xss Event
   * @category Arty
   * @author Jonathan Arias
   * @param {string} action - An example string variable
   * @param {string} payload - Another Example value
   */
  const sendXssEvent = async (action, payload) => {
    bp.logger.info('--view agreement/XssEvent')
    bp.logger.info('action')
    bp.logger.info(action)
    bp.logger.info('payload')
    bp.logger.info(payload)
    bp.logger.info('---temp.interview_api_agreement---')
    bp.logger.info(temp.interview_api_agreement)
    bp.logger.info(`XSS Event ` + payload)
    await bp.events.replyToEvent(event, [
      {
        type: 'xss-event',
        function: action,
        payload: JSON.parse(payload)
      }
    ])
  }

  return sendXssEvent(args.action, args.payload)