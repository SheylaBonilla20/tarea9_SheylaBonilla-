// Conectamos al servidor con socket.io
const socket = io();

socket.on('login', (message) => {
    console.log(message);
});

socket.on('message', (message) => {
    console.log(message);
});

socket.on('logout', (message) => {
    console.log(message);
});

// Usar el modal de login con el usuario al entrar
$('#login').model({ dismissible: false }).submit((e) => {
    e.preventDefault();
    let user = $('#login input').val();

    // Continuar sólo si sí que hay usuario
    if (!user) return;
    cookies({ user });
    $('#login').modal('close');

    // Enviar el evento al resto de usuarios
    socket.emit('login', user);
})

// Comunicar el usuario al resto de gente o pedir login
if (cookies('user')) {
    socket.emit('login', cookies('user'));
} else {
    $('#login').modal('open');
}

// El usuario envía un mensaje
$('form.message').submit((e) => {
    e.preventDefault();
    let $input = $(e.target).find('input');
    let text = $input.val();

    // Borrar el mensaje del input
    $input.val('');

    // Enviar el mensaje a todos
    socket.emit('message', text);
});

// Evitar XSS usando escape()
let escape = (html) => {
    return $('<div>').text(html).html();
};


// Añadir un mensaje a la lista y hacer scroll
let add = (html) => {
    var toScroll = $('.messages').prop("scrollHeight") - 50 < $('.messages').scrollTop() + $('.messages').height();
    $('.messages').append(html);

    // Hacer scroll sólo si mantenemos la conversación abajo, si hemos subido no scrollear
    if (toScroll) {
        $('.messages').stop(true).animate({
            scrollTop: $('.messages').prop("scrollHeight")
        }, 500);
    }
};

socket.on('login', (message) => {
    add('<div class="msg login">\
      <span class="user">' + escape(message.user) + '</span> logged in.\
    </div>');
});

socket.on('message', (message) => {
    add('<div class="msg">\
      <span class="user">' + escape(message.user) + ':</span> \
      <span class="msg">' + escape(message.text) + '</span>\
    </div>');
});

socket.on('logout', (message) => {
    add('<div class="msg logout">\
      <span class="user">' + escape(message.user) + '</span> logged out.\
    </div>');
});