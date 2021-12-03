const express = require('express');
const path = require('path');
const axios = require('axios');

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

app.post('/login', (req, res) => {
    const usr = req.body.user;
    const pwd = req.body.password;
    if (usr == 'root' && pwd == '1234') {
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
    };
});

let messages = [];

io.on('connection', socket =>{
    console.log(`Socket conectado: ${socket.id}`);

    socket.emit('previousMessages', messages);

    socket.on('sendMessage', data =>{
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
    }); 

    /*socket.emit('valLogin', users);

    socket.on('cadastro', data =>{
        users.push(data);
        socket.broadcast.emit('confirmaCadastro', data);
    });*/

});

server.listen(5000);