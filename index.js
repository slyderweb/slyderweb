const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('./queries');
const app = express();

app.set('port', (process.env.PORT || 8080));
app.use(express.static('public'));
app.use(bodyParser.json());

app.listen(app.get('port'), function() {
	
    console.log('Server started on port: ', app.get('port'));
});

function serverUpkeep() {
	let uptime = process.uptime();
	process.stdout.write('\rServer uptime: ' + formatTime(uptime));
}

function formatTime(seconds) {
    seconds = Number(seconds);
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor(seconds % 3600 / 60);
    var seconds = Math.floor(seconds % 3600 % 60);

    function t(i) {
        return (i < 10) ? "0" + i : i;
    }

    return (`${t(hours)}:${t(minutes)}:${t(seconds)}`); 
}

setInterval(serverUpkeep, 1000);

module.exports = router;