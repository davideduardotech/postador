const express = require('express');
const bodyParser = require('body-parser')
const session = require('express-session');
const path = require('path')
const mainRouter = require('./routes/mainRouter')
const checkoutRouter = require('./routes/checkoutRouter')
const loginRouter = require('./routes/authRouter')
const appRouter = require('./routes/appRouter')
const chatbotApiRouter = require('./routes/chatbotApiRouter');
const userApiRouter = require('./routes/userApiRouter');
const webhookRouter = require('./routes/webhookRouter');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const dotenv = require('dotenv').config();
const ejs = require('ejs');
const fs = require('fs');
const passport = require('passport');
const https = require('https');
const app = express();
const busboy = require('busboy');
const socketIo = require('socket.io');
const helmet = require('helmet');
const requestIp = require('request-ip');
const dbConnect = require('./config/dbConnect');
require('./config/passport.js');

app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cookieParser());

app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(morgan("dev"))

app.use(requestIp.mw());

app.use("/", mainRouter)
app.use("/auth", loginRouter)
app.use('/api/chatbot', chatbotApiRouter);
app.use('/api/user', userApiRouter);
app.use("/checkout", checkoutRouter)
app.use("/app", appRouter)
app.use("/webhook-callback", webhookRouter); // webhook de mensagens do facebook

// CODDING: Criar rota de upload de arquivo
app.post('/upload',(req, res, next)=>{
  const totalSize = parseInt(req.headers['content-length']);
  let uploadedSize = 0;

  const upload = busboy({headers: req.headers});
 
  upload.on('file',(fieldname, file, info)=>{
     
      // Configurar ação para quando dados são recebidos
     file.on('data', (data) => {
      uploadedSize += data.length;
      const progress = (uploadedSize / totalSize) * 100;
      console.log(`Progresso do upload: ${progress.toFixed(2)}%`);
    });

    // Você pode fazer qualquer operação desejada com o arquivo aqui
    // Por exemplo, salvar o arquivo no disco
    file.pipe(fs.createWriteStream('uploads/' + info.filename));  
     
      console.log('error:', error);
     

  });

  
    // Configurar ação para quando o upload estiver completo
  upload.on('finish', () => {
      console.log('Upload concluído');
      res.status(200).json({ status: 200 });
  });
  req.pipe(upload);
  
});

app.use((req, res, next) => {
  res.status(404).render('layouts/not-found')
});

dbConnect(process.env.MONGODB_URL)

if (process.env.MODE == "DEV") {
  const options = {
    key: fs.readFileSync("./keys/localhost-key.pem"),
    cert: fs.readFileSync("./keys/localhost.pem"),
  };
  
  https.createServer(options, app).listen(5600,'0.0.0.0', () => {
    console.log('Server listening on port ' + 5600);
  });
} else if (process.env.MODE == "PROD") {
  app.listen(3000, () => {
    console.log('Server listening 3000')
  })
}