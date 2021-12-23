//UTIL FUNCTIONS
function setDisplay(element, display) {
    element.style.display = display;
};

function setDisplays(elements, display) {
    for (let element of elements ) {
        element.style.display = display;
    };
};

function resetValue (element, innerOrValue) {
    innerOrValue == 'inner' ? element.innerHTML = '' : element.value = '';
}

function resetValues (elements, innerOrValue) {
    innerOrValue == 'inner' ? elements.forEach(element => {
        element.innerHTML = '';
    }) : elements.forEach( element => {
        element.value = '';
    });
}

//CAMPOS
const redirectToCadastro = document.getElementById('signup');
const redirectToLogin = document.getElementById('sigin');
const divLogin = document.getElementById('login');
const divCadastro = document.getElementById('cadastro');
const errCadastro = document.getElementById('err-cad');
const forms = document.getElementById('forms');

//EVENTS TO LOGIN / TO REGISTER
setDisplay(divCadastro, 'none');
redirectToCadastro.addEventListener('click', () => {
    setDisplays([divLogin, redirectToCadastro], 'none');
    setDisplays([cadastro, redirectToLogin], 'block');
    setDisplay(divCadastro, 'flex');
    resetValue(document.getElementById('check'), 'inner');
    forms.style.height = '90vh';
});

redirectToLogin.addEventListener('click', () => {
    setDisplays([divCadastro, cadastro, redirectToLogin], 'none');
    setDisplay(redirectToCadastro, 'block');
    setDisplay(divLogin, 'flex');
    resetValues(document.querySelectorAll('.inputs'), 'value');
    resetValue(document.getElementById('err-cad'), 'inner');
    forms.style.height = '80vh';
});

//SUBMIT LOGIN
const form = document.getElementById('form-login');
form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const user = document.getElementById('usr').value;
    const password = document.getElementById('pwd').value;
    const check = document.getElementById('check');

    if (user && password ){
        await axios.post('/login', {
            user: user,
            password: password
        })
        .then((res) => {
            if (res.data.logged == true) {
                sessionStorage.setItem('user', user);
                sessionStorage.setItem('name', res.data.name);
                sessionStorage.setItem('talks', JSON.stringify({talks: []}));
                sessionStorage.setItem('loggedAt', new Date().toLocaleString());
                window.location = '/chat';
            } else {
                check.innerHTML = res.data.message;
            }
        })
        .catch((err) => {
            alert(err);
        });
    } else {
        check.innerHTML = 'Insira todos os campos';
    }
});

//SUBMIT REGISTER
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

const checks = {
    email: false,
    user: false,
    name: false,
    password: false
}

const user = document.getElementById('cad-usr');
const userCheck = document.getElementById('cad-user-check');
user.addEventListener('keyup', (e) => {
    const value = user.value;
    console.log(value);
    const len = value.split('');
    console.log(len);

    if (len.length < 6) {
        userCheck.innerHTML = 'Tamanho mínimo de 6 caracteres';
        userCheck.style.margin = '0 0 10px 0';
        user.style.margin = '5px 0 5px 0';
    } else { 
        resetValue(userCheck, 'inner');
        userCheck.style.margin = '0';
        user.style.margin = '5px 0 10px 0';
    };
});

function redzable (element) {
    element.style.cssText = "color: #c52323; border-bottom: 1px solid #c52323;";
};

const passwd = document.getElementById('cad-pwd').value;
const name = document.getElementById('cad-name').value;

const cadastro = document.getElementById('form-cadastro');
cadastro.addEventListener('submit', async function (e) {
    e.preventDefault();
    const user = document.getElementById('cad-usr').value;
    const passwd = document.getElementById('cad-pwd').value;
    const name = document.getElementById('cad-name').value;

    if (name && user && passwd ) {
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
                console.log(`Error code 400: ${res.data.message}`);
                errCadastro.innerHTML = 'Usuário já existente';
            }
        })
        .catch((err) => {
            alert(err);
        });   
    } else {
        errCadastro.innerHTML = 'Inserir todos os campos';
        user && checks.user ? null : redzable(document.getElementById('cad-usr'));
        passwd && checks.password  ? null : redzable(document.getElementById('cad-pwd'));
        name && checks.name ? null : redzable(document.getElementById('cad-name'));
    }
});