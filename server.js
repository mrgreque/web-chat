const express = require('express');
const path = require('path');
const axios = require('axios');
const database = require('./database/db');
const modelUser = require('./model/user');
const {joinUser, getUser, leaveUser} = require('./util/user');
const {messageModel, getPreviousTalks, getIndexRoom} = require('./util/message');


const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname,'public')));
app.set('views',path.join(__dirname,'public'));
app.engine('html',require('ejs').renderFile);
app.set('view engine','html');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

let rooms = [];

io.on('connection', socket =>{
    //console.log(`Socket conectado: ${socket.id}`);
    function addRoom(room) {
        let possui = false;
        let createdRoom = 0;

        for (let k = 0; k < rooms.length; k++){
            if (rooms[k].name == room.name){
                possui = true;
                createdRoom = k;
            };
        };

        console.log(rooms);
        try {
            console.log(rooms[0].messages);
        } catch {
            null;
        }

        if (possui == false) {
            rooms.push(room);
            socket.emit('attTalks', rooms);
        } else {
            rooms[createdRoom].messages.push(room.messages[0]);
        }
    }

    socket.on('sendUserSession', (user) => {
        socket.emit('talks', getPreviousTalks(user, rooms));
    });

    socket.on('addRoom', ({name, user, destinatary, message}) => {
        addRoom({
            name: name,
            messages: [messageModel(message.author, message.message)],
            users: [user, destinatary]
        });
    });

    socket.on('talkInit', ({user, room}) => {
        const userInit = joinUser(socket.id, user, room);

        socket.join(userInit.room);

        socket.emit('sysMessage', messageModel('sys', `Hello world ${userInit.user}.`));

        socket.broadcast.to(userInit.room).emit('sysMessage', messageModel('sys', `Usuário ${userInit.user} concectado.`));

        socket.emit('previousMessages', rooms[getIndexRoom(rooms, userInit.room)].messages);

        socket.on('sendMessage', (message) => {
            const username = getUser(message.author);
            rooms[getIndexRoom(rooms, userInit.room)].messages.push(messageModel(message.author, message.message));
            io.to(userInit.room).emit('renderMessage', messageModel(message.author, message.message));
        });

        socket.on('disconnection', () => {
            io.to(userInit.room).emit('sysMessage', messageModel('sys', `Usuário ${userInit.user} desconectado.`));
        });

    });

});

app.get('/',(req, res) =>{
    res.render('index.html');
});

app.get('/chat', (req, res) => {
    res.render('chat.html');
});

app.post('/cadastro', async (req, res) => {
    const name = req.body.name;
    const cadUser = req.body.user;
    const passwd = req.body.passwd;

    try {
        const sync = database.sync();

        const create = await modelUser.create({
            user: cadUser,
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
    const dados = await modelUser.findByPk(usr);

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
});

server.listen(5000);