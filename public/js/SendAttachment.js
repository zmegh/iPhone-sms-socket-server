$('#imagefile').on('change', function (e) {
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
        socket.emit('user image', evt.target.result);
    };
    //And now, read the image and base64
    reader.readAsDataURL(file);
});