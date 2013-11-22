var socket = io.connect(window.location.hostname);
var sessionID = Guid();

//Socket.io
//**************************************************************************************************************
socket.on('in', function (data) {

    if (data.sender == sessionID) return;

    receiveText(data.msg);

});


function Guid() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
};
//*****************************************************************************************************************
$("#imessage").keypress(function (e) {
    if (e.which == 13) {
        sendSMS();
    }
});

function sendSMS() {
    var text = $('#imessage').val();
    if (text != '') {
        sendText(text);
    }
}

function scrollDown(div) {
    div.animate({ scrollTop: 10000 }, "slow");
}

function sendText(text) {
  
    socket.emit('out', { sender: sessionID, msg: text });

    var conversation = $('#conversation');
    var button = $('#send_btn');

    var newTime = $('<div class="time"><p>' + getDate() + '</p></div>');
    newTime.hide();
    conversation.append(newTime);

    var newText = $('<div class="text sent"><div class="reflect"></div><p>' + text + '</p></div>');
    newText.hide();
    conversation.append(newText);

    newText.show('normal');
    newTime.show('fast');
    scrollDown(conversation);
    button.attr("disabled", "disabled");
    $('#imessage').val('');
}

function receiveText(smsText) {
  
    var button = $("#send_btn");
    var conversation = $("#conversation");
    
    var newTime = $('<div class="time"><p>' + getDate() + '</p></div>');
    //newTime.hide();
    conversation.append(newTime);
    
    var newText = $('<div class="text receive"><div class="reflect"></div><p>' + smsText + '</p></div>');
    //newText.hide();
    conversation.append(newText);

    newText.show('normal');
    newTime.show('fast');
    scrollDown(conversation);
    var sender = $('#phone').val();
}

function getDate() {
    var a_p = "";
    var d = new Date();
    var curr_hour = d.getHours();
    if (curr_hour < 12) {
        a_p = "AM";
    }
    else {
        a_p = "PM";
    }
    if (curr_hour == 0) {
        curr_hour = 12;
    }
    if (curr_hour > 12) {
        curr_hour = curr_hour - 12;
    }

    var curr_min = d.getMinutes();

    curr_min = curr_min + "";

    if (curr_min.length == 1) {
        curr_min = "0" + curr_min;
    }

    var m_names = new Array("Jan", "Feb", "Mar",
   "Apr", "May", "Jun", "Jul", "Aug", "Sep",
   "Oct", "Nov", "Dec");

    var curr_date = d.getDate();
    var curr_month = d.getMonth();
    var curr_year = d.getFullYear();

    return m_names[curr_month] + " " + curr_date + ", " + curr_year + ' ' + curr_hour + ":" + curr_min + " " + a_p;
}