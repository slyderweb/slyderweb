const express = require('express')
const app = express()

app.set('port', (process.env.PORT || 8080));
app.use(express.static('public'))

 /*app.get('/', function (req, res) {
  res.send('Hello World!')
}); */

app.listen(app.get("port"), function () {
  console.log('Example app listening on port 8080!')
});

