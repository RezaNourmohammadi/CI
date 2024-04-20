  /**
   * Small description of your action
   * @title The title displayed in the flow editor
   * @category Custom
   * @author Your_Name
   * @param {string} name - An example string variable
   * @param {any} value - Another Example value
   */
  const validateInput = async Input => {
    ////////////////// checking repetition or not
    bp.logger.info('-----in validateUserInput------')
    bp.logger.info('temp.interview_api_flow_field on top:')
    bp.logger.info(temp.interview_api_flow_field)
    let key = event.payload.metadata.question_key 
    // let key = temp.field_repeat
    // bp.logger.info('temp.field')
    // bp.logger.info(temp.field_repeat)
    bp.logger.info('key: ' + key)
    bp.logger.info('inside validate user input')
    bp.logger.info('event.payload.metadata.question_key')
    bp.logger.info(event.payload.metadata.question_key)
    bp.logger.info('session.questions_info: ')
    bp.logger.info(session.questions_info)
    bp.logger.info('user input: ' + temp.interview_api_flow_response)
    session.isRepeat = false
    let api_response
    if (session.questions_info[key] !== null && session.questions_info[key] !== undefined) {
      api_response = session.questions_info[key]
      bp.logger.info('key included')
      bp.logger.info('key included: api_response')
      bp.logger.info(api_response)
      session.isRepeat = true
      // session.last_field = temp.interview_api_flow_field

      if (api_response) {
        const schema = api_response
        bp.logger.info('inside if(api_response)')
        bp.logger.info('type of schema: ' + typeof schema)
        bp.logger.info('schema: ' + schema)
        // session.api_response = schema

        if (session.enum_Options) {
          delete session.enum_Options
        }

        if (session.format) {
          delete session.format
        }

        // Iterate through the properties of schema
        for (const propertyKey in schema.properties) {
          const property = schema.properties[propertyKey]
          bp.logger.info('propertyKey: ' + propertyKey)
          bp.logger.info('property: ' + property)

          // Check if the property represents a question
          if (property && property.properties) {
            for (const subPropertyKey in property.properties) {
              const subProperty = property.properties[subPropertyKey]

              // Check if the subProperty represents a question
              if (subProperty && subProperty.title && subProperty.type) {
                // Save the question type
                session.question_Type = subProperty.type
                bp.logger.info('question type settled')
                bp.logger.info('question type: ' + session.question_Type)

                // Save the question title
                session.question_Title = subProperty.title
                bp.logger.info('question title settled')
                bp.logger.info('question title: ' + session.question_Title)

                // Save the enum options if they exist
                if (subProperty.enum) {
                  session.enum_Options = subProperty.enum
                  // bp.logger.info('Enum Options: ' + subProperty.enum)
                }

                // Save the format if it exists
                if (subProperty.type === 'string' && subProperty.format) {
                  session.format = subProperty.format
                  // bp.logger.info('Format: ' + subProperty.format)
                }

                // Save the default value if it exists
                if (subProperty.default !== undefined) {
                  session.defaultAnswer = subProperty.default
                  // bp.logger.info('Default Answer: ' + subProperty.default)
                } else {
                  session.defaultAnswer = null
                }

                // Exit the loop once a valid question property is found
                break
              }
            }
          }
        }

        if (session.question_Type === 'array') {
          // Iterate through the properties of schema to find the enum options for array-type questions
          for (const propertyKey in schema.properties) {
            const property = schema.properties[propertyKey]
            if (property && property.properties) {
              for (const subPropertyKey in property.properties) {
                const subProperty = property.properties[subPropertyKey]
                if (subProperty && subProperty.type === 'array' && subProperty.items.enum) {
                  // Found enum options for the array-type question
                  session.enum_Options = subProperty.items.enum
                  //bp.logger.info('Enum Options for Array Type Question: ' + subProperty.items.enum)
                  break
                }
              }
            }
          }
        }
      } else {
        // Handle case where schema properties are missing
        bp.logger.info('Schema properties are missing in the API response')
      }
    } else {
      bp.logger.info('key not included')
    }

    bp.logger.info('----------session variables-------')
    bp.logger.info('session.question_type: ' + session.question_Type)
    bp.logger.info('session.question_title: ' + session.question_Title)
    bp.logger.info('session.format: ' + session.format)
    bp.logger.info('session.enum_options: ' + session.enum_Options)
    bp.logger.info('session.default_answer: ' + session.defaultAnswer)

    //////////////////////////////////////////////

    let user_input_valid = false

    if (
      temp.interview_api_flow_response == 'Skip' ||
      temp.interview_api_flow_response == '--skip--' ||
      temp.interview_api_flow_response == 'skip' ||
      temp.interview_api_flow_response == '---discard---'
    ) {
      user_input_valid = true
      // bp.logger.info('------skipped reponse check-----')
      // bp.logger.info(' ')
      // bp.logger.info(temp.interview_api_flow_response)
    } else {
      if (session.question_Type === 'number') {
        // Validate if the userResponse is a number
        if (isNaN(temp.interview_api_flow_response)) {
          // User response is not a number
          // bp.logger.info('User response is not a number')
          // user_input_valid = false
          // if (typeof temp.interview_api_flow_response === 'string' && isPhoneNumberRelated(session.question_Title)) {
          //   user_input_valid = true
          // }
        } else {
          // User response is a number
          // bp.logger.info('Your response is a number')
          user_input_valid = true
        }
      } else if (session.question_Type === 'string') {
        // Validate if the userResponse is a string
        bp.logger.info('question type is string')
        // typeof temp.interview_api_flow_response !== 'string'
        if (!isNaN(temp.interview_api_flow_response)) {
          // User response is not a string
          // bp.logger.info('User response is not a string')

          user_input_valid = false
          bp.logger.info(session.question_Title.toLowerCase())
          if (isPhoneNumberRelated(session.question_Title)) {
            bp.logger.info('question type is string but response is num')
            bp.logger.info(session.question_Title.toLowerCase())
            user_input_valid = true
          }
        } else {
          // User response is a string
          // bp.logger.info('User response is a string')
          user_input_valid = true
          //----
          if (session.enum_Options && session.enum_Options.length > 0) {
            bp.logger.info('-----enum in not array type----')
            bp.logger.info(session.enum_Options)
            if (
              session.enum_Options.some(
                option => option.toLowerCase() === temp.interview_api_flow_response.toLowerCase()
              )
            ) {
              user_input_valid = true
            } else {
              user_input_valid = false
            }
          }
          //--------

          if (session.format === 'date') {
            // Validate if the userResponse matches the format of a date (MM-DD-YYYY)
            const dateFormatRegex = /^\d{2}-\d{2}-\d{4}$/ // Date format: MM-dd-yyyy
            bp.logger.info('----i am in validate user input: date -----')
            bp.logger.info(temp.interview_api_flow_response)
            if (!dateFormatRegex.test(temp.interview_api_flow_response)) {
              // User response does not match the format of a date
              // bp.logger.info('User response does not match the required date format (YYYY-MM-DD)')
              user_input_valid = false
            } else {
              // User response matches the format of a date
              // bp.logger.info('User response matches the required date format (YYYY-MM-DD)')
              user_input_valid = true
            }
          }
          if (session.format === 'email') {
            bp.logger.info('---- email format required------')
            const emailFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Email format: local-part@domain
            if (!emailFormatRegex.test(temp.interview_api_flow_response)) {
              // User response does not match the format of an email
              user_input_valid = false
            } else {
              // User response matches the format of an email
              user_input_valid = true
            }
          }
          if (!isNaN(temp.interview_api_flow_response)) {
            // bp.logger.info('user reponse is a number')
            user_input_valid = false
          }
        }
      } else if (session.question_Type === 'boolean') {
        // Validate if the userResponse is a boolean (true or false)
        if (
          temp.interview_api_flow_response == 'Yes' ||
          temp.interview_api_flow_response == 'yes' ||
          temp.interview_api_flow_response == 'No' ||
          temp.interview_api_flow_response == 'no'
        ) {
          // bp.logger.info('user input is boolean')
          user_input_valid = true
        } else {
          // bp.logger.info('user input is not boolean')
        }
      } else if (session.question_Type === 'array') {
        // Handle array-type questions
        bp.logger.info('------array response form------')
        bp.logger.info(temp.interview_api_flow_response)
        bp.logger.info('---session.enum---')
        bp.logger.info(session.enum_Options)

        // Decode HTML entities
        const decodedOptions = decodeHTML(temp.interview_api_flow_response)

        bp.logger.info('----decoded options---')
        bp.logger.info(decodedOptions)
        // Convert the decoded options string into an array
        // let selectedOptions = JSON.parse(decodedOptions)

        let selectedOptions

        try {
          // Try parsing the decoded options as JSON
          selectedOptions = JSON.parse(decodedOptions)

          // Check if selectedOptions is an array
          if (!Array.isArray(selectedOptions)) {
            throw new Error('Invalid JSON format')
          }
        } catch (error) {
          // If parsing fails, split the options by commas and trim whitespace
          selectedOptions = decodedOptions.split(',').map(option => option.trim())
        }

        bp.logger.info('----selected option---')
        bp.logger.info(selectedOptions)

        // Initialize a flag to track if all selected options are valid
        let isValid = true

        // Loop through each selected option
        for (const selectedOption of selectedOptions) {
          bp.logger.info('--selected option in loop---')
          bp.logger.info(selectedOption)

          // Check if the selected option exists in the enum options
          if (!session.enum_Options.includes(selectedOption.trim())) {
            // If the selected option is not found in the enum options, set isValid to false and break the loop
            isValid = false
            break
          }
        }

        // Set user_input_valid based on the isValid flag
        user_input_valid = isValid
        // if (!session.isRepeat && user_input_valid) {
        //   session.answered_questions_fields.push(key)
        // }

        // if (session.isRepeat && user_input_valid) {
        //   let question_fields = session.answered_questions_fields
        //   temp.interview_api_flow_field = question_fields[question_fields.length - 2]
        //   bp.logger.info('temp.interview_api_flow_field: on bottom')
        //   bp.logger.info(temp.interview_api_flow_field)
        // }
        // bp.logger.info('---session.answered_questions_fields---')
        // bp.logger.info(session.answered_questions_fields)

        // Set user_input_valid based on the isValid flag
      }
    }

    // if (!session.isRepeat && user_input_valid) {
    //   session.answered_questions_fields.push(key)
    //   bp.logger.info('not repeat')
    // }

    // if (session.isRepeat && user_input_valid) {
    //   let question_fields = session.answered_questions_fields
    //   if (question_fields.length >= 2) {
    //     temp.interview_api_flow_field = question_fields[question_fields.length - 2]
    //   } else {
    //     temp.interview_api_flow_field = question_fields[0]
    //   }
    //   // temp.interview_api_flow_field = question_fields[question_fields.length - 2]
    //   bp.logger.info('temp.interview_api_flow_field: on bottom')
    //   bp.logger.info(temp.interview_api_flow_field)
    // }

    if (session.isRepeat && user_input_valid) {
      bp.logger.info('------yes-----')
      bp.logger.info('user input')
      bp.logger.info(temp.interview_api_flow_response)
      let questions_fields = session.answered_questions_fields
      let lastQuestionIndex = questions_fields.indexOf(temp.interview_api_flow_field)
      temp.interview_api_flow_field = questions_fields[lastQuestionIndex - 1]
      bp.logger.info('session.answered_questions_fields')
      bp.logger.info(session.answered_questions_fields)
      bp.logger.info('temp.interview_api_flow_field')
      bp.logger.info(temp.interview_api_flow_field)
    }

    bp.logger.info('---session.answered_questions_fields on bottom---')
    bp.logger.info(session.answered_questions_fields)

    if (isPhoneNumberRelated(session.question_Title)) {
      if (isNaN(temp.interview_api_flow_response)) {
        user_input_valid = false
      } else {
        user_input_valid = true
      }
    }

    bp.logger.info('-----out of validationUserInput----')
    bp.logger.info('')
    bp.logger.info(user_input_valid ? 'Validation passed: true' : 'Validation failed: false')

    session.input_isvalid = user_input_valid
  }

  const isPhoneNumberRelated = title => {
    const phoneNumberTerms = ['phone', 'phone number', 'mobile phone number', 'mobile number']
    return phoneNumberTerms.some(term => title.toLowerCase().includes(term))
  }

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

  return validateInput(args.input)