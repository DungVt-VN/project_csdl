const express = require('express');
const session = require('express-session');
const path = require('path');
const morgan = require('morgan');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();

const port = 8080;

const route = require('./routes');
app.engine(
    '.hbs',
    handlebars.engine({
        extname: '.hbs',
    }),
);

app.use(session({
  secret: 'abcdefg',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

route(app);

app.listen(port, () => console.log(`Localhost is running on port ${port}`));
