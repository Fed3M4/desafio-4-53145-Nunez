import express from 'express';
import handlebars from 'express-handlebars';
import {Server} from 'socket.io';
import { __dirname } from './utils.js';

import {productRouter} from '../src/routes/products.router.js'
import { uploader } from './multer.js';
import { cartRouter } from '../src/routes/carts.router.js';
import { viewsRouter } from './routes/views.router.js';
import { pm } from './persistenceFile/index.js';


const port = process.env.PORT || 8080;
const app = express();

const httpServer = app.listen(port, error => {
    if(error) console.log(error.message)
    console.log(`¡Servidor arriba en el puerto ${port}`)
})

const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.engine('hbs', handlebars.engine({extname:'hbs'}));
app.set('views', __dirname+'/views');
app.set('view engine', 'hbs');

app.use(express.static(__dirname+'/public'));
app.use('/subir-archivo', uploader.single('myFile'), (req, res) => {
    if(!req.file) {
        return res.send('No se pudo subir el archivo');
    }
    res.send('Archivo subido');
})

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', viewsRouter);
app.use((error, req, res, next) => {
    console.log(error);
    res.status(500).send('Error 500 en el server')
})

let messages = [];

io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado')

    socket.on('message', data =>{
        console.log('messages data: ', data)
        messages.push(data)
        io.emit('messageLogs', messages)
    })

    const listadeproductos = await pm.getProducts()
    socket.emit("enviodeproducts",listadeproductos)

    socket.on("addProduct", async(product) => {
        await pm.addProduct(
            product.title,
            product.description,
            product.price,
            product.status,
            product.stock,
            product.category,
            product.thumbnail
        );
    const listadeproductos = await pm.getProducts()
    socket.emit("enviodeproducts",listadeproductos)
    })

    socket.on("deleteProduct", async(id) => {
        await pm.deleteProduct(id)
        const listadeproductos = await pm.getProducts()
        socket.emit("enviodeproducts",listadeproductos)
        })
})