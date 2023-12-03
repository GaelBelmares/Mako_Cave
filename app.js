///Invocar express
const express = require('express');
const app = express();
///Invocar express-validator
const { body, validationResult } = require('express-validator');

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

///Invocar bcryptjs
const bcryptjs = require('bcryptjs');

///Variables de Sesión
const session = require('express-session');
app.use(session ({
    secret: 'secret',
    resave: true,
    saveUninitialized:true
}));

///Invocar conexion a BD
const connection = require('./database/db');

///Logout
app.get('/logout', (req, res) =>{
    req.session.destroy(() =>{
        res.redirect('login');
    });
});


///////////Conexion al puerto///////////////////////////
app.listen(8000, (req, res) => {
    console.log('Servidor Iniciado')
});
////////////////////////////////////////////////////////


////////ARBOL DE RUTAS////////////////////////////////////

///Render Login
app.get('/login', (req, res) =>{
    res.render('login.ejs');
});

//
app.get('/register', (req, res) =>{
    res.render('register.ejs');
});

///Render Terminos y Condiciones
app.get('/term', (req, res) =>{
    res.render('term.ejs');
});

app.get('/guess', (req, res) =>{
    res.render('guess.ejs');
});

//////////////////////////////////////////////////////////

////////////////////CRUD LOGICA//////////////////////////////////////////////////////
///////////Logica Editar datos//////////////////////////
app.post('/update', async (req, res) =>{
    const id = req.body.id;
    const name = req.body.name;
    const ape = req.body.ape;
    const user = req.body.user;
    const correo = req.body.correo;
    const rol = req.body.rol;
    connection.query('UPDATE users SET ? WHERE id = ?', [{user:user, name:name, ape: ape, correo: correo, rol: rol}, id], (error, results) =>{
        if(error){
            console.log(error);
        }else{
            res.redirect('/admin')
        }
    });
});

////////////////////////////////////////////////////////


/////////Logica Eliminar usuarios///////////////////////
app.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM users WHERE id = ?', [id], (error, results) => {
        if(error){
            throw error;
        }else{
            res.redirect('/admin');
        }
    });
});
//////////////////////////////////////////////////////////


////////Logica para hacer alta con admin//////////////////
app.post('/add', [
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('ape').notEmpty().withMessage('Los apellidos son obligatorios'),
    body('user').notEmpty().withMessage('El nombre de usuario es obligatorio'),
    body('correo').isEmail().withMessage('Ingrese un correo electrónico válido'),
    body('pass').
        isLength({ min: 8 }).withMessage('La password debe minimo 8 caracteres; una letra mayuscula y minuscula; un caracter especial y no tener letras ni numeros consecutivos')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/)
        .withMessage('La contraseña debe cumplir con los requisitos de seguridad'),
    body('rol').notEmpty().withMessage('Seleccione un rol')
], async (req, res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('register', {
            alert: true,
            alertTitle: 'Error',
            alertMessage: errors.array().map(error => error.msg).join('<br>'),
            alertIcon: 'error',
            showConfirmButton: true,
            timer: 1500,
            ruta: 'register'
        });
    }

    const name = req.body.name;
    const ape = req.body.ape;
    const user = req.body.user;
    const correo = req.body.correo;
    const rol = req.body.rol;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);

    connection.query('INSERT INTO users SET ?', {name:name, ape:ape, user: user, correo:correo, pass:passwordHaash, rol:rol}, async(error, results) =>{
        if(error){
            console.log(error);
        }else{
            res.render('admin', {
                alert:true,
                alertTitle: "registration",
                alertMessage: "Bienvenido a la cueva",
                alertIcon: 'succes',
                showConfirmButton: false,
                timer: 1500,
                ruta: ''
            });
        }
    });
});
//////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////
////////////Logica para hacer registro en BD//////////////
app.post('/register', [
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('ape').notEmpty().withMessage('Los apellidos son obligatorios'),
    body('user').notEmpty().withMessage('El nombre de usuario es obligatorio'),
    body('correo').isEmail().withMessage('Ingrese un correo electrónico válido'),
    body('pass')
        .isLength({ min: 8 }).withMessage('La password debe minimo 8 caracteres; una letra mayuscula y minuscula; un caracter especial y no tener letras ni numeros consecutivos')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/)
        .withMessage('La contraseña debe cumplir con los requisitos de seguridad'),
    body('rol').notEmpty().withMessage('Seleccione un rol')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('register', {
            alert: true,
            alertTitle: 'Error',
            alertMessage: errors.array().map(error => error.msg).join(),
            alertIcon: 'error',
            showConfirmButton: true,
            timer: 1500,
            ruta: 'register'
        });
    }

    const name = req.body.name;
    const ape = req.body.ape;
    const user = req.body.user;
    const correo = req.body.correo;
    const rol = req.body.rol;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    connection.query('INSERT INTO users SET ?', {name:name, ape:ape, user: user, correo:correo, pass:passwordHaash, rol:rol}, async(error, results) =>{
        if(error){
            console.log(error);
        }else{
            res.render('index', {
                alert:true,
                alertTitle: "registration",
                alertMessage: "Bienvenido a la cueva",
                alertIcon: 'succes',
                showConfirmButton: false,
                timer: 1500,
                ruta: ''
            });
        }
    });
});
//////////////////////////////////////////////////////////


/////Logica para hacer autenticación de login/////////////

app.post('/auth', async(req, res) =>{
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);

    if(user && pass){
        connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results) => {
            if(results.length === 0 || !(await bcryptjs.compare(pass, results[0].pass))){
                res.render('login', {
                alert:true,
                alertTitle: "Error",
                alertMessage: "Usuario y/o contraseña incorrectos",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
                });
            }else{
                req.session.name = results[0].name;
                res.render('index', {
                alert:true,
                alertTitle: "Conexion Exitosa",
                alertMessage: "Bienvenido a la cueva",
                alertIcon: 'succes',
                showConfirmButton: false,
                timer: 1500,
                ruta: ''
                });
            }
        });
    }else{
        res.render('login', {
            alert:true,
            alertTitle: "Advertencia",
            alertMessage: "Ingrese un usuario y contraseña",
            alertIcon: 'warning',
            showConfirmButton: true,
            timer: 1500,
            ruta: 'login'
        });
    }
});
//////////////////////////////////////////////////////////


//////Autenticación a otras paginas//////////////////////
app.get('/', (req, res) =>{

    if(req.session.loggedin){ 
       res.render('index', {
        login: true,
        name: req.session.name
       });
    }else{
        res.render('index', {
            login: false,
            name: 'Debes iniciar sesión'
        });
    }
});
/////////////////////////////////////////////////////////


///////Autenticación y Renderizar Admin//////////////////
app.get('/admin', (req, res) => {
    connection.query('SELECT * FROM users', (error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error interno del servidor');
        } else {
            res.render('admin.ejs', {
                login: true, 
                name: 'user',
                users: results
            });
        }
    });
});
/////////////////////////////////////////////////////////


////////////Renderizar Editar///////////////////////////
app.get('/edit/:id', (req, res) =>{

    const id = req.params.id;
    connection.query('SELECT * FROM users WHERE id =?', [id], (error, results) =>{
        if(error){
            throw error;
        }else{
            res.render('edit.ejs', {user: results[0]});
        }
    });

});
////////////////////////////////////////////////////////