  const showQuestionWithOptions = async () => {
    // Retrieve question title and options from session
    const questionTitle = session.question_Title
    const options = session.enum_Options

    // Prepare message payload with question title and options
    const message = {
      type: 'single-choice',
      text: questionTitle,
      question_key: event.payload.metadata.question_key,
      choices: options.map(option => {
        return { title: option, value: option }
      })
    }

    // Send the message payload to the user
    await bp.events.replyToEvent(event, [message])

    // delete session.enum_Options;
  }

  // Call the function within an async context
  ;(async () => {
    // Call the function to show the question with options
    await showQuestionWithOptions()
  })()