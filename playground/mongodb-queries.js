const {mongoose} = require('./../server/db/db');
const {User} = require('./../server/models/user');

const id = '5c5fdc54a33ed705a89a35d711';

/*User.find({
    _id: id
}).then(users => {
    if(!users){
        console.log('Invalid user id');
        return;
    }
    console.log(`Users ${users}`);
});

User.findOne({
    _id : id
}).then(user => {
    if(!user){
        console.log('Invalid user id');
        return;
    }
    console.log(`User ${user}`);
});*/

User.findById(id).then(user => {
    if(!user){
        console.log('Invalid user id');
        return;
    }
    console.log(`User By Id ${user}`);
}).catch(e => console.log(`Error ${e}`));