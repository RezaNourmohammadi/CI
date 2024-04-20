  /**
   * Corrects the message stored in session.question_Title for proper display
   * @title Correct Question Title Message
   * @category Custom
   * @author Your_Name
   */
  const correctQuestionTitleMessage = async () => {
    // Get the message from session.question_Title

    bp.logger.info('inside string_question')
    bp.logger.info('event.payload.metadata.question_key')
    bp.logger.info(event.payload.metadata.question_key)
    const message = session.question_Title

    // Decode HTML entities
    const correctedMessage = decodeHTML(message)

    // Send the corrected message to the chatbot interface
    await bp.events.replyToEvent(event, [
      {
        type: 'text',
        text: correctedMessage,
        markdown: true,
        //question_key: temp.interview_api_flow_field
        question_key: event.payload.metadata.question_key
      }
    ])
  }

  // HTML entity decoder function
  const decodeHTML = html => {
    const entities = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'",
      '&#x2F;': '/',
      '&#x60;': '`',
      '&#x3D;': '=',
      '&nbsp;': ' ' // Update to replace '&nbsp;' with a space character
    }

    return html.replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&#x2F;|&#x60;|&#x3D;|&nbsp;/g, match => {
      return entities[match]
    })
  }

  return correctQuestionTitleMessage()