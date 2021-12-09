//criando aplicação



const express = require('express');
const bodypParser = require('body-parser');

const app = express();

app.use(bodypParser.json());
app.use(bodypParser.urlencoded({extended: false}));


require('./controllers/authController')(app);


app.listen(3000);