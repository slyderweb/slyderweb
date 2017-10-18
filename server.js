// an barebones server

const express = require('express' );
const app = express();

app.set('port', (process.env.PORT || 8080));

app.listen(app.get('port'), function () {
  console.log('Node express app started at port ' + app.get('port'));
});
