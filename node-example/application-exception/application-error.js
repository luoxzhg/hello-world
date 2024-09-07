'use strict'

class ApplicationError extends Error {
   constructor(errorCode, msg, options) {
      super(msg, options)

      this.errorCode = errorCode
      this.timestamp = new Date
      this.details = options.details || {}
   }

   toJSON() {
      return {
         errorCode: this.errorCode,
         message: this.message,
         timestamp: this.timestamp,
         details: this.details,
      }
   }
}

module.exports = {
   ApplicationError,
}
