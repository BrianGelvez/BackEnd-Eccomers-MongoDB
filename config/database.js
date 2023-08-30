const mogoose = require('mongoose')

module.exports = () => {
    mogoose.connect("mongodb://127.0.0.1:27017/SamuApp")
        .then(() => console.log('DB Connection Successful'))
        .catch(err => console.log(err.message))
}
