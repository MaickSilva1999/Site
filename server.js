const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path'); // Importar o módulo path

const app = express();
const port = 3000;

// Configurações do banco de dados
const db = mysql.createConnection(require('./config'));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Servir arquivos estáticos

// Rota para a página inicial (servir o HTML)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Conectar ao banco de dados
db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados: ' + err.stack);
        return;
    }
    console.log('Conectado ao banco de dados como id ' + db.threadId);
});

// Rota para cadastro
app.post('/api/register', (req, res) => {
    const { nome, email, senha } = req.body;
    const hashedPassword = bcrypt.hashSync(senha, 10);
    
    db.query('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, hashedPassword], (error) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    });
});

// Rota para login
app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;

    db.query('SELECT * FROM usuarios WHERE email = ?', [email], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (results.length === 0) {
            return res.status(401).json({ message: 'Email ou senha incorretos' });
        }

        const user = results[0];
        if (bcrypt.compareSync(senha, user.senha)) {
            res.json({ message: 'Login bem-sucedido!', userId: user.id });
        } else {
            res.status(401).json({ message: 'Email ou senha incorretos' });
        }
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
