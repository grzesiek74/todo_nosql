const express = require('express');
const {engine} = require('express-handlebars');
require('express-async-errors');
const methodOverride = require('method-override');
const { homeRouter } = require('./routes/home');
const { todoRouter } = require('./routes/todo');
const {handleError, NotFoundError} = require('./utils/errors');

const app = express();

app.use(methodOverride('_method'));
app.use(express.urlencoded({
    extended: true,
}));
app.use(express.static('public'));
app.use(express.json());


app.engine('.hbs', engine({
    extname: '.hbs',
}));
app.set('view engine', '.hbs');


app.use('/', homeRouter);
app.use('/todos', todoRouter);
// app.get('/:anything', (req, res) => {
//     throw new NotFoundError();
//   });


app.listen(3000, '0.0.0.0', () => {
    console.log('Listening on https://localhost:3000');
});