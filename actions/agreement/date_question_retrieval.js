/**
 * Small description of your action
 * @title The title displayed in the flow editor
 * @category Custom
 * @author Iman
 * @param {string} name - An example string variable
 * @param {any} value - Another Example value
 */
// Define an async function to contain the code
const executeAsyncFunction = async () => {
  // Place the provided code here
  bp.logger.info('---- i am in date_question_retrieval----')
  // Assuming session.question_Title contains the question title
  const title = session.question_Title

  // Generate the message with the question title
  let message = `${title}`

  // Display the datepicker widget with MM-DD-YYYY format
  await bp.events.replyToEvent(event, [
    {
      type: 'text',
      text: message,
      markdown: true, 
      question_key: event.payload.metadata.question_key
    },
    {
      type: 'widget',
      widget: 'datepicker',
      text: message,
      payload: {
        format: 'MM-DD-YYYY' // Set the format to MM-DD-YYYY
      }
    }
  ])
}

// Call the async function
executeAsyncFunction()
  .then(() => {
    console.log('Execution completed successfully.')
  })
  .catch(error => {
    console.error('Error occurred:', error)
  })