  const axios = require('axios')

  /**
   * @title Push Answer and Get Next Available Question
   * @category Arty
   * @author Jonathan Arias
   * @param {string} template - The selected template name for this interview
   * @param {string} field - They field name user is answering
   * @param {string} input - User input
   */
  const pushAnswerAndGetNextQuestion = async (template, field, input) => {
    const { validationInput } = require('./validation.js')
    const sessionId = bp.dialog.createId(event)
    const config = await bp.config.getBotpressConfig()
    const formsHost = config.services['arty-forms'].host
    const authToken = config.services['arty-forms'].authToken

    bp.logger.info('i am in interviewQuestionFlow')

    bp.logger.info('----input----')
    bp.logger.info(input)

    bp.logger.info('----field ----')
    bp.logger.info(field)
    bp.logger.info('temp.interview_api_flow_field')
    bp.logger.info(temp.interview_api_flow_field)

    bp.logger.info('session.isRepeat: ' + session.isRepeat)

    if (event.payload.metadata.question_key !== null && !session.isRepeat) {
      bp.logger.info('inside if 1')
      field = event.payload.metadata.question_key
      temp.field_repeat = field
      bp.logger.info('temp.field_repeat')
      bp.logger.info(temp.field_repeat)
      bp.logger.info('field')
      bp.logger.info(field)
    }

    if (event.payload.metadata.question_key !== null && session.isRepeat) {
      temp.field_repeat = event.payload.metadata.question_key
      bp.logger.info('inside if 2')
      bp.logger.info('temp.field_repeat')
      bp.logger.info(temp.field_repeat)
      bp.logger.info('field')
      bp.logger.info(field)
    }

    // bp.logger.info('----field 2----')
    // bp.logger.info(field)

    // bp.logger.info('---event.payload.metadata.question_key---')
    // bp.logger.info(event.payload.metadata.question_key)

    // bp.logger.info('---session.question_info---')
    // bp.logger.info(session.questions_info)

    // bp.logger.info('---session.api_response---')
    // bp.logger.info(JSON.stringify(session.api_response))

    // bp.logger.info('--check session.questions_info including--')
    // bp.logger.info(session.questions_info[field])
    // bp.logger.info(session.questions_info['test'])

    // if (field) {
    //   //check validation
    //   const isValid = validationInput(input, field)
    //   bp.logger.info('---validation inside interview---')
    //   bp.logger.info('isvalid: ' + isValid)
    // }

    if (field && (session.questions_info[field] === null || session.questions_info[field] === undefined)) {
      // session.questions_info[field] = JSON.stringify(session.api_response)
      session.questions_info[field] = session.api_response
    } else {
      // `field` is empty or undefined
      // Your code when `field` is empty or undefined
      bp.logger.info('Field is empty or undefined')
    }

    // bp.logger.info('--session.questions_info--')
    // bp.logger.info(session.questions_info)

    bp.logger.info('------event.payload.metadata.question_key-----')
    bp.logger.info(event.payload.metadata.question_key)

    //bp.logger.info(`Agreement API - temp memory: ` + JSON.stringify(temp))

    let payload = {}

    if (field !== '' && input !== '') {
      let isJson = false
      let json = {}
      let clean = input.replace(/&amp;quot;/g, '"')
      try {
        json = JSON.parse(clean)
        isJson = true
      } catch (e) {
        // nothing to do
      }
      payload[field] = isJson ? json : input
    } else if (input !== '') {
      payload[field] = null
    }

    // Detect skip intent payload
    if (payload[field] == '--skip--') {
      bp.logger.info('----question skipped !!! ------')
      payload[field] = session.defaultAnswer
      if (session.defaultAnswer == null) {
        bp.logger.info('default answer is null')
      } else {
        bp.logger.info('default answer is defined')
      }
    }

    // bp.logger.info('----payload----')
    // bp.logger.info(payload)
    bp.logger.info(`Agreement API - push data: ` + JSON.stringify(payload))

    let api_response = await axios.post(
      formsHost + '/api/botpress/user/agreements/' + template + '/interview',
      payload,
      {
        headers: {
          sessionid: sessionId,
          AuthToken: authToken
        }
      }
    )

    // session.api_response = api_response

    bp.logger.info('----api response---')
    bp.logger.info(api_response)

    bp.logger.info('-------check response type -------')
    bp.logger.info('')
    bp.logger.info(JSON.stringify(api_response.data.schema))

    // Check if api_response, data, and schema exist before accessing deeper properties
    if (api_response && api_response.data && api_response.data.schema) {
      const schema = api_response.data.schema
      session.api_response = schema

      if (session.enum_Options) {
        delete session.enum_Options
      }

      if (session.format) {
        delete session.format
      }

      // Iterate through the properties of schema
      for (const propertyKey in schema.properties) {
        const property = schema.properties[propertyKey]

        // Check if the property represents a question
        if (property && property.properties) {
          for (const subPropertyKey in property.properties) {
            const subProperty = property.properties[subPropertyKey]

            // Check if the subProperty represents a question
            if (subProperty && subProperty.title && subProperty.type) {
              // Save the question type
              session.question_Type = subProperty.type

              // Save the question title
              session.question_Title = subProperty.title

              // Save the enum options if they exist
              if (subProperty.enum) {
                session.enum_Options = subProperty.enum
                bp.logger.info('Enum Options: ' + subProperty.enum)
              }

              // Save the format if it exists
              if (subProperty.type === 'string' && subProperty.format) {
                session.format = subProperty.format
                bp.logger.info('Format: ' + subProperty.format)
              }

              // Save the default value if it exists
              if (subProperty.default !== undefined) {
                session.defaultAnswer = subProperty.default
                bp.logger.info('Default Answer: ' + subProperty.default)
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
                bp.logger.info('Enum Options for Array Type Question: ' + subProperty.items.enum)
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

    // if response is 200 or 201 send push var event
    // if response is 406 - response was not accepted, trigger flow to re-ask same question
    if ([200, 201].indexOf(api_response.status) !== -1 && payload !== {} && api_response.data.attachment !== null) {
      const cleanField = field.split('.')[1]
      let requestPayload = {}
      // bp.logger.info('----field----')
      // bp.logger.info(field)
      requestPayload[cleanField] = payload[field]

      let formattedAnswers = api_response.data.answers !== null ? api_response.data.answers : requestPayload
      if (api_response.status == 201) formattedAnswers['_interviewStatus'] = 'completed'

      await bp.events.replyToEvent(event, [
        {
          type: 'xss-event',
          function: 'vueOpenTemplateLivePreview',
          payload: {
            template: api_response.data.attachment
          }
        },
        {
          type: 'xss-event',
          function: 'agreementDynamicPreviewSetAnswers',
          payload: {
            data: formattedAnswers
          }
        }
      ])

      if (typeof api_response.data.progress != 'undefined')
        await bp.events.replyToEvent(event, [
          {
            type: 'xss-event',
            function: 'chatbotDisplayInterviewProgress',
            payload: {
              progress: api_response.data.progress
            }
          }
        ])
    }

    //bp.logger.info(`Agreement Interview Response : ` + JSON.stringify(api_response.data))

    temp.interview_api_status = 'in progress'
    bp.logger.info('inside interview: temp.interview_api_flow_field')
    bp.logger.info(temp.interview_api_flow_field)

    if (typeof api_response.data.schema !== 'undefined')
      await extractJsonSchemaQuestions(api_response.data.schema, api_response.data.uiSchema)
    else temp.interview_api_status = 'complete'
  }

  const extractJsonSchemaQuestions = async (question, uiSchema, parent = '', required = false) => {
    if (question.type == 'object' && typeof question.properties !== 'undefined') {
      Object.keys(question['properties']).forEach(async pKey => {
        await extractJsonSchemaQuestions(
          question.properties[pKey],
          typeof uiSchema[pKey] !== 'undefined' ? uiSchema[pKey] : [],
          parent != '' ? parent + '.' + pKey : pKey,
          typeof question.required !== 'undefined' && question.required.indexOf(pKey) !== false
        )
      })
      return
    }

    temp.interview_api_flow_field = parent

    if (!session.answered_questions_fields.includes(parent)) {
      session.answered_questions_fields.push(parent)
    }

    bp.logger.info('----parent----')
    bp.logger.info(parent)

    bp.logger.info('------session.answered_questions_fields-----')
    bp.logger.info(session.answered_questions_fields)

    const title = JSON.stringify(question.title)
    let md = '---\nmessage: "' + title.substring(1, title.length - 1) + '"\n'

    if (!required) md += 'skip: true\n'
    if (typeof uiSchema['ui:extended-help'] !== 'undefined') md += 'help: "' + uiSchema['ui:extended-help'] + '"\n'
    if (typeof uiSchema['ui:help'] !== 'undefined') md += 'hint: "' + uiSchema['ui:help'] + '"\n'
    if (typeof question.format !== 'undefined' && question.format == 'date') md += 'widget: datepicker\n'
    md += '---'

    switch (question.type) {
      case 'string':
      case 'number':
        if (typeof question.enum != 'undefined') {
          await bp.events.replyToEvent(event, [
            {
              type: 'single-choice',
              skill: 'choice',
              text: md,
              markdown: true,
              typing: true,
              question_key: parent,
              choices: question.enum.map(option => {
                return { title: option, value: option }
              })
            }
          ])
          return
        } else {
          await bp.events.replyToEvent(event, [
            {
              type: 'text',
              text: md,
              question_key: parent,
              markdown: true
            }
          ])
        }

        if (typeof uiSchema['ui:widget'] !== 'undefined') {
          await bp.events.replyToEvent(event, [
            {
              type: 'widget',
              question_key: parent,
              widget: uiSchema['ui:widget'],
              payload: typeof uiSchema['ui:options'] !== 'undefined' ? uiSchema['ui:options'] : null
            }
          ])
        }
        return

      case 'boolean':
        await bp.events.replyToEvent(event, [
          {
            type: 'single-choice',
            skill: 'choice',
            text: md,
            markdown: true,
            typing: true,
            question_key: parent,
            choices: [
              { title: 'Yes', value: 'Yes' },
              { title: 'No', value: 'No' }
            ]
          }
        ])
        return

      // case 'array':
      //   const options = ['Option 1', 'Option 2', 'Option 3'] // Replace with your actual options

      //   const checkboxes = options.map(option => ({
      //     type: 'checkbox',
      //     text: option,
      //     value: option
      //   }))

      //   const message = {
      //     type: 'text',
      //     text: 'Please select one or more options:',
      //     typing: true,
      //     attachments: checkboxes
      //   }

      //   await bp.events.replyToEvent(event, message)

      default:
        bp.logger.info('type: default')
        if (question.type == 'array') {
          bp.logger.info('---this is an array-type question ----')
          session.uiSchema = uiSchema
          session.question = question
        }
        await bp.events.replyToEvent(event, [
          {
            type: 'text',
            text: question.title,
            question_key: parent,
            markdown: true
          }
        ])

        // question.title = ''
        let form = {
          schema: question,
          uiSchema: uiSchema
        }
        await bp.events.replyToEvent(event, [
          {
            type: 'widget',
            question_key: parent,
            widget: 'form',
            payload: form
          }
        ])

        return
    }
  }

  return pushAnswerAndGetNextQuestion(args.template, args.field, args.input)