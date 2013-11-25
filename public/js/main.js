var socket = io.connect(window.location.hostname);
var sessionID = Guid();

//Socket.io
//**************************************************************************************************************
socket.on('in', function (data) {

    if (data.sender == sessionID) return;

    receiveMessage(data);

});

socket.on("start typing", function (Id) {
    if (sessionID == Id) return;
    
    $("#isTyping").show();
});

    socket.on("stop typing", function (Id) {
         if (sessionID == Id) return;
        $("#isTyping").hide();
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
var timeoutReference;
$('#imessage').keypress(function (e) {
   
    var bDisabled = $('#imessage').val() == '' ? "disabled" : "";
  
    $("#send_btn").css("disabled", bDisabled);
    
    //************ Typing event ******************************
    
        var _this = $(this); // copy of this object for further usage

        if (timeoutReference) {
            clearTimeout(timeoutReference);
            
            socket.emit("start typing", sessionID);
        }
        timeoutReference = setTimeout(function () {
            socket.emit("stop typing", sessionID);
        }, 1500);
  //****************************************
    
    if (e.which == 13) {
        sendSMS();
    }
    
   
});

$("#imgAttach").click(function () {
    $("#fileInput").click();
});

function sendSMS() {
    var text = $('#imessage').val();
    if (text != '') {
        sendMessage({msg: text});
    }
}

function scrollDown(div) {
    div.animate({ scrollTop: 10000 }, "slow");
}

function sendMessage(data) {
  //Close image if open
    hideFullImagePreview();
    
    socket.emit('out', { sender: sessionID, msg: data.msg });

    var newText;
    var newImg;
    var conversation = $('#conversation');
    var button = $('#send_btn');

    var newTime = $('<div class="time"><p>' + getDate() + '</p></div>');
    newTime.hide();
    conversation.append(newTime);

    if (data.msg) {
        newText = $('<div class="text sent"><div class="reflect"></div><p>' + data.msg + '</p></div>');
        newText.hide();
        conversation.append(newText);
    }

    if (data.blob) {

        newImg = $('<div class="text sent"><div class="reflect"></div><img height="40px" width="40px" src="' + data.blob + '"/></div>');
        newImg.click(function () {
            ShowFullSize(data.blob);
        });
        //newImg.hide();
        conversation.append(newImg);
    }

    if(data) newTime.show('normal');
    if (data.msg)  newText.show('normal');
    if (data.blob) newImg.show('normal');
    
    //button.attr("disabled", "disabled");
    $('#imessage').val('');
    scrollDown(conversation);
}

function receiveMessage(data) {
    
    var conversation = $("#conversation");
    
    var newTime = $('<div class="time"><p>' + getDate() + '</p></div>');
    conversation.append(newTime);

    if (data.msg) {
        var newText = $('<div class="text receive"><div class="reflect"></div><p>' + data.msg + '</p></div>');
        newText.hide();
        conversation.append(newText);
    }

    if (data.blob) {

        var newImg = $('<div class="text receive"><div class="reflect"></div><img height="40px" width="40px" src="' + data.blob + '"/></div>');
        newImg.click(function() {
            ShowFullSize(data.blob);
        });
        conversation.append(newImg);
        newImg.show('normal');
    }

    if(data) newTime.show('normal');
    if (data.msg)  newText.show('normal');
    if (data.img) newImg.show('normal');
    
    scrollDown(conversation);
}

function hideFullImagePreview() {
    $("#image-overlay").hide();
    $("#conversation").show();
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

//Attachment
$('#fileInput').on('change', function (e) {
    //Get the first (and only one) file element
    //that is included in the original event
    var file = e.originalEvent.target.files[0],
        reader = new FileReader();
    //When the file has been read...
    reader.onload = function (evt) {
        //Because of how the file was read,
        //evt.target.result contains the image in base64 format
        //Nothing special, just creates an img element
        //and appends it to the DOM so my UI shows
        //that I posted an image.
        //send the image via Socket.io

        socket.emit('attachment', { sender: sessionID, blob: evt.target.result });
        sendMessage({blob: evt.target.result });
    };
    //And now, read the image and base64
    reader.readAsDataURL(file);
});

function ShowFullSize(blob) {

    var conversation = $("#conversation");
    var position = conversation.position();
    var fullImg = $('<img id=\"imgfullSize\" src="' + blob + '"/>');
    
    //Full Image events
    fullImg.click(function() {
        this.remove();
        $("#image-overlay").hide();
        conversation.show();
    });

    fullImg.dbclick(function() {
        
    });
    
    fullImg.css({
        "width": conversation.width(),
        "height": conversation.height(),
        "top" : position.top,
        "left": position.left,
        "z-index": 1,
        "opacity": 1,
    });
    
     $("#image-overlay").css({
        "width": conversation.width(),
        "height": conversation.height(),
        "top" : position.top,
        "left": position.left,
        "z-index": 1,
        "opacity": 1
    });
    
    $("#image-overlay").append(fullImg);
    $("#image-overlay").show();
    conversation.hide();
}