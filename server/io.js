export default function(socket, io) { 
    return Object.freeze({
      /* Just define the methods here */
      battleState(msg) {
        socket.broadcast.emit('battleStateChanged', msg);
        return { accepted:true };
      },
      
      battleCounter(msg) {
        console.log(msg);
        socket.broadcast.emit('battleCounter/setFullState', msg);
        return { accepted:true };
      },
    })
  }

  