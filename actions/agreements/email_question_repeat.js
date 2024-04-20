  /**
   * Small description of your action
   * @title The title displayed in the flow editor
   * @category Custom
   * @author Iman
   */
  const Email_correct_question = async () => {
    const message = 'Please enter a valid email address in the format: yourname@example.com'

    // Send the corrected message to the chatbot interface
    await bp.events.replyToEvent(event, [
      {
        type: 'text',
        text: message,
        markdown: true,
        question_key: event.payload.metadata.question_key
      }
    ])
  }

  return Email_correct_question()