const form = document.getElementById('form-login');
form.addEventListener('submit', async function (e) {
    console.log('entrei aqui');
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
                window.localStorage.setItem('user', user);
                window.localStorage.setItem('loggedAt', new Date().toLocaleString());
                window.location = '/chat';
            } else {
                check.innerHTML = 'Usuário ou senha inválidos.'
            }
        })
        .catch((err) => {
            return err
        });
});
