  /**
   * Small description of your action
   * @title The title displayed in the flow editor
   * @category Custom
   * @author Iman
   * @param {string} name - An example string variable
   * @param {any} value - Another Example value
   */
  const showYesNoQuestion = async () => {
    // Retrieve question title from session
    const questionTitle = session.question_Title

    // Prepare message payload with question title and choices
    const message = {
      type: 'single-choice',
      text: questionTitle,
      question_key: event.payload.metadata.question_key,
      choices: [
        { title: 'Yes', value: 'Yes' },
        { title: 'No', value: 'No' }
      ]
    }

    // Send the message payload to the user
    await bp.events.replyToEvent(event, [message])
  }

  // Call the function within an async context
  ;(async () => {
    // Call the function to show the yes/no question
    await showYesNoQuestion()
  })()