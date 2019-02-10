const {mongoose} = require('./db/db');
const {Todo} = require('./models/Todo');
const User = require('./models/User');
let express = require('express');
let bodyParser = require('body-parser');

let app = express();
app.use(bodyParser.json());

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

app.listen(3000, () => {
    console.log('Server started and listening on port 3000')
});