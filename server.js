const express = require('express')
const handlebars = require("express-handlebars"); //handlebars
const { Router } = express
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const ContenedorMemoria = require('./contenedores/ContenedorMemoria.js');
const ContenedorArchivo = require('./contenedores/ContenedorArchivo.js');


const contenedorMemoria = new ContenedorMemoria()
const contenedorArchivo = new ContenedorArchivo('mensajes.txt')
const productosRouter = new Router()
productosRouter.use(express.json())
productosRouter.use(express.urlencoded({ extended: true }))

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);


app.use('/productos', productosRouter)

//Set engine handlebars

app.engine('hbs', handlebars.engine({
        extname: '.hbs',
        defaultLayout: 'index.hbs',
        layoutsDir: __dirname + '/views/layouts',
        partialsDir: __dirname + '/views/partials/'
    })
);
app.set('view engine', 'hbs'); 
// fin setup handlebars
app.set('views','./views');
app.use(express.static('public'))

//--------------------------------------------
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

io.on('connection', async socket => {
    console.log('un cliente se ha conectado');
    const mensajes = await contenedorArchivo.listarAll();
    io.sockets.emit('mensajes', mensajes);

    const productos = contenedorMemoria.listarAll();
    io.sockets.emit('productos', productos);
    
    socket.on('new-product', producto => {
        contenedorMemoria.guardar(producto);
        const productos = contenedorMemoria.listarAll();
        io.sockets.emit('productos', productos);
        console.log(productos);
    });
    socket.on('new-message', async mensaje => {
        await contenedorArchivo.guardar(mensaje);
        const mensajes = await contenedorArchivo.listarAll();
        console.log(mensajes);
        //Este evento envía un nuevo mensaje a todos los clientes que estén conectado en ese momento
        io.sockets.emit('mensajes', mensajes);
    });
});

//--------------------------------------------


app.use('', productosRouter)


const PORT = 8080
httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${httpServer.address().port}`)
})
httpServer.on("error", error => console.log(`Error en servidor ${error}`))