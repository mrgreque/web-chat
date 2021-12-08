let socket = io.connect();

if (sessionStorage.getItem('user') == null){
    window.location = '/';
}

//io.connect().on('connection', socket => {
    socket.emit('sendUserSession', sessionStorage.getItem('user') );

    socket.on('talks', talks => {
        talks.forEach(talk => {
            addTalk(talk);
        });
    });

    socket.on('sysMessage', message => {
        renderMessage(message);
    });

    socket.on('previousMessages', messages => {
        messages.forEach(message => {
            renderMessage(message);
        });
    });

    socket.on('renderMessage', message => {
        renderMessage(message);
    });

    socket.on('attTalks', rooms => {
        let userTalks = [];
        
        rooms.forEach(room => {
            room.users.forEach(user => {
                user == sessionStorage.getItem('user') ? userTalks.push(room) : null; 
            });
        });

        let userTalksNow = document.querySelectorAll('.talk');
        userTalksNow.forEach((u) => {
            u.parentNode.removeChild(u);
        });

        socket.emit('sendUserSession', sessionStorage.getItem('user'));
        
    });
//});

const leftTop = document.getElementById('top');
leftTop.appendChild(you());

function you() {
    let you = document.createElement('p');
    you.innerHTML = `Você está logado(a) como <strong>${sessionStorage.getItem('user')}</strong>`;
    return you;
}

document.getElementById('logoff').addEventListener('click', _ => {
    window.sessionStorage.clear();
    window.location = '/';
});

const iconAdd = document.getElementById('icon-add');
iconAdd.addEventListener('click', () => {
    const contact = prompt('Qual o contato?');
    const firstMessage = prompt('Primeira mensagem:');

    const author = sessionStorage.getItem('user');

    const newMessage = {
        name: `${author}x${contact}`,
        user: author,
        destinatary: contact,
        message: {
            author: author,
            message: firstMessage
        }
    };

    socket.emit('addRoom', newMessage);
});

function renderMessage(message){
    console.log(message);
    let div = document.createElement('div');
    div.setAttribute('class', 'message');
    div.innerHTML = `${message.sendedAt} <strong>${message.author}: </strong>${message.message}`;

    document.querySelector('#messages').appendChild(div);
    document.getElementById('message').value = '';
}

function addTalk(talk) {
    let destinatary = '';

    let p = document.createElement('p');
    p.setAttribute('class', 'talk-user');
    talk.users.forEach(user => {
        if (user != sessionStorage.getItem('user')){
            p.innerHTML = user;
            destinatary = user;
        };
    });

    let img = document.createElement('div');
    img.setAttribute('class', 'talk-img');

    let div = document.createElement('div');
    div.setAttribute('class', 'talk');
    div.setAttribute('id', talk.room);
    div.addEventListener('click', () => {
        console.log(JSON.parse(sessionStorage.getItem('talks')));
        let localTalks = JSON.parse(sessionStorage.getItem('talks'));
        if (localTalks.talks.includes(talk.room) == false) {

            localTalks.talks.push(talk.room);
            console.log(JSON.stringify(localTalks));
            sessionStorage.setItem('talks', JSON.stringify(localTalks));
    
            socket.emit('talkInit', {
                user: sessionStorage.getItem('user'),
                room: talk.room
            });
        };
        document.querySelectorAll('.message').forEach((message) => {
            message.parentNode.removeChild(message);
        });
        document.getElementById('chat').style.display = 'flex';
        socket.emit('dados', {
            user: sessionStorage.getItem('user'),
            room: talk.room
        });
    });

    div.appendChild(img);
    div.appendChild(p);

    document.getElementById('left').appendChild(div);
}

const chat = document.querySelector('#chat');
chat.addEventListener('submit',function(event){
    event.preventDefault();
    
    let message = document.getElementById('message');

    socket.emit('sendMessage', {
        author: sessionStorage.getItem('user'),
        message: message.value
    });

    message.value = '';
    //message.focus();
});

function click(room) {
    document.querySelectorAll('.message').forEach((message) => {
        message.parentNode.removeChild(message);
    });
    document.getElementById('chat').style.display = 'flex';
    //ESTA DUPLICANDO, BLOQUEAR CLIQUE
    socket.emit('talkInit', {
        user: sessionStorage.getItem('user'),
        room: room
    });
    block(room)
}

function block(id){
    const talks = document.querySelectorAll('.talk');

    talks.forEach( talk => {
        if (talk.getAttribute('id') == id) {
            talk.removeAttribute('click', click(id));
        } else {
            try {
                talk.removeAttribute('click', click(id));
            } catch (error) {
                null;
            }
            talk.addEventListener('click', click(id));
        }
    })
}