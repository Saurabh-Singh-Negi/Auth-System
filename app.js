const express = require("express");
const app = express();

const port = 3000;

app.get('/', (req, res) => {
    res.send("<h1>Welcome back</h1>")
})


app.listen(port, () => {
    console.log("listening at 3000");
})