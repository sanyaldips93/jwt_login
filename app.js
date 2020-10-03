const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');


const app = express();

// Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/private');

dotenv.config();

// Connect to DB
mongoose.connect(process.env.DB_CONNECT, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    },
    () => {
    console.log('Connected To DB!');
})

// Logging
app.use(morgan('tiny'));

// Body Parser
app.use(express.json());


// Route Middleware
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);


app.listen(3000, () => console.log(`Server up and running!`));
