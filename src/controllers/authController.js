//criando controlhe


const express = require('express');  //buscando o Express

const User = require('../models/User') //puxar o modo de User

const router = express.Router(); //buscando do express uma função que retorne a classe 'Router

router.post('/register', async (req, res) => {  //criando uma rota de cadastro (register) | async para tratar promises
    
    const { email } = req.body; //email devera ser unico

    try{ //crie um novo usuário quando chamar essa rota

        if(await User.findOne({ email })) //verificar/procurar usuario por email 
        return res.status(400).send({error: 'user already exists | usuario existente'})

        const user = await User.create(req.body) //pegar todos parametros que o usuário esta enviando e repassar para User.create | todos os parametros estaram dentro de 'req.body

        user.password = undefined;
        
        return res.send({ user });
    } catch (err)     {  //quando retornar um erro, precisamos ficar sabendo 
        console.log(err);
        return res.status(400).send({ error: 'Registration failed okrurr'})
    }
});


module.exports = app => app.use('/auth', router); //recuperando o app, recebendo o parametro app, retornando o app.use e definindo uma rota | repassando router para o app com prefixo '/auth
