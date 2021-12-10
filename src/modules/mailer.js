const nodeMailer = require('nodemailer');

const hbs = require('nodemailer-express-handlebars');

const { host, post, user, pass } = require('../config/mail.json');

const transport = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass  },
  });


  transport.use('compile', hbs({
      viewEngine: 'handlebars',
      viewPath: ''
  }))


module.exports = transport;