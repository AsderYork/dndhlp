export default function(socket, io) { 
    return Object.freeze({
      /* Just define the methods here */
      battleState(msg) {
        socket.broadcast.emit('battleStateChanged', msg);
        return { accepted:true };
      },
    })
  }

  