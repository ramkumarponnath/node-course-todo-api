const {mongoose} = require('./db/db');
const {Todo} = require('./models/Todo');
const {User} = require('./models/User');
const {ObjectID} = require('mongodb')
let express = require('express');
let bodyParser = require('body-parser');

let app = express();
app.use(bodyParser.json());

const PORT = process.env.port || 3000;

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

app.post('/users', (req,res) => {
    let user = new User({
        text: req.body.text
    });
    user.save().then(result => {
        res.send(result);
    }, (error) => {
        res.status(400).send(error);
    })
});

app.get('/users', (req,res) => {
    User.find().then(users => {
        res.send({users});
    }).catch(e => res.status(400).send(e));
});

app.listen(PORT, () => {
    console.log('Server started and listening on port '+PORT);
});

module.exports = {app};