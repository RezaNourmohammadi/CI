/**
 * Action triggered when the chat widget is closed
 * @title Handle Chat Widget Closed
 * @category Custom
 * @author Iman
 */

// @ts-ignore
window.botpressWebChat.onEvent((event) => {
  if (event.type === 'UI.CLOSED') {
    handleChatWidgetClosed(); // Call the function to handle chat widget closure
  }
}, ['UI.CLOSED']);

const handleChatWidgetClosed = async () => {
  // Log statement to verify event triggering
  console.log('Chat widget closed event triggered');

  // Trigger a yes/no question
  const response = await bp.cms.renderElement('builtin_single-choice', {
    choices: ['Yes', 'No'],
    text: 'Do you want to save the information as a draft?'
  });

  // Depending on the user's choice, you can handle the logic accordingly
  if (response && response.text === 'Yes') {
    // Handle saving the information as a draft
    // You can implement the logic to save the information here
    // For example, you can store the conversation context or relevant data in a database as a draft
  } else {
    // Handle other logic if the user chooses not to save as a draft
  }
};

return { success: true }; // Indicate that the action execution was successful