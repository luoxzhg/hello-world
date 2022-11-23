class RestApiError extends Error {
   constructor(code, message, data) {
      super(message)
      this.code = code
      this.data = data
   }
}

const err = new RestApiError(413001, '页数过多', { n: 500});
console.log(err)
