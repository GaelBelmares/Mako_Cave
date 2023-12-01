///Invocar express
const express = require('express');
const app = express();

///Setear urlencoded para capturar datos en formulario
app.use(express.urlencoded({extended:false}));
app.use(express.json());

///Invocar Dotenv
const dotenv = require('dotenv');
dotenv.config({path: './env/.env'});

///Directorio Public
app.use('/resources', express.static('public'));
//app.use('resources', express.static(__dirname + '/public'));

///Motor de Plantillas
app.set('view engine', 'ejs');

///Invocar Bcryptjs
const Bcryptjs = require('bcryptjs');

///Variables de Sesión
const session = require('express-session');
app.use(session ({
    secret: 'secret',
    resave: true,
    saveUninitialized:true
}));

///Invocar conexion a BD
const connection = require('./database/db');

////////ARBOL DE RUTAS////////////////////////////////////('

///Render Index
app.get('/', (req, res) =>{
    res.render('index.ejs');
});

///Render Login
app.get('/login', (req, res) =>{
    res.render('login.ejs');
});

app.get('/register', (req, res) =>{
    res.render('register.ejs');
});

///Render Terminos y Condiciones
app.get('/term', (req, res) =>{
    res.render('term.ejs');
});

//////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////
app.post('/register', async (req, res) =>{
    const name = req.body.name;
    const ape = req.body.ape;
    const user = req.body.user;
    const correo = req.body.correo;
    const rol = req.body.rol;
    const pass = req.body.pass;
    let passwordHaash = await Bcryptjs.hash(pass, 8);
    connection.query('INSERT INTO user SET ?');
});
//////////////////////////////////////////////////////////

app.get('/', (req, res) =>{
    res.send('Hola puerca')
});

app.listen(8000, (req, res) => {
    console.log('Servidor Iniciado')
});