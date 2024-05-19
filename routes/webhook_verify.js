const processPostback = require('../processes/postback'); 
const processMessage = require('../processes/messages');
module.exports = function(app, giz){ 
  app.get('/webhook', function(req, res) { 
    if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN){ 
       console .log('webhook verificado'); 
       res.status(200).send(req.query['hub.challenge']); 
    } else { 
        console.error('falha na verificação. Incompatibilidade de token.'); 
        res.sendStatus (403); 
     } 
  }); 
  
  app.post('/webhook', function(req, res) { 
    //verificando a assinatura da página.
     if (req.body.object === 'page'){ 
       
       /* Itera sobre cada entrada, pode haver várias entradas 
       se os retornos de chamada forem em lote. */
       req.body.entry.forEach(function(entry) { 
       // Iterar sobre cada evento de mensagens
           entry.messaging.forEach(function(event) { 
          console.log(event); 
          if (event.postback){ 
             processPostback(event); 
          } else if (event.message){ 
             processMessage(event); 
          } 
      }); 
    }); 
    res.sendStatus(200); 
   } 
  }); 
}