var WIDTH = 400,
    HEIGHT = 300,

    personalStream = null,
    video = null,

    canvas = null,
    ctx = null,

    friend_img = null,

    socket = null,

    pusher = new Pusher('7d1da5552b0624b2d297'),
    channel = pusher.subscribe(session_id);

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

function onSocketMessage(event) {
    console.log(event);
    drawFriendData(event.data);
}

function createVideoStream() {
    (navigator.webkitGetUserMedia || navigator.mozGetUserMedia).call(navigator, { video: {
        mandatory: {
            maxWidth: WIDTH,
            maxHeight: HEIGHT
        }
    }}, function (stream) {
        video.src = window.URL.createObjectURL(stream);
        personalStream = stream;
    }, function (error) {
        alert(error.name);
    });
}

function sendMessage(message) {
    $.getJSON('/session/' + session_id + '/message/' + encodeURIComponent(message));
}

function onMessage(data) {
    var class_name = null;

    if(data.user_id == user_id) {
        class_name = 'my_message';
    } else {
        class_name = 'other_message';
    }

    $('.messages').prepend($('<div></div>')
        .addClass(class_name)
        .text(data.message));
}

$(document).ready(function() {
    canvas = document.getElementById('hidden_canvas');
    video = document.getElementById('your_video');
    ctx = canvas.getContext('2d');
    friend_img = document.getElementById('friend_video');

    createVideoStream();

    $(".message_input").keyup(function (e) {
        if (e.keyCode == 13) {
            sendMessage($(this).val());
            $(this).val('');
        }
    });

    channel.bind('new_message', onMessage);

    socket = new WebSocket('ws://' + window.location.host + '/session/' + session_id + '/stream');
    socket.onmessage = onSocketMessage;

    window.setInterval(snapshot, 1000 / 2);
});