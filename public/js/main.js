const socket = io.connect();

//------------------------------------------------------------------------------------
// SECTOR DE ENVIO DE PRODUCTOS AL FRONT Y AL BACK
const formAgregarProducto = document.getElementById('formAgregarProducto')
formAgregarProducto.addEventListener('submit', e => {
    e.preventDefault()
    //Armar objeto producto y emitir mensaje a evento update
    
    const producto = {
        title: e.target[0].value,
        price: e.target[1].value,
        thumbnail: e.target[2].value
    };

    socket.emit('new-product', producto);
    return false;  
})

socket.on('productos', async (productos) => {
    //generar el html y colocarlo en el tag productos llamando al funcion makeHtmlTable
    const html = await makeHtmlTable(productos);
    document.getElementById('productos').innerHTML = html;
    socket.emit('notificacion', 'Producto recibido');
});

function makeHtmlTable(productos) {
    return fetch('plantillas/tabla-productos.hbs')
        .then(respuesta => respuesta.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ productos })
            return html
        })
}

//-------------------------------------------------------------------------------------

const inputUsername = document.getElementById('inputUsername')
const inputMensaje = document.getElementById('inputMensaje')
const btnEnviar = document.getElementById('btnEnviar')

const formPublicarMensaje = document.getElementById('formPublicarMensaje')
formPublicarMensaje.addEventListener('submit', e => {
    e.preventDefault()
    //Armar el objeto de mensaje y luego emitir mensaje al evento nuevoMensaje con sockets
    const mensaje = {
        author: document.getElementById('inputUsername').value,
        text: document.getElementById('inputMensaje').value,
        date: new Date().toLocaleString() 
    };
    socket.emit('new-message', mensaje);
    formPublicarMensaje.reset();
    inputMensaje.focus();
    return false;
})

socket.on('mensajes', async (mensajes) => {
    const html = await makeHtmlList(mensajes);
    document.getElementById('mensajes').innerHTML = html;
})

function makeHtmlList(mensajes) {
    //Armar nuestro html para mostrar los mensajes como lo hicimos en clase
    console.log(mensajes);
    return fetch('plantillas/tabla-chat.hbs')
        .then(respuesta => respuesta.text())
        .then(plantilla => {
            const template = Handlebars.compile(plantilla);
            const html = template({ mensajes })
            return html
        })
}

inputUsername.addEventListener('input', () => {
    const hayEmail = inputUsername.value.length
    const hayTexto = inputMensaje.value.length
    inputMensaje.disabled = !hayEmail
    btnEnviar.disabled = !hayEmail || !hayTexto
})

inputMensaje.addEventListener('input', () => {
    const hayTexto = inputMensaje.value.length
    btnEnviar.disabled = !hayTexto
})