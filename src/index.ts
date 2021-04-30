import { Request, Response, NextFunction, RequestHandler } from 'express'

export default function validate(
  // eslint-disable-next-line
  body: Record<string, (value: any, req: Request) => string | null>
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: Record<string, string> = {}
    Object.entries(body).forEach(([key, func]) => {
      let error: string | null
      const value = req.body[key]
      if (Object.prototype.hasOwnProperty.call(req.body, key) && value !== '') {
        error = func(value, req)
      } else {
        error = req.__('Field required')
      }

      if (error) {
        errors[key] = error
      }
    })

    if (Object.keys(errors).length > 0) {
      res.status(400).type('application/json').end(JSON.stringify(errors))
      return
    }

    next()
  }
}
