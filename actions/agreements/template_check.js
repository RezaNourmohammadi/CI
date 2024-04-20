  /**
   * Small description of your action
   * @title The title displayed in the flow editor
   * @category Custom
   * @author Iman
   */
  const check_template = async () => {
    // Retrieve API response from session variable
    const templates = session.templates

    // Convert templates to JSON string
    const templatesJson = JSON.stringify(templates)

    // Retrieve user input
    const userInput = temp.interview_api_template
    bp.logger.info('--user template input--')
    bp.logger.info(userInput)
    bp.logger.info(typeof userInput)

    // Convert user input to lowercase for case-insensitive comparison
    const userInputLower = userInput.toLowerCase()

    let isTemplateValid = false

    // Loop through each template
    for (const template of templates) {
      // Extract title and convert to lowercase
      const title = template.title.toLowerCase()

      const id = template.id.toString()
      bp.logger.info('--type of id--')
      bp.logger.info(typeof id)
      bp.logger.info(id)

      // Compare user input with template title
      if (title === userInputLower || id == userInputLower) {
        // Match found
        bp.logger.info(`User input "${userInput}" matches template "${template.title}"`)
        temp.interview_api_template = id
        isTemplateValid = true
        // Add your logic here for when a match is found
        break // Exit the loop since we found a match
      }
    }

    session.templateValid = isTemplateValid

    // If the loop completes without finding a match
    bp.logger.info(`User input "${userInput}" does not match any template title`)
    // Add your logic here for when no match is found
  }

  return check_template()