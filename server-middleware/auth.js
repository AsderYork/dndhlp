import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
//import { jwt } from 'express-jwt'
import jsonwebtoken from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'


const { expressjwt: expressJwt } = require('express-jwt');

// Create app
const app = express()
const prisma = new PrismaClient();

// Install middleware
app.use(cookieParser())
app.use(bodyParser.json())


const userTokenExpirationTime = 60*4;
const appTokenSecret = "dummy";


// JWT middleware
app.use(
    expressJwt({
    secret: appTokenSecret,
    algorithms: ['sha1', 'RS256', 'HS256'],
    getToken: function fromHeaderOrQuerystring (req) {
      const tokenString = req.cookies['auth._token.local'];
      
      if (tokenString && tokenString.split(' ')[0] === 'Bearer') {
          return tokenString.split(' ')[1];
      }
      return null;
    },
  }).unless({
    path: ['/api/auth/login', '/api/auth/refresh', '/api/auth/logout']
  })
)


function isString(potentialString) {
  return (typeof potentialString === 'string' || potentialString instanceof String);
}

function assert(value, error) {
  if(!value) {throw new Error(error);}
}


// -- Routes --

// [POST] /login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    assert(isString(username) && isString(password), 'Invalid username or password');
  
    var user = await prisma.User.findUnique({where: {name_password: {name: username, password: password}}, include:{CampaignPlayers:{include:{Campaign:true}}}});
    assert(user != null, 'Invalid username or password');
  
    const accessToken = jsonwebtoken.sign({user}, appTokenSecret, { expiresIn:userTokenExpirationTime });
    res.json({token: {accessToken}, user:user});

    prisma.User.update({where:{name_password: {name: username, password: password}}, data:{token:accessToken}});

  } catch(exception) {
    res.status(401).send(exception);
  }
  
})

app.post('/refresh', (req, res) => {
  const { refreshToken } = req.body
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
      appTokenSecret,
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
app.get('/user', async (req, res) => {
  try {
    var user = await prisma.User.findUnique({where: {id: req.auth.user.id}, include:{CampaignPlayers:{include:{Campaign:true}}}});
    assert(user != null, 'Invalid token');
    res.json(user);

  } catch(exception) {
    res.status(401).send(exception);
  }
})

// [POST] /logout
app.all('/logout', (req, res) => {
  res.cookie('auth._token.local', req.cookies['auth._token.local'], {expires: new Date()});
  res.cookie('auth._token_expiration.local', req.cookies['auth._token_expiration.local'], {expires: new Date()});
  res.cookie('auth.strategy', req.cookies['auth.strategy'], {expires: new Date()});

  res.clearCookie('auth._token.local');
  res.clearCookie('auth._token_expiration.local');
  res.clearCookie('auth.strategy');

  res.redirect('/login?logout=1');


})

// Error handler
app.use((err, _req, res) => {
  console.error(err) // eslint-disable-line no-console
  res.status(401).send(err + '')
})

module.exports = app;
