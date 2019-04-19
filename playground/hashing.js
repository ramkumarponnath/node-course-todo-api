//const {SHA256} = require('crypto-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const passowrd = '123ac!';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(passowrd, salt, (err, hash) => {
        console.log(hash);
    })
});

let hashedPassword = '$2a$10$oGCZDyRieZ7cDCZTxxoWS.gt4HXNC9caR3XuldEp2z128gU.4UBzW';
bcrypt.compare(passowrd, hashedPassword, (err, res) => {
    console.log(res);
});

// let data = {
//     id: 10
// };

// let token = jwt.sign(data, '123abc');

// console.log('Hash value', token);

// let decoded = jwt.verify(token, '123abc');
// console.log('Decoded ', decoded);

// const message = 'I am message 3';
// const hash = SHA256(message);

// console.log(`Message ${message}`);
// console.log(`Hash ${hash}`);

// let data = {
//     id: 4
// };

// let token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.data)).toString();

// let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if(resultHash === token.hash) {
//     console.log('Data was not changed'); 
// } else {
//     console.log('Data was changed. Donot trust');
// }
