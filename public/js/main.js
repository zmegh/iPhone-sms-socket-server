var socket = io.connect(window.location.hostname);

/*socket.on('connection', function (data) {
    socket.emit('my other event', { my: 'data' });
});*/

socket.on('user', function (data) {
    $('#users').append("<tr><td>" + data.user + "</td></tr>");
});

socket.on('private message', function (data) {
    $('#chatbox').append("<span>new message</span><br/>");
});

//User Events
$('#send').click(function () {
   
    socket.emit('private message', { from: 'Me', msg: this.val() });

    $('#chatbox').append("<span>Me: " + this.val() + "</span><br/>");
    alert('apres chatbox');
    this.val('');
});

/*$(document).ready(function () {
    var name = prompt("What is your name");
    $("name").val(name);
});*/