let socket = io('http://localhost:5000');
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

socket.on('previousMessages', function(messages){
    for (message of messages){
        renderMessage(message);
    }
})

socket.on('receivedMessage', function(message){
    renderMessage(message);
})

const chat = document.querySelector('#chat');
chat.addEventListener('submit',function(event){
    event.preventDefault();

    let author = window.localStorage.getItem('user');
    //var remet = $('input[name=destinatario]').val();
    let message = document.getElementById('message').value;

    let messageObject = {}
    if(author.length && message.length){
        messageObject.author = author;
        messageObject.message = message;
        /*remet: remet,*/

        renderMessage(messageObject);

        socket.emit('sendMessage', messageObject);
    };
});