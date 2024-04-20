/**
   * Small description of your action
   * @title The title displayed in the flow editor
   * @category Custom
   * @author Your_Name
   * @param {string} name - An example string variable
   * @param {any} value - Another Example value
   */
  const myAction = async () => {

    // Check if the session has the necessary variables set for the array-type question
if (session.uiSchema && session.question) {
  // Extract the necessary variables from the session
  const uiSchema = session.uiSchema;
  const question = session.question;

  // Log that this is an array-type question
  bp.logger.info('---this is an array-type question ----');

  // Create a form payload with the schema and uiSchema
  const form = {
    schema: question,
    uiSchema: uiSchema
  };

  // Reply to the event with a text message and a form widget
  await bp.events.replyToEvent(event, [
    {
      type: 'text',
      text: question.title,
      markdown: true, 
      question_key: event.payload.metadata.question_key
    },
    {
      type: 'widget',
      widget: 'form',
      payload: form
    }
  ]);
  
} else {
  // Log an error if the necessary variables are not set in the session
  bp.logger.error('Missing uiSchema or question in the session for array-type question');
}

  }

  return myAction()