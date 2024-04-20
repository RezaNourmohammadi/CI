  /**
   * Corrects the message stored in session.question_Title for proper display
   * @title Correct Question Title Message
   * @category Custom
   * @author Iman
   */
  const correctQuestionTitleMessage = async () => {
    // Get the message from session.question_Title
    const message = session.question_Title

    // Decode HTML entities
    const correctedMessage = decodeHTML(message)

    // Send the corrected message to the chatbot interface
    await bp.events.replyToEvent(event, [
      {
        type: 'text',
        text: correctedMessage,
        markdown: true, 
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