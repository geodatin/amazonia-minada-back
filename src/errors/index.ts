import { ErrorRequestHandler } from 'express'
import { ValidationError } from 'yup'

import { AppError } from './AppError'

interface IValidationErrors {
  [key: string]: string[]
}

export const errorHandler: ErrorRequestHandler = (
  error,
  request,
  response,
  next
) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message })
  } else if (error instanceof ValidationError) {
    const errors: IValidationErrors = {}

    error.inner.forEach((error) => {
      errors[String(error.path)] = error.errors
    })
    return response.status(400).json({ message: 'Validation fails', errors })
  }
  console.log(error)

  return response.status(500).json({
    message: `Internal server error - ${error.message}`,
  })
}
