document.getElementById('switch-to-register').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('.login-container').style.display = 'none';
    document.querySelector('.register-container').style.display = 'block';
});

document.getElementById('switch-to-login').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('.register-container').style.display = 'none';
    document.querySelector('.login-container').style.display = 'block';
});



// Adicione aqui a lógica de manipulação de dados, como salvar usuários, etc.

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    const senha = this.querySelector('input[type="password"]').value;

    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login falhou');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        localStorage.setItem('userId', data.userId); // Salvar o ID do usuário
        window.location.href = 'home.html'; // Redireciona para a tela home
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Email ou senha incorretos');
    });
});



document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const nome = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const senha = this.querySelector('input[type="password"]').value;

    fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email, senha }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});
