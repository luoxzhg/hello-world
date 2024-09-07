import { ApplicationError } from "./application-error.js";

try {
   throw new ApplicationError(100, 'Application Error', { details: { name: 'John Doe' } })
} catch (error) {
   console.log(error)
   console.log(JSON.stringify(error))
}
