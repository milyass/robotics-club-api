require("dotenv").config();
require("./config/db")()

const express = require('express')
const app = express();

const morgan = require("morgan");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const passport = require('passport');

const errorDebug = require("./middlewares/errorDebug");
const checkRoute = require("./middlewares/checkRoute");
const errorHandler = require("./middlewares/errorHandler");

// Middlewares
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(session({
    secret: '42',
    resave: true,
    saveUninitialized: true
}))
app.use(cors({
    origin: "http://localhost:3000", // <-- react app location
    credentials: true
}));
app.use(cookieParser('42'))
app.use(morgan("dev"));
app.use(passport.initialize())
app.use(passport.session())

const Users = require('./routes/users');
const Events = require('./routes/events');
const Articles = require('./routes/articles');

require('./authentication')(passport);
app.use('/users', Users);
app.use('/events', Events);
app.use('/articles', Articles);
app.use(errorHandler);

app.use(errorDebug);
app.use(checkRoute);

const SERVICE_NAME = process.env.SERVICE_NAME
const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`${SERVICE_NAME} is Listening on port ${PORT}`));