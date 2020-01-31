const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

var https = require('https');
var server = https.Server(app);

// app.use(express.static(path.join(__dirname,"assets")));
// app.use(express.static(path.join(__dirname,"css")));
// app.use(express.static(path.join(__dirname,"imgs")));
// app.use(express.static(path.join(__dirname,"js")));
app.use('/',express.static(__dirname+'/public'));


app.get('/',function(req,res){
    res.sendFile(__dirname+'/public/index.html');
})

app.listen(PORT,()=>console.log(`Weather APP is listening on port ${PORT}!`));