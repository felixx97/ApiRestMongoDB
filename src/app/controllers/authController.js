//criando controlhe

const express = require('express');  //buscando o Express

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const crypto = require('crypto');

const mailer = require('../../modules/mailer')

const authConfig = require('../../config/auth.json')

const User = require('../models/User') //puxar o modo de User



const router = express.Router(); //buscando do express uma função que retorne a classe 'Router

function generateToken (params = {}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}


router.post('/register', async (req, res) => {  //criando uma rota de cadastro (register) | async para tratar promises
    
    const { email } = req.body; //email devera ser unico

    try{ //crie um novo usuário quando chamar essa rota

        if(await User.findOne({ email })) //verificar/procurar usuario por email 
        return res.status(400).send({error: 'user already exists | usuario existente'})

        const user = await User.create(req.body); //pegar todos parametros que o usuário esta enviando e repassar para User.create | todos os parametros estarao dentro de 'req.body

        user.password = undefined;
        
        return res.send({ 
            user,
            token: generateToken({ id: user.id }), 
        });
    } catch (err)     {  //quando retornar um erro, precisamos ficar sabendo 
        console.log(err);
        return res.status(400).send({ error: 'Registration failed okrurr'});
    }
});

router.post('/authenticate', async (req, res) => { //definindo a rota, sera um post de autenticação
    const { email , password } = req.body;  //recebendo email e senha do boby da requisição

    const user = await User.findOne({ email }).select('+password'); //buscando usuário com o email informando para ver se existe outro

    if (!user) {
    return res.status(400).send({error: 'user not found yas'});
    }

    if(!await bcrypt.compare(password, user.password)) { 
        return res.status(400).send({ error: 'invalid password' });
    }

    user.password = undefined;

    //sign = entrar login. passe a informação que vai diferenciar um token do outro
    

    res.send({ 
        user,
        token: generateToken({ id: user.id }),
        });
})

router.post('/forgot_password', async (req, res) => {
    const { email } = req.body;
    
    try{
        const user = await User.findOne({ email });

        if (!user){
            return res.status(400).send({error: 'User not found '});
        }

        const token = crypto.randomBytes(20).toString('hex'); //GERANDO TOKEN ALEATORIO

        const now = new Date(); //data atual
        now.setHours(now.getHours() + 1); //tempo de expiração password

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordresetExpires: now,
            }
        });

        mailer.sendEmail({
            to: email,
            from: 'abrahammfelixx@gmail.com',
            template: 'auth/forgot_password',
            context: {token},
        })

    } catch (err){
        res.status(400).send({ error: 'Erro on forgot password, try again '});
    }
})

module.exports = app => app.use('/auth', router); //recuperando o app, recebendo o parametro app, retornando o app.use e definindo uma rota | repassando router para o app com prefixo '/auth
