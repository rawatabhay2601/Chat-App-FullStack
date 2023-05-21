const express = require('express');
const app = express();

const cors = require('cors');
const Sequelize = require('./util/database');
const bodyParser = require('body-parser');
const path = require('path');

// importing routes
const userRoute = require('./routes/signup');

require('dotenv').config();

// Utility middlewares
app.use(cors());
app.use(bodyParser.json());

app.use('/user',userRoute);
app.use(express.static(path.join(__dirname, 'public')));

const User = require('./models/signup');

Sequelize.sync({force : false})
    .then(res => app.listen(process.env.PORT || 3000))
    .catch(err => console.log(err));