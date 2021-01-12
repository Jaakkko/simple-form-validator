import bodyParser from 'body-parser'
import request from 'supertest'
import express from 'express'
import validate from '../src/index'

let app: express.Application

const handler = validate({
  password: (v: string) => {
    if (v.length < 8) {
      return 'Too short'
    } else {
      return null
    }
  },
})

beforeEach(() => {
  app = express()
  app.use(bodyParser.json())
  app.post('/', handler, (_req, res) => {
    res.status(204).end()
  })
})

it('no errors, should return 204', async () => {
  await request(app).post('/').send({ password: 'longgggg' }).expect(204)
})

it('errors, should return 400 and body should contain error message', async () => {
  await request(app)
    .post('/')
    .send({ password: 'short' })
    .expect(400, { password: 'Too short' })
})

describe('no field, should return 400 and body should contain error message', () => {
  it('no locale defaults to english', async () => {
    await request(app).post('/').send({}).expect(400, {
      password: 'Required',
    })
  })
  it('finnish', async () => {
    await request(app)
      .post('/')
      .set('Accept-Language', 'fi,fi-FI;q=0.9,en-US;q=0.8,en;q=0.7')
      .send({})
      .expect(400, {
        password: 'Tämä kenttä on pakollinen',
      })
  })
})
