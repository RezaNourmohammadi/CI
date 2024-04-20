const processApiResponse = (apiResponse) => {
    if (apiResponse && apiResponse.data && apiResponse.data.schema) {
        const schema = apiResponse.data.schema;

        let questionType;
        let questionTitle;
        let enumOptions;
        let format;
        let defaultAnswer;

        for (const propertyKey in schema.properties) {
            const property = schema.properties[propertyKey];

            if (property && property.properties) {
                for (const subPropertyKey in property.properties) {
                    const subProperty = property.properties[subPropertyKey];

                    if (subProperty && subProperty.title && subProperty.type) {
                        questionType = subProperty.type;
                        questionTitle = subProperty.title;

                        if (subProperty.enum) {
                            enumOptions = subProperty.enum;
                            bp.logger.info('Enum Options: ' + subProperty.enum);
                        }

                        if (subProperty.type === 'string' && subProperty.format) {
                            format = subProperty.format;
                            bp.logger.info('Format: ' + subProperty.format);
                        }

                        if (subProperty.default !== undefined) {
                            defaultAnswer = subProperty.default;
                            bp.logger.info('Default Answer: ' + subProperty.default);
                        } else {
                            defaultAnswer = null;
                        }

                        // Exit the loop once a valid question property is found
                        break;
                    }
                }
            }
        }

        if (questionType === 'array') {
            for (const propertyKey in schema.properties) {
                const property = schema.properties[propertyKey];

                if (property && property.properties) {
                    for (const subPropertyKey in property.properties) {
                        const subProperty = property.properties[subPropertyKey];

                        if (subProperty && subProperty.type === 'array' && subProperty.items.enum) {
                            // Found enum options for the array-type question
                            enumOptions = subProperty.items.enum;
                            bp.logger.info('Enum Options for Array Type Question: ' + subProperty.items.enum);
                            break;
                        }
                    }
                }
            }
        }

        return {
            questionType,
            questionTitle,
            enumOptions,
            format,
            defaultAnswer
        };
    } else {
        bp.logger.info('Schema properties are missing in the API response');
        return null;
    }
};

module.exports = {
    processApiResponse
};