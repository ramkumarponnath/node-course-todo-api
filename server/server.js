require('./config/config');
let {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
var {User} = require('./models/user');
const {ObjectID} = require('mongodb')
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
var {authenticate} = require('./middleware/authenticate');

let app = express();
app.use(bodyParser.json());

const PORT = process.env.port;

app.post('/todos', (req,res) => {
    let todo = new Todo({
        text: req.body.text
    });
    todo.save().then(result => {
        res.send(result);
    }, (error) => {
        res.status(400).send(error);
    })
});

app.get('/todos', (req,res) => {
    Todo.find().then(todos => {
        res.send({todos});
    }).catch(e => res.status(400).send(e));
});

app.get('/todos/:id', (req,res) => {
    const id = req.params.id;
    if(!ObjectID.isValid(id)){
        res.status(400).send('Invalid ID');
        return;
    }
    Todo.findById(id)
        .then((todo) => {
            if(!todo){
                res.status(404).send('Todo not found');
                return;
            }
            res.send({todo});
        }).catch(e => res.status(400).send(e));
});

app.delete('/todos/:id', (req,res) => {
    const id = req.params.id;
    if(!ObjectID.isValid(id)){
        res.status(400).send('Invalid ID');
        return;
    }
    Todo.findByIdAndDelete(req.params.id).then((todo) => {
        if(!todo){
            res.status(404).send('Todo not found');
            return;
        }
        res.send({todo})
    }).catch(e => res.status(400).send(e));
});

app.patch('/todos/:id', (req,res) => {
    let id = req.params.id;
    let body = _.pick(req.body,['text','completed']);
    if(!ObjectID.isValid(id)){
        res.status(400).send('Invalid ID');
        return;
    }
    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id,{$set:body}, {new:true}).then((todo) => {
        if(!todo) {
            return res.status(404).send();
        }
        return res.send({todo});
    }).catch((err) => {
        res.status(400).send(err);
    });
});

app.post('/users', (req,res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User(body);
    user.save().then(() => {
        return user.generateAuthToken();
    }) 
    .then(token => {
        res.header('x-auth',token).send(user);
    })
    .catch((error) => {
        res.status(400).send(error);
    })
});

app.get('/users/me', authenticate, (req,res) => {
    res.send(req.user);
});

app.post('/users/login', (req,res) => {
    let body = _.pick(req.body,['email', 'password']);
    User.findByCredentials(body.email,body.password).then(user => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        })
    }).catch(e => res.status(400).send(e));
});

app.listen(PORT, () => {
    console.log('Server started and listening on port '+PORT);
});

module.exports = {app};