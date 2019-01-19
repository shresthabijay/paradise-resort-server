const express=require("express")
const bodyparser=require("body-parser")
const cors=require("cors")
const path=require("path")
const mainRouteHandler=require("./routes/mainRouteHandler")
const path = require('path');

const app=express()
app.use(express.static(path.join(__dirname, 'build')));

app.use(express.static(path.join(__dirname, 'build')));

app.use(cors())

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

app.use(mainRouteHandler)

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));

});







module.exports=app





