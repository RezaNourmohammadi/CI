  /**
   * Check if the user's response matches any of the stored workspace names
   * @title Check Valid Workspace
   * @category Custom
   * @author Iman
   * @param {string} name - An example string variable
   * @param {any} value - Another Example value
   */
  const workspaceValid = async () => {
    // Check if userInput matches any workspace name stored in session
    let userInput = event.payload.text
    bp.logger.info('--- i am in valid_workspace ---')
    bp.logger.info('user input')
    bp.logger.info(userInput)
    bp.logger.info('user input type: ')
    bp.logger.info(typeof userInput)
    let num = Number(userInput)
    bp.logger.info('number input type: ')
    bp.logger.info(typeof num)

    bp.logger.info('session.sorkspaceIDS')
    bp.logger.info(session.workspaceIDs)

    const isValid = session.workspaceIDs.includes(num)

    session.isValidWorkspace = isValid

    bp.logger.info('valid workspace or not?')
    if (isValid) {
      bp.logger.info('true')
    } else {
      bp.logger.info('false')
    }
  }

  return workspaceValid()