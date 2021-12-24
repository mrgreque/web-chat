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

//CHECKS
function checkBase () {
    return {
        status: false,
        pressed: false
    }
}

const checks = {
    email: checkBase(),
    user: checkBase(),
    name: checkBase(),
    password: checkBase()
}
const user = document.getElementById('cad-usr');
const userCheck = document.getElementById('cad-user-check');
const email = document.getElementById('cad-email');
const emailCheck = document.getElementById('cad-email-check');
const passwd = document.getElementById('cad-pwd');
const passwdCheck = document.getElementById('cad-pwd-check');
const inputName = document.getElementById('cad-name');
const nameCheck = document.getElementById('cad-name-check');
const cadastro = document.getElementById('form-cadastro');
const btnCadastro = document.getElementById('cad');

// terminar os checks para os demais campos
// enquanto digitar, qndo estver onkeyup, colocar cor azul para reverter redzable
// finalizar check

//USER CHECK
function fctCheckUser (us) {
    const value = us;
    const len = value.split('');

    if (len.length < 6) {
        userCheck.innerHTML = 'Tamanho mínimo de 6 caracteres';
        userCheck.style.margin = '0 0 10px 0';
        user.style.margin = '5px 0 5px 0';
        checks.user.status = false;
    } else { 
        resetValue(userCheck, 'inner');
        userCheck.style.margin = '0';
        user.style.cssText = 'margin:5px 0 10px 0;color: #333356;border-bottom: 1px solid #333356;';
        checks.user.status = true;
    };
};
user.addEventListener('keyup', () => {
    checks.user.pressed = true;
    fctCheckUser(user.value);
});

//EMAIL CHECK
function fctCheckEmail(em) {
    const value = em;
    const regex = /\S+@\S+\.\S+/;
    
    if (!regex.test(value)) {
        emailCheck.innerHTML = 'Insira em um formato válido';
        emailCheck.style.margin = '0 0 10px 0';
        email.style.margin = '5px 0 2px 0';
        checks.email.status = false;
    } else { 
        resetValue(emailCheck, 'inner');
        emailCheck.style.margin = '0';
        email.style.cssText = 'margin:5px 0 10px 0;color: #333356;border-bottom: 1px solid #333356;';
        checks.email.status = true;
    };
};
email.addEventListener('keyup', () => {
    checks.email.pressed = true;
    fctCheckEmail(email.value);
});

//PASSWORD CHECK
function fctCheckPassword(pass) {
    const value = pass;
    const len = value.split('');

    let letrasMaiusculas = /[A-Z]/;
    let letrasMinusculas = /[a-z]/; 
    let numeros = /[0-9]/;
    let caracteresEspeciais = /[!|@|#|$|%|^|&|*|(|)|-|_]/;

    let tamanho = 'Insira no mínimo 8 caracteres';
    let caracter = 'Insira no mínimo 1 caracter especial';
    let maiuscula = 'Insira no mínimo 1 letra maiúscula';
    let minuscula = 'Insira no mínimo 1 letra minúscula';
    let numero = 'Insira no mínimo 1 número';
    let msgs = [];
    
    len.length < 8 ? msgs.includes(tamanho) ? null : msgs.push(tamanho) : null;
    !letrasMaiusculas.test(value) ? msgs.includes(maiuscula) ? null : msgs.push(maiuscula) : null;
    !letrasMinusculas.test(value) ? msgs.includes(minuscula) ? null : msgs.push(minuscula) : null;
    !caracteresEspeciais.test(value) ? msgs.includes(caracter) ? null : msgs.push(caracter) : null;
    !caracteresEspeciais.test(value) ? msgs.includes(caracter) ? null : msgs.push(caracter) : null;
    !numeros.test(value) ? msgs.includes(numero) ? null : msgs.push(numero) : null;


    if (msgs.length > 0) {
        passwdCheck.innerHTML = '';
        countMargin = 30;
        msgs.forEach(msg => {
            passwdCheck.innerHTML += `${msg}<br>`;
            countMargin -= 6;
        })
        passwdCheck.style.margin = '0 0 10px 0';
        passwd.style.margin = '5px 0 2px 0';
        btnCadastro.style.margin = `${countMargin}px 0 0 0`;
        checks.password.status = false;
    } else { 
        resetValue(passwdCheck, 'inner');
        passwdCheck.style.margin = '0';
        passwd.style.cssText = 'margin:5px 0 10px 0;color: #333356;border-bottom: 1px solid #333356;';
        btnCadastro.style.margin = '30px 0 0 0';
        checks.password.status = true;
    };
};
passwd.addEventListener('keyup', () => {
    checks.password.pressed = true;
    fctCheckPassword(passwd.value);
});

//NAME CHECK
function fctCheckName (nm) {
    const value = nm;
    const regex = /\S+ \S+/;
    
    if (!regex.test(value)) {
        nameCheck.innerHTML = 'Insira nome e sobrenome';
        nameCheck.style.margin = '0 0 10px 0';
        inputName.style.margin = '5px 0 2px 0';
        checks.name.status = false;
    } else { 
        resetValue(nameCheck, 'inner');
        nameCheck.style.margin = '0';
        inputName.style.cssText = 'margin:5px 0 10px 0;color: #333356;border-bottom: 1px solid #333356;';
        checks.name.status = true;
    };
};
inputName.addEventListener('keyup', () => {
    checks.name.pressed = true;
    fctCheckName(inputName.value);
});

function checkAll() {
    if (!checks.user.pressed || !checks.email.pressed || !checks.name.pressed || !checks.password.pressed) {
        fctCheckEmail(email.value);
        fctCheckName(inputName.value);
        fctCheckUser(user.value);
        fctCheckPassword(passwd.value);
    };
};

function redzable (element) {
    element.style.cssText = "color: #c52323; border-bottom: 1px solid #c52323;";
};

function inputReadzable() {
    email.value && checks.email.status ? null : redzable(document.getElementById('cad-email'));
    user.value && checks.user.status ? null : redzable(document.getElementById('cad-usr'));
    passwd.value && checks.password.status  ? null : redzable(document.getElementById('cad-pwd'));
    inputName.value && checks.name.status ? null : redzable(document.getElementById('cad-name'));
}

cadastro.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (inputName.value && user.value && passwd.value) {
        await axios.post('/cadastro', {
            user: user.value,
            passwd: passwd.value,
            name: inputName.value,
            ativo: 1
        })
        .then((res) => {
            if (res.data.success == true) {
                createCadastrado(user.value);
            } else {
                console.log(`Error code 400: ${res.data.message}`);
                alert('Usuário já existente');
                checkAll();
                inputReadzable();
                userCheck.innerHTML = 'Usuário já existente';
            }
        })
        .catch((err) => {
            alert(err);
        });   
    } else {
        checkAll();
        inputReadzable();
    }
});