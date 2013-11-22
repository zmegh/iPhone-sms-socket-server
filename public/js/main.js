var socket = io.connect(window.location.hostname);
var sessionID = Guid();

/*socket.on('connection', function (data) {
    socket.emit('my other event', { my: 'data' });
});*/

socket.on('user', function (data) {
    $('#users').append("<tr><td class='style5'>" + data.user + "</td></tr>");
});

socket.on('in', function (data) {
  
    if (data.sender == sessionID) return;
    
    $('#chatbox').append("<span style='background-color:gray'>" + data.sender  + ": " + data.msg + "</span><br/>");
});

//User Events
$('#send').click(function () {
    SendMsg();
});

$("#msg").keypress(function (e) {
    if (e.which == 13) {
        SendMsg();
    }
});

function SendMsg() {
    socket.emit('out', { sender: sessionID, msg: $("#msg").val() });

    $('#chatbox').append("<span style='background-color:green'>Me: " + $("#msg").val() + "</span><br/>");

    $("#msg").val('');
}

//Helpers

function Guid() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
};