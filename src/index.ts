import { Request, Response, NextFunction, RequestHandler } from 'express'
import { I18n, __ } from 'i18n'
import path from 'path'

const i18n = new I18n()
const locales = ['en', 'fi']

i18n.configure({
  locales,
  directory: path.join(__dirname, 'locales'),
  defaultLocale: 'en',
})

export default function validate(
  // eslint-disable-next-line
  body: Record<string, (value: any) => string | null>
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const locale = req.acceptsLanguages(locales) || 'en'
    const errors: Record<string, string> = {}
    Object.entries(body).forEach(([key, func]) => {
      let error: string | null
      const value = req.body[key]
      if (Object.prototype.hasOwnProperty.call(req.body, key) && value !== '') {
        error = func(value)
      } else {
        error = i18n.__({
          phrase: 'Field required',
          locale,
        })
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
