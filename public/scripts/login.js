const form = document.getElementById('form-login');
form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const user = document.getElementById('usr').value;
    const password = document.getElementById('pwd').value;
    const check = document.getElementById('check');
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
                check.innerHTML = 'Usuário ou senha inválidos.'
            }
        })
        .catch((err) => {
            return err
        });
});

const cadastro = document.getElementById('form-cadastro');
cadastro.addEventListener('submit', async function (e) {
    e.preventDefault();
    const user = document.getElementById('cad-usr').value;
    const passwd = document.getElementById('cad-pwd').value;
    const name = document.getElementById('cad-name').value;

    await axios.post('/cadastro', {
        user: user,
        passwd: passwd,
        name: name,
        ativo: 1
    })
    .then((res) => {
        console.log(res.data);
        console.log(`Usuário ${user} criado`);
    })
    .catch((err) => {
        console.log(err);
    })
});