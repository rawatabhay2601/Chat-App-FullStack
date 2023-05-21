const express = require('express');
const app = express();

// IMPORTING UTILITIES
const cors = require('cors');
const Sequelize = require('./util/database');
const bodyParser = require('body-parser');
const path = require('path');

// importing routes
const userRoute = require('./routes/signup');
const loginRoute = require('./routes/login');

require('dotenv').config();

// UTILITY MIDDLEWARES
app.use(cors({
    origin:"http://127.0.0.1:3000"
}));
app.use(bodyParser.json());

// ROUTING MIDDLEWARES
app.use('/user',userRoute);
app.use('/login',loginRoute);
app.use(express.static(path.join(__dirname, 'public')));

// SEQUELIZE IS USED TO 
Sequelize.sync({force : false})
    .then(res => app.listen(process.env.PORT || 4000))
    .catch(err => console.log(err));