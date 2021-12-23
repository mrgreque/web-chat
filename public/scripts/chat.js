let socket = io.connect();

//Validar se esta logado, caso contrário redireciona à página de login
if (sessionStorage.getItem('user') == null){
    window.location = '/';
}

socket.on('reset', () => {
    sessionStorage.setItem('talks', JSON.stringify({"talks": []}));
});

//Ao entrar no chat o user da sessão é enviado para o back-end
socket.emit('sendUserSession', sessionStorage.getItem('user') );

//Recebe as conversas ativas e as renderiza
socket.on('talks', talks => {
    talks.forEach(talk => {
        addTalk(talk);
    });
});

//Recebe as mensagens antigas da conversa
socket.on('previousMessages', messages => {
    messages.forEach(message => {
        renderMessage(message);
    });
});

//Adicina mensagem à respectiva conversa
socket.on('renderMessage', message => {
    renderMessage(message);
});

//Atualiza as conversas ativas
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

//User logged
const leftTop = document.getElementById('top');
leftTop.appendChild(you());
function you() {
    let you = document.createElement('p');
    you.innerHTML = `<strong>${sessionStorage.getItem('name')}</strong>`;
    return you;
}

//Adiciona evento de click ao botão de logoff
document.getElementById('logoff').addEventListener('click', _ => {
    window.sessionStorage.clear();
    window.location = '/';
});

//Adiciona a funcinoalida de iniciar nova conversa
const iconAdd = document.getElementById('icon-add');
iconAdd.addEventListener('click', () => {
    const contact = prompt('Qual o contato?');
    const users = [];
    const talks = document.querySelectorAll('.talk-user');
    talks.forEach( talk => {
        users.push(talk.innerHTML);
    });

    if (users.includes(contact)) {
        alert('Já possui conversa ativa');
    } else {
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
    }
});


function renderMessage(message){
    let div = document.createElement('div');
    div.setAttribute('class', 'div-message');
    if (message.author == sessionStorage.getItem('user')) {
        div.style.cssText = 'background-color: #51aabf';
    } else {
        if (window.innerWidth > 800) {
            div.style.cssText = 'background-color: #333356; left:51%;';
        } else {
            div.style.cssText = 'background-color: #333356; left:6%;';
        }
    }

    let dateAndHour = document.createElement('span');
    dateAndHour.setAttribute('class', 'date-and-hour');
    dateAndHour.innerHTML = `${message.sendedAt}`;
    
    let span = document.createElement('span');
    span.setAttribute('class', 'message');
    span.innerHTML = `<strong>${message.author}: </strong>${message.message}`;

    div.appendChild(dateAndHour);
    div.appendChild(span);
    let campMessages = document.querySelector('#messages');
    campMessages.appendChild(div);
    campMessages.scrollTop = campMessages.scrollHeight;
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
        let localTalks = JSON.parse(sessionStorage.getItem('talks'));
        if (localTalks.talks.includes(talk.room) == false) {

            localTalks.talks.push(talk.room);
            sessionStorage.setItem('talks', JSON.stringify(localTalks));
    
            socket.emit('talkInit', {
                user: sessionStorage.getItem('user'),
                room: talk.room
            });
        };
        document.querySelectorAll('.div-message').forEach((message) => {
            message.parentNode.removeChild(message);
        });
        document.querySelector('.inputMessage').style.display = 'block';
        document.querySelector('.buttonMessage').style.display = 'block';
        document.querySelector('.messages').style.display = 'flex';
        document.getElementById('inputMessage').style.display = 'flex';
        //document.getElementById('chat').style.display = 'flex';
        socket.emit('dados', {
            user: sessionStorage.getItem('user'),
            room: talk.room
        });
    });

    div.appendChild(img);
    div.appendChild(p);

    document.getElementById('left').appendChild(div);
}

//Ao enviar mensagem pelo chat, ele envia via Socket a mesma para que ela seja renderizada
const chat = document.querySelector('#chat');
chat.addEventListener('submit',function(event){
    event.preventDefault();
    
    let message = document.getElementById('message');
    socket.emit('sendMessage', {
        author: sessionStorage.getItem('user'),
        message: message.value
    });

    message.value = '';
    message.focus();
});