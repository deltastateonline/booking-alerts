const express =  require('express');
const http = require('http');

const Socket10 = require('socket.io');
var bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);

var io = new Socket10(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', function(req, res){
 res.sendFile(__dirname + '/index.html');
});

app.get('/alerts', function(req, res){
 res.sendFile(__dirname + '/alerts.html');
});

app.post('/alert', function(req, res){	
	var alertObject  = req.body;	// already an object
	var d = new Date();	
	alertObject.recieved = d.toString();		
	io.emit('new-alert', JSON.stringify(alertObject));	
	res.end(JSON.stringify( {"message":"Recieved", "when":d.toString()}) );
})

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

var port = process.env.PORT || 3000;
server.listen(port, function(){  
  console.log('Server running at http://127.0.0.1:' + port + '/');
});