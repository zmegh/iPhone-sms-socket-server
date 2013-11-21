var socket = io.connect(window.location.hostname);

/*socket.on('connection', function (data) {
    socket.emit('my other event', { my: 'data' });
});*/

socket.on('user', function (data) {
    $('#users').append("<tr><td>" + data.user + "</td></tr>");
});

socket.on('in', function (data) {
    $('#chatbox').append("<span style='background-color:gray'>Partner: " + data.msg + "</span><br/>");
});

//User Events
$('#send').click(function () {

    socket.emit('out', { msg: $("#msg").val() });

    $('#chatbox').append("<span style='background-color:green'>Me: " + $("#msg").val() + "</span><br/>");

    $("#msg").val();
});

/*$(document).ready(function () {
    var name = prompt("What is your name");
    $("name").val(name);
});*/