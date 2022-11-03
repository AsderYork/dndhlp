import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
//import { jwt } from 'express-jwt'
import jsonwebtoken from 'jsonwebtoken'

const { expressjwt: expressJwt } = require('express-jwt');

// Create app
const app = express()

// Install middleware
app.use(cookieParser())
app.use(bodyParser.json())

// JWT middleware
app.use(
    expressJwt({
    secret: 'dummy',
    algorithms: ['sha1', 'RS256', 'HS256']
  }).unless({
    path: ['/api/auth/login', '/api/auth/refresh']
  })
)

// Refresh tokens
const refreshTokens = {}

// -- Routes --

// [POST] /login
app.post('/login', (req, res) => {
  debugger;
  const { username, password } = req.body
  const valid = username.length && password === '123'
  const expiresIn = 60*120
  const refreshToken =
    Math.floor(Math.random() * (1000000000000000 - 1 + 1)) + 1

  if (!valid) {
    throw new Error('Invalid username or password')
  }

  const accessToken = jsonwebtoken.sign(
    {
      username,
      name: 'User ' + username,
      scope: ['test', 'user']
    },
    'dummy',
    {
      expiresIn
    }
  )

  refreshTokens[refreshToken] = {
    accessToken,
    user: {
      username,
      name: 'User ' + username
    }
  }

  res.json({
    token: {
      accessToken,
      refreshToken
    }
  })
})

app.post('/refresh', (req, res) => {
  const { refreshToken } = req.body
  debugger;
  if (refreshToken in refreshTokens) {
    const user = refreshTokens[refreshToken].user
    const expiresIn = 15
    const newRefreshToken =
      Math.floor(Math.random() * (1000000000000000 - 1 + 1)) + 1
    delete refreshTokens[refreshToken]
    const accessToken = jsonwebtoken.sign(
      {
        user: user.username,
        name: 'User ' + user.username,
        scope: ['test', 'user']
      },
      'dummy',
      {
        expiresIn
      }
    )

    refreshTokens[newRefreshToken] = {
      accessToken,
      user
    }

    res.json({
      token: {
        accessToken,
        refreshToken: newRefreshToken
      }
    })
  } else {
    res.sendStatus(401)
  }
})

// [GET] /user
app.get('/user', (req, res) => {
  debugger;
  res.json({ user: {username:'asdqwe'} })
})

// [POST] /logout
app.post('/logout', (_req, res) => {
  res.json({ status: 'OK' })
})

// Error handler
app.use((err, _req, res) => {
  console.error(err) // eslint-disable-line no-console
  res.status(401).send(err + '')
})

module.exports = app;
