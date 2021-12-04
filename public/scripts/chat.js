let socket = io('http://localhost:5000');

io.on('connect', socket => {
    socket.emit('start', {
        socket: socket,
        user: localStorage.getItem('user'),
        rooms: []
    })
});

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

function renderMessage(message){
    let div = document.createElement('div');
    div.setAttribute('class', 'message');
    div.innerHTML = `<strong>${message.author}: </strong>${message.message}`;

    document.querySelector('#messages').appendChild(div);
    document.getElementById('message').value = '';
}

socket.on('receivedMessage', function(message){
    /*document.querySelectorAll('.message').forEach((message) => {
        message.parentNode.removeChild(message);
    });*/
    if (message.destinatary == localStorage.getItem('user') && message.author == localStorage.getItem('destinatary') || message.author == localStorage.getItem('user') && message.destinatary == localStorage.getItem('destinatary')){
        renderMessage(message);
    }
})

const chat = document.querySelector('#chat');
chat.addEventListener('submit',function(event){
    event.preventDefault();

    let author = localStorage.getItem('user');
    let destinatary = localStorage.getItem('destinatary');
    let message = document.getElementById('message').value;

    let messageObject = {}
    if(author.length && message.length){
        messageObject.author = author;
        messageObject.message = message;
        messageObject. destinatary = destinatary;

        renderMessage(messageObject);

        socket.emit('sendMessage', messageObject);
    };
});

/*const talks = document.querySelectorAll('.talk');
talks.forEach( (element) => {
    
    
});*/

socket.on('previousMessages', function(messages){
    for (let message of messages){
        if (message.author == localStorage.getItem('destinatary') && message.destinatary == localStorage.getItem('user') || message.destinatary == localStorage.getItem('destinatary') && message.author == localStorage.getItem('user')){
            renderMessage(message);
        }
    }
});

let talks = [];
socket.on('talks', (messages) => {

    for (let message of messages) {
        if (message.destinatary == localStorage.getItem('user') && talks.includes(message.destinatary) == false){
            if (talks.includes(message.author) == false) {
                talks.push(message.author);
            };
        };
    };
    
    let myArray = [];
    let divsTalk = document.querySelectorAll('.talk').forEach((talk) => {
        if (myArray.includes(talk.getAttribute('id')) == false) {
            myArray.push(talk.getAttribute('id'));
        };
    });

    console.log(talks);
    for (let talk of talks) {
        if (myArray.includes(talk) == false){
            let p = document.createElement('p');
            p.setAttribute('class', 'talk-user');
            p.innerHTML = talk;

            let img = document.createElement('div');
            img.setAttribute('class', 'talk-img');

            let div = document.createElement('div');
            div.setAttribute('class', 'talk');
            div.setAttribute('id', talk);
            div.addEventListener('click', () => {
                //AQUIIIIIIIII
                document.querySelectorAll('.message').forEach((message) => {
                    message.parentNode.removeChild(message);
                });
                localStorage.setItem('destinatary', talk);
                document.getElementById('chat').style.display = 'flex';
                socket.emit('getPreviousMessages', null);
            });

            div.appendChild(img);
            div.appendChild(p);

            document.getElementById('left').appendChild(div);
    
        }
    }    
});

const iconAdd = document.getElementById('icon-add');
iconAdd.addEventListener('click', () => {
    const contact = prompt('Qual o contato?');
    const firstMessage = prompt('Primeira mensagem:');

    let author = localStorage.getItem('user');

    const newMessage = {
        author: author,
        message: firstMessage,
        destinatary: contact
    };

    socket.emit('newMessage', newMessage);
})