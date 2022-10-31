
const {register} =  require('nuxt-socket-io')
var socketServer = null;

export default function () {
    this.nuxt.hook('listen', async (server = http.createServer()) => {
        socketServer = await register.server({}, server).catch(consola.error);
        this.nuxt.hook('close', () => server.close())
    })
}

exports.getServerIo = () => socketServer.io;