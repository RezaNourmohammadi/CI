  /**
   * @title Rich Response
   * @category UI
   * @author Jonathan Arias
   * @param {string} widget - UI Widget type such as: Suggestion chips, button, video
   * @param {json} payload - JSON Payload to configure the widget
   */
  const showWidget = async (widget, payload) => {
    let json = null
    if (typeof payload === 'string') {
      if (payload.search('temp.') !== -1 && typeof temp[payload.replace('temp.', '')] != 'undefined')
        json = temp[payload.replace('temp.', '')]
      else
        try {
          json = JSON.parse(payload)
        } catch (e) {
          bp.logger.info(`Invalid JSON payload: [` + typeof payload + `] ` + JSON.stringify(payload))
        }
    } else if (typeof payload === 'object') json = null

    bp.logger.info(`Rich Response JSON:` + JSON.stringify(json))

    const message = {
      type: 'widget',
      widget: widget,
      payload: json
    }

    await bp.events.replyToEvent(event, [message])
  }

  return showWidget(args.widget, args.payload)