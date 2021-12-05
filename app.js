const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morganLogger = require('morgan');
const mongoose = require('mongoose');
const environment = require('dotenv');
const cors = require('cors');

const Routes = require('./Routes/index.js');

environment.config();

const app = express();

app.options('*', cors());
app.use(cors());

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });
}
run();

app.use(morganLogger('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf
  }
}));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: 3600000 }
}));

app.use('/api/users', Routes.users);
app.use('/api/admin', Routes.admins);
app.use('/api/categories', Routes.categories );
app.use('/api/subcategories', Routes.subCategories );
app.use('/api/collections', Routes.collections );
app.use('/api/products', Routes.products );
app.use('/api/chats', Routes.chats );
app.use('/api/messages', Routes.messages );
app.use('/api/orders', Routes.orders);
app.use('/api/news', Routes.news);
app.use('/api/vendors', Routes.vendors);


//API's Initialization through routers

app.use(function (err, req, res, next) {
    if(err.message)
      res.status(404).json({ status: "Error", message: err.message});
    else if (err.status === 404)
      res.status(404).json({ message: "Not found" });
    else
      res.status(500).json({ message: "Something looks wrong :( !!!"});
  });
  
  const options = {
    cors: true
  }

  const http = require('http').Server(app);
  const io = require('socket.io')(http, options);
  
  
  io.on('connection', socket => {
    socket.on('sendMessage', message => {
      io.emit('newMessage', message);
      io.emit(message.to, message);
    })
  });
  
  http.listen(process.env.PORT || 5000, () => console.log(`Listening on port: ${process.env.PORT || 5000}`));