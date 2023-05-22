const express = require('express');
const app = express();

// IMPORTING UTILITIES
const cors = require('cors');
const Sequelize = require('./util/database');
const bodyParser = require('body-parser');
const path = require('path');

// IMPORTING ROUTES
const signupRoute = require('./routes/signup');
const loginRoute = require('./routes/login');
const chatRoute = require('./routes/chat');

// IMPORTING MODELS
const Users = require('./models/users');
const Chats = require('./models/chats');

require('dotenv').config();

// UTILITY MIDDLEWARES
app.use(cors({
    origin:"http://127.0.0.1:3000"
}));
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(bodyParser.json());

// ROUTING MIDDLEWARES
app.use('/user',signupRoute);
app.use('/login',loginRoute);
app.use('/chat',chatRoute);

// CREATING JOINS FOR USER AND MESSAGE
Users.hasMany(Chats);
Chats.belongsTo(Users);

// SEQUELIZE IS USED TO 
Sequelize.sync({force : false})
    .then(res => app.listen(process.env.PORT || 4000))
    .catch(err => console.log(err));