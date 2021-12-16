//FRONT
function setDisplay(element, display) {
    element.style.display = display;
};

function setDisplays(elements, display) {
    for (let element of elements ) {
        element.style.display = display;
    };
};

const redirectToCadastro = document.getElementById('signup');
const redirectToLogin = document.getElementById('sigin');
const divLogin = document.getElementById('login');
const divCadastro = document.getElementById('cadastro');
const errCadastro = document.getElementById('err-cad');
const forms = document.getElementById('forms');

setDisplay(divCadastro, 'none');
redirectToCadastro.addEventListener('click', () => {
    setDisplays([divLogin, redirectToCadastro], 'none');
    setDisplays([cadastro, redirectToLogin], 'block');
    setDisplay(divCadastro, 'flex');
});

redirectToLogin.addEventListener('click', () => {
    setDisplays([divCadastro, cadastro, redirectToLogin], 'none');
    setDisplay(redirectToCadastro, 'block');
    setDisplay(divLogin, 'flex');
});

//FORMS BD INTEGRATED
const form = document.getElementById('form-login');
form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const user = document.getElementById('usr').value;
    const password = document.getElementById('pwd').value;
    const check = document.getElementById('check');

    if (user != '' && password != ''){
        await axios.post('/login', {
            user: user,
            password: password
        })
        .then((res) => {
            if (res.data.logged == true) {
                sessionStorage.setItem('user', user);
                sessionStorage.setItem('talks', JSON.stringify({talks: []}));
                sessionStorage.setItem('loggedAt', new Date().toLocaleString());
                window.location = '/chat';
            } else {
                check.innerHTML = 'Usuário ou senha inválidos.';
            }
        })
        .catch((err) => {
            alert(err);
        });
    } else {
        check.innerHTML = 'Insira todos os campos';
    }
});

function createCadastrado(user) {
    setDisplay(divCadastro, 'none');
    setDisplay(forms, 'none');
    let section =  document.createElement('section');
    section.setAttribute('id', 'cadastrado');

    let success = document.createElement('p');
    success.setAttribute('id', 'success');
    success.innerHTML = `Usuário <strong>${user}</strong> cadastrado com sucesso`;

    let button = document.createElement('button');
    button.setAttribute('id', 'to-login');
    button.innerHTML = 'Retornar ao login';
    button.addEventListener('click', () => {
        setDisplays([forms, divLogin], 'flex');
        setDisplay(redirectToCadastro, 'block');
        setDisplay(section, 'none');
    });

    section.appendChild(success);
    section.appendChild(button);
    document.body.appendChild(section);
}

const cadastro = document.getElementById('form-cadastro');
cadastro.addEventListener('submit', async function (e) {
    e.preventDefault();
    const user = document.getElementById('cad-usr').value;
    const passwd = document.getElementById('cad-pwd').value;
    const name = document.getElementById('cad-name').value;

    if (name != '' && user != '' && passwd != '') {
        await axios.post('/cadastro', {
            user: user,
            passwd: passwd,
            name: name,
            ativo: 1
        })
        .then((res) => {
            if (res.data.success == true) {
                createCadastrado(user);
            } else {
                errCadastro.innerHTML = 'Usuário já existente';
            }
        })
        .catch((err) => {
            alert(err);
        });   
    } else {
        errCadastro.innerHTML = 'Inserir todos os campos';
    }
});