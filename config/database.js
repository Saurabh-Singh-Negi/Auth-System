const mongoose = require("mongoose");
const {URL} = process.env;

exports.connect = () => {
    mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(console.log("connected successfully"))
    .catch((error) => {
        console.log("failed to connect");
        console.log(error);
        process.exit(1);
    })
    
}