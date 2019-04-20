let mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser : true, 
    useCreateIndex: true,
    keepAlive: 120
});

module.exports = {
    mongoose
};
