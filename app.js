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
const groupRoute = require('./routes/group');

// IMPORTING MODELS
const Users = require('./models/users');
const Chats = require('./models/chats');
const Groups = require('./models/groups');
const UserGroup = require('./models/user-group');

// CONFIGURING dotenv SO THAT FILE VARIABLES CAN BE USED
require('dotenv').config();

// UTILITY MIDDLEWARES
app.use(cors({
    origin:"http://127.0.0.1:3000"
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// ROUTING MIDDLEWARES
app.use('/user', signupRoute);
app.use('/login', loginRoute);
app.use('/chat', chatRoute);
app.use('/group', groupRoute);

// CREATING JOINS FOR USER AND MESSAGE
Users.hasMany(Chats);
Chats.belongsTo(Users);

// CREATING JOINS FOR CHATS AND GROUPS
Groups.hasMany(Chats);
Chats.belongsTo(Groups);

// CREATING M:M RELATION BETWEEN USERS AND GROUPS
Users.belongsToMany(Groups, {through: UserGroup});
Groups.belongsToMany(Users, {through: UserGroup});

// SEQUELIZE IS USED TO
Sequelize.sync({force : false})
    .then( res => app.listen(process.env.PORT || 4000))
    .catch( err => console.log(err));