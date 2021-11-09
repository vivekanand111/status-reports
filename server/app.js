const mysql = require('mysql');
var express = require('express');
var cors = require('cors')
var app = express()
var fs = require('fs')
var https = require('https')

app.use(express.json())

app.use(cors())



var router = require('./routes/routes.js')
app.use('/', router)

// app.listen(8080, () => {
//     console.log("Server is running on port:8080")
// })





/* var httpsServer = https.createServer({
    key: fs.readFileSync("./certs/privkey1.pem"),
    cert: fs.readFileSync("./certs/fullchain1.pem")
}, app);
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
httpsServer.listen(3000, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('HTTPS Server listening');
  }
}); */

app.listen(8080, function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log('HTTP Server listening');
  }
})
