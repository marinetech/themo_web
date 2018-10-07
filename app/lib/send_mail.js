var nodemailer = require('nodemailer');

function send_mail(_from, _to, _subject, _text) {
  let transporter = nodemailer.createTransport({
      host: 'mr1.haifa.ac.il',
      port: 25,
      secure: false
  });

  var mailOptions = {
    from: _from,
    to: _to,
    subject: _subject,
    text: _text
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports.send_mail = send_mail
