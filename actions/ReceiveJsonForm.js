  /**
   * @title Json Parse Response
   * @category Storage
   * @author Jonathan Arias
   */
  const storeJsonToSession = async event => {
    try {
      let formData = JSON.parse(event.payload.text.replace(/\\/g, "") )
      Object.keys(formData).forEach(key => {
        session.slots[key] = formData[key]
      })
    } 
    catch (Err) {
      console.log(Err)
      bp.logger.error(`Json parse error: ` + Err)
    }
  }

  return storeJsonToSession(event)