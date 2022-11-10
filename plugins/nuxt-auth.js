import jsonwebtoken from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export default async function ({ $auth }) {
    $auth.onError((_name, error) => {
      console.log({ message: error })
    })

    if($auth.ctx.req._parsedUrl.pathname === '/login' && $auth.ctx.req._parsedUrl.query === 'logout=1'){
      $auth.logout();
      return;
    }
    
    var tokenString = $auth.$storage._state['_token.local'];
    if (tokenString && tokenString.split(' ')[0] === 'Bearer') {
      tokenString = tokenString.split(' ')[1];

      var decodedToken = jsonwebtoken.verify(tokenString, 'dummy');
      if(decodedToken.user) {
        var user = await prisma.User.findUnique({where: {id: decodedToken.user.id}, include:{CampaignPlayers:{include:{Campaign:true}}}});
        user.settings = user.settings == null ? {} : JSON.parse(user.settings);
        if(user) {
          $auth.setUser(user);
        }
      }
    }



  }