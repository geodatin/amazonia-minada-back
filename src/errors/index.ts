import { NextFunction, Request, Response } from 'express'

import { AppError } from './AppError'

export function handleErrors(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ message: error.message })
  }

  return response.status(500).json({
    message: `Internal server error - ${error.message}`,
  })
}
