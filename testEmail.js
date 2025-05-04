const nodemailer = require('nodemailer');

const testEmail = async () => {
  try {
    console.log('Creating transporter...');
    // Create reusable transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'iamdevindersharma15122005@gmail.com',
        pass: 'mwxu gaek bqcd axme'
      },
      debug: true,
      logger: true
    });

    // Test connection
    console.log('Testing SMTP connection...');
    await new Promise((resolve, reject) => {
      transporter.verify(function (error, success) {
        if (error) {
          console.log('SMTP Error:', error);
          reject(error);
        } else {
          console.log('Server is ready to take messages');
          resolve(success);
        }
      });
    });

    // Send mail
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: 'iamdevindersharma15122005@gmail.com',
      to: 'iamdevindersharma15122005@gmail.com',
      subject: 'Test Email from Direct Node Script',
      text: 'This is a test email sent directly from Node.js',
      html: '<p>This is a test email sent directly from Node.js</p>'
    });

    console.log('Message sent: %s', info.messageId);
    
    // Try sending a second email to validate consistency
    console.log('Sending second test email...');
    const info2 = await transporter.sendMail({
      from: 'iamdevindersharma15122005@gmail.com',
      to: 'iamdevindersharma15122005@gmail.com',
      subject: 'SECOND Test Email from Direct Node Script',
      text: 'This is a SECOND test email sent directly from Node.js',
      html: '<p>This is a SECOND test email sent directly from Node.js</p>'
    });
    
    console.log('Second message sent: %s', info2.messageId);
  } catch (error) {
    console.error('Error sending test email:', error);
  }
};

// Run the test
console.log('Starting email test...');
testEmail()
  .then(() => console.log('Email test completed.'))
  .catch(err => console.error('Email test failed:', err)); 