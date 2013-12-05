var express = require('express'),
    app = express.createServer(express.logger()),
    io = require('socket.io').listen(app),
    routes = require('./routes');

// Configuration

app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

// Heroku won't actually allow us to use WebSockets
// so we have to setup polling instead.
// https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
io.configure(function () {
    io.set("transports", ["xhr-polling"]);
    io.set("polling duration", 10);
});

// Routes

var port = 5000; // Use the port that Heroku provides or default to 5000
app.listen(port, function () {
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

app.get('/', routes.index);

var status = "All is well.";

/*io.sockets.on('connection', function (socket) {
io.sockets.emit('status', { status: status }); // note the use of io.sockets to emit but socket.on to listen
    socket.on('reset', function (data) {
        status = "War is imminent!";
        io.sockets.emit('status', { status: status });
    });
});*/

io.sockets.on('connection', function (socket) {
    io.sockets.emil("in", { sender: "New user" });

    console.log("*******New User *******");
    var address = socket.handshake.address;

    io.sockets.emit('user', { user: address.address });

    socket.on('out', function (data) {
        console.log("********New Private Message***************");
        io.sockets.emit('in', { sender: data.sender, msg: data.msg });
    });

    socket.on('attachment', function (data) {
        //Received an image: broadcast to all
        io.sockets.emit('in', { sender: data.sender, blob: data.blob });
    });

    socket.on("start typing", function (sessionId) {
        //alert('got start typing');
        io.sockets.emit('start typing', sessionId);
    });

    socket.on("stop typing", function (sessionId) {
        //alert('got stop typing');
        io.sockets.emit('stop typing', sessionId);
    });

    socket.on('disconnect', function () {
        io.sockets.emit('user disconnected');
    });

});


