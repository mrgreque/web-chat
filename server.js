const express = require('express');
const path = require('path');
const axios = require('axios');
const database = require('./database/db');
const User = require('./model/user');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname,'public')));
app.set('views',path.join(__dirname,'public'));
app.engine('html',require('ejs').renderFile);
app.set('view engine','html');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/',(req, res) =>{
    res.render('index.html');
});

app.get('/chat', (req, res) => {
    res.render('chat.html');
});

app.post('/cadastro', async (req, res) => {
    const name = req.body.name;
    const user = req.body.user;
    const passwd = req.body.passwd;

    try {
        const sync = database.sync();

        const create = await User.create({
            user: user,
            passwd: passwd,
            name: name,
            ativo: 1
        });

        res.status(200).send({
            method: 'Create',
            success: true,
            data: create
        });
    } catch (err) {
        console.log(err);
        res.status(200).send({
            method: 'Create',
            success: false,
            data: null
        });
    }
});

app.post('/login', async (req, res) => {
    const usr = req.body.user;
    const pwd = req.body.password;
    const sync = await database.sync();
    const dados = await User.findByPk(usr);

    if (dados !== null){
        if (dados.dataValues.user == usr && dados.dataValues.passwd == pwd){
            res.status(200).send({
                logged: true,
                statusText: 'Ok.'
            });
        } else {
            res.status(200).send({
                logged: false,
                statusText: 'Usuário/senha incorretos.'
            });
        }
    } else {
        res.status(200).send({
            logged: false,
            statusText: 'Usuário/senha incorretos'
        });
    };

    /*if (usr == 'root' && pwd == '1234') {
        res.status(200).send({
            logged: true
        })
    } else {
        if (usr == 'sa' && pwd == '1234'){
            res.status(200).send({
                logged: true
            });
        } else {
            res.status(200).send({
                logged: false
            });
        };
    };*/
});

let messages = [];
let rooms = [];
io.on('connection', socket =>{
    //console.log(`Socket conectado: ${socket.id}`);
    socket.name = '';
    socket.on('start', () => {
        let sendRooms = [];
        for (let room of rooms) {
            let sockets = io.in(room);
            if (socket in sockets){
                sendRooms.push(room);
            };
        }
    });

    /*socket.emit('previousMessages', messages);

    socket.on('getPreviousMessages', () => {
        socket.emit('previousMessages', messages);
    });

    socket.on('sendMessage', data =>{
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
        socket.broadcast.emit('talks', messages);
    }); 

    socket.emit('talks', messages);

    socket.on('newMessage', data =>{
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
        socket.broadcast.emit('talks', messages);
    });*/

    /*socket.emit('valLogin', users);

    socket.on('cadastro', data =>{
        users.push(data);
        socket.broadcast.emit('confirmaCadastro', data);
    });*/

});

server.listen(5000);