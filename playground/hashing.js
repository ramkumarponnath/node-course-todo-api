//const {SHA256} = require('crypto-js');

const jwt = require('jsonwebtoken');

let data = {
    id: 10
};

let token = jwt.sign(data, '123abc');

console.log('Hash value', token);

let decoded = jwt.verify(token, '123abc');
console.log('Decoded ', decoded);

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
