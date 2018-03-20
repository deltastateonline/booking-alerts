var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser')


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
	var message  = req.body;
	
	var d = new Date()
	var output_string = message.alert + " - "+ d.toString();
	//console.log(output_string);
	
	
	io.emit('chat message', output_string);
	
	res.end(JSON.stringify( {"message":"Recieved", "when":d.toString()}) );
})

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  /*
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
	io.emit('chat message', msg);	
  });*/
});


var port = process.env.PORT || 3000;
http.listen(port, function(){  
  console.log('Server running at http://127.0.0.1:' + port + '/');
});