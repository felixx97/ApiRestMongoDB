//conexão com mogoDB

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://abrahammfelixx:7BRRf90vckDcTxrk@cluster0.2ztog.mongodb.net/api_rest?retryWrites=true&w=majority')
  .then(() => console.log('conectado ao mongodb'))
  .catch(err => console.log(err)); 
mongoose.Promise = global.Promise;


module.exports = mongoose;