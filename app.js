const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

// IMPORTING UTILITIES
const cors = require('cors');
const Sequelize = require('./util/database');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');
const io = require('socket.io')(server);

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

// CREATING STREAM FOR LOGGING REQUESTS
const accessLogStream = fs.createWriteStream(
    path.join(__dirname,'access.log'),
    {flag : 'a'}
);

// using socket.io after connection is made
io.on('connection', socket => {

    // socket on creating new-user
    socket.on('new-user', name => {
        
        // socket when a new user is connected
        socket.broadcast.emit('user-connected', name)
    })

    // when a user sends a message
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', { message: message })
    })

    // updating other user's localStorage
    socket.on('update-chat-localStorage', messageObj => {
        socket.broadcast.emit('chat-localStorage', { data: messageObj })
    })
});

// UTILITY MIDDLEWARES
app.use(cors({
    origin:"http://localhost:3000"
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('combined', {stream : accessLogStream}));
app.use(bodyParser.json());

// ROUTING MIDDLEWARES
app.use('/user', signupRoute);
app.use('/login', loginRoute);
app.use('/chat', chatRoute);
app.use('/group', groupRoute);

// FOR FRONTEND
app.use((req,res) => {
    res.sendFile(path.join(__dirname, `/views/${req.url}`));
});

// CREATING JOINS FOR USER AND MESSAGE
Users.hasMany(Chats);
Chats.belongsTo(Users);

// CREATING JOINS FOR CHATS AND GROUPS
Groups.hasMany(Chats);
Chats.belongsTo(Groups);

// CREATING M:M RELATION BETWEEN USERS AND GROUPS
Users.belongsToMany(Groups, {through: UserGroup});
Groups.belongsToMany(Users, {through: UserGroup});

// SEQUELIZE IS USED TO CONNECT TO DB
Sequelize.sync({force : false})
    .then( res => server.listen(process.env.PORT || 3000))
    .catch( err => console.log(err));