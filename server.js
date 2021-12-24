const express = require('express');
const path = require('path');
const axios = require('axios');
const database = require('./database/db');
const modelUser = require('./model/user');
const {joinUser, getUser, leaveUser} = require('./util/user');
const {messageModel, getPreviousTalks, getIndexRoom} = require('./util/message');
const { encrypt, decrypt } = require('./util/bcrypt');


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
    socket.emit('reset', {reset: true});

    function addRoom(room) {
        let possui = false;
        let createdRoom = 0;

        rooms.forEach( r => {
            if (r.name == room.name || r.name == `${room.users[1]}x${room.users[0]}`) {
                possui = true;
                createdRoom = getIndexRoom(rooms, room.name);
            }
        })

        if (possui == false) {
            rooms.push(room);
            io.emit('attTalks', rooms);
        } else {
            rooms[createdRoom].messages.push(room.messages[0]);
            socket.emit('previousMessages', rooms[createdRoom].messages)
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
    });

    let userInit = null;
    socket.on('dados', ({user, room}) => {
        userInit = joinUser(socket.id, user, room);

        socket.emit('previousMessages', rooms[getIndexRoom(rooms, userInit.room)].messages);
    });

    socket.on('sendMessage', (message) => {
        const username = getUser(message.author);
        rooms[getIndexRoom(rooms, userInit.room)].messages.push(messageModel(message.author, message.message));
        io.to(userInit.room).emit('renderMessage', messageModel(message.author, message.message));
    });

});

app.get('/',(req, res) =>{
    res.render('index.html');
});

app.get('/chat', (req, res) => {
    res.render('chat.html');
});

app.post('/cadastro', async (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const cadUser = req.body.user;
    const passwd = await encrypt(req.body.passwd);
    const signUp = await modelUser.createUser({email: email, user: cadUser, password: passwd, name: name});
    
    if (signUp.data != null) {
        res.status(200).json({
            method: 'createUser',
            success: true,
            message: 'Success'
        });
    } else {
        res.status(200).json({
            method: 'createUser',
            success: false,
            message: signUp.error.message
        });
    };
});

app.post('/login', async (req, res) => {
    const usr = req.body.user;
    const pwd = req.body.password;
    const signIn = await modelUser.userAuth({user: usr});
    const compare = await decrypt(pwd, signIn.data[0].password);

    if ( signIn.data.length !== 0 && compare ) {
        res.status(200).json({
            logged: true,
            message: 'Ok.',
            name: signIn.data[0].name
        });
    } else {
        res.status(200).json({
            logged: false,
            message: 'Usuário ou senha inválidos',
            name: null
        });
    }
});

server.listen( process.env.PORT || 5000);