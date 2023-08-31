const mogoose = require('mongoose')

module.exports = () => {
    mogoose.connect("mongodb+srv://briannn97:LLqe47DfqwWCfLGq@cluster0.g23xu3h.mongodb.net/")
        .then(() => console.log('DB Connection Successful'))
        .catch(err => console.log(err.message))
}
