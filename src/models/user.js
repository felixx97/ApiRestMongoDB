//model de usuário


const mongoose = require('../database');
const bcrypt = require('bcryptjs'); //importando biblioteca


const UserSchema = new mongoose.Schema({
    name: {
        type: String, //tipo string
        required: true, //obrigatorio
    },
    email: {
        type: String,
        unique: true, //unico
        required: true, //obrigatoria
        lowercase: true, //que seja convertido em caixa baixa
    },
    password: {
        type: String,
        required: true,
        select: false, //para quando buscar um usuario ou varios (usuarios) a informação da senha não venha com o array
    },
    createdAt: { //anota a data que o registro foi criado
        type: Date, 
        default: Date.now,
    },  
},{ collection: 'users' });


//incriptação do usuário

UserSchema.pre('save', async function (next){ //'.pre é uma função do mongoose, para dizer que aconteça alguma coisa antes de salvar
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next()
}); 


const User =  mongoose.model('User', UserSchema);

module.exports = User;