var WIDTH = 400,
    HEIGHT = 300,

    personalStream = null,
    video = null,

    canvas = null,
    ctx = null,

    friend_img = null,

    socket = null;

function drawFriendData(bytes) {
    friend_img.src = bytes;
}

function sendSnapshot(bytes) {
    if(socket) {
        socket.send(bytes);
    }
}

function snapshot() {

    if(personalStream) {
        ctx.drawImage(video, 0, 0, WIDTH, HEIGHT);

        var data = canvas.toDataURL('image/jpeg', 0.5);
        sendSnapshot(data);
    }
}

function onMessage(event) {
    console.log(event);
    drawFriendData(event.data);
}

$(document).ready(function() {
    canvas = document.getElementById('hidden_canvas');
    video = document.getElementById('your_video');
    ctx = canvas.getContext('2d');
    friend_img = document.getElementById('friend_video');

    (navigator.webkitGetUserMedia || navigator.mozGetUserMedia).call(navigator, { video: {
        mandatory: {
            maxWidth: WIDTH,
            maxHeight: HEIGHT
        }
    }}, function(stream) {
        video.src = window.URL.createObjectURL(stream);
        personalStream = stream;
    }, function(error) {
        alert(error.name);
    });

    socket = new WebSocket('ws://' + window.location.host + '/session/' + session_id + '/stream');
    socket.onmessage = onMessage;

    window.setInterval(snapshot, 1000 / 2);
});