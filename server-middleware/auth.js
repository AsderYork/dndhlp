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


const userTokenExpirationTime = 60*60*4;
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

function randomString() {
  return Math.random().toString(36).substr(2).toUpperCase();
}

async function getCampaignRoleId(role) {
  const roleData = await prisma.campaignRoles.findUnique({where:{name:role}});
  return roleData.id;
}


async function tryCreateFromToken(token) {
  assert(isString(token) && token.length > 0, "Token is invalid");
  var invite = await prisma.CampaignInvites.findUnique({where: {token: token}});
  assert(invite != null, "No invite for this token");

  var user = await prisma.User.create({data:{name:invite.newUsername, password:randomString()}});
  const playerRole = await getCampaignRoleId("Player");
  await prisma.CampaignPlayers.create({data:{CampaignId: invite.CampaignId, UserId: user.id, RoleId: playerRole}});

  await prisma.CampaignInvites.update({where:{id:invite.id}, data:{accepted:true}});
  return user;
}

async function findUserByLoginAndPassword(login, password) {
  assert(isString(login) && isString(password), 'Invalid username or password');
  const user = await prisma.User.findUnique({where: {name_password: {name: login, password: password}}, include:{CampaignPlayers:{include:{Campaign:true}}}});
  assert(user != null, 'Invalid username or password');
  return user;
}


// -- Routes --

// [POST] /login
app.post('/login', async (req, res) => {
  const { username, password, token } = req.body;
  try {
    var user = null;
    if(token !== undefined) {
      user = await tryCreateFromToken(token);
    } else {
      user = await findUserByLoginAndPassword(username, password);
    }
    assert(user != null, 'No apropriate way for identifying a user exists');

    user.settings = user.settings == null ? {} : JSON.parse(user.settings);
  
    const accessToken = jsonwebtoken.sign({user}, appTokenSecret, { expiresIn:userTokenExpirationTime });
    res.json({token: {accessToken}, user:user});


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

    user.settings = user.settings == null ? {} : JSON.parse(user.settings);

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
