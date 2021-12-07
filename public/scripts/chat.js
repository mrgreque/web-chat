let socket = io.connect();

//io.connect().on('connection', socket => {
    socket.emit('sendUserSession', localStorage.getItem('user'));

    socket.on('talks', talks => {
        talks.forEach(talk => {
            addTalk(talk);
        });
    });

    socket.on('sysMessage', message => {
        renderMessage(message);
    });

    socket.on('previousMessages', messages => {
        console.log('previous messages: ', messages);
        messages.forEach(message => {
            renderMessage(message);
        });
    });

    socket.on('renderMessage', message => {
        renderMessage(message);
    });

    socket.on('attTalks', rooms => {
        console.log('Aqui,', rooms);
        let userTalks = [];
        
        rooms.forEach(room => {
            room.users.forEach(user => {
                user == localStorage.getItem('user') ? userTalks.push(room) : null; 
            });
        });

        let userTalksNow = document.querySelectorAll('.talk');
        
        if (userTalksNow.length !== userTalks.length) {
            socket.emit('sendUserSession', localStorage.getItem('user'));
        };
        
    });
//});

const leftTop = document.getElementById('top');
leftTop.appendChild(you());

function you() {
    let you = document.createElement('p');
    you.innerHTML = `Você está logado(a) como <strong>${localStorage.getItem('user')}</strong>`;
    return you;
}

document.getElementById('logoff').addEventListener('click', _ => {
    window.localStorage.clear();
    window.location = '/';
});

const iconAdd = document.getElementById('icon-add');
iconAdd.addEventListener('click', () => {
    const contact = prompt('Qual o contato?');
    const firstMessage = prompt('Primeira mensagem:');

    const author = localStorage.getItem('user');

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
        if (user != localStorage.getItem('user')){
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
        document.querySelectorAll('.message').forEach((message) => {
            message.parentNode.removeChild(message);
        });
        document.getElementById('chat').style.display = 'flex';
        //ESTA DUPLICANDO, BLOQUEAR CLIQUE
        socket.emit('talkInit', {
            user: localStorage.getItem('user'),
            room: talk.room
        });
        div.disabled = true;
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
        author: localStorage.getItem('user'),
        message: message.value
    });

    message.value = '';
    //message.focus();
});