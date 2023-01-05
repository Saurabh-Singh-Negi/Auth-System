const app = require("./app.js")
const {PORT} = process.env

app.listen(PORT, () => {
    console.log("listening at 3000");
})