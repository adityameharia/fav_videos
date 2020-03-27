if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: 'mongodb+srv://aditya:aditya@cluster0-whofq.mongodb.net/test?retryWrites=true&w=majority'
    }
} else {
    module.exports = {
        mongoURI: 'mongodb://127.0.0.1/vidjot-dev'
    }
}
