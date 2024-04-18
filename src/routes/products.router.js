import { Router } from 'express';
import { pm } from '../persistenceFile/index.js'

const router = Router()

router.get('/', async (req, res) =>{
    let products = await pm.getProducts();
    const limit = req.query.limit;
    if(!limit) return res.send(products);
    res.send(products.slice(0, limit));
})

router.get('/:pid', async(req, res) => {
    const id = parseInt(req.params.pid);
    const productById = await pm.getProductById(id);
    if (!productById){
        return console.log('No hay ningún producto con ese ID')
    }
    res.send(productById);
})

router.post('/', async (req, res) => {
    const { title, description, price, status, stock, category, thumbnail} = req.body;
    if (!title || !description || !price || !status || !stock || !category) {
        return res.send({ status: "error", message: "Faltan completar valores" });
    }
    try {
        await pm.addProduct(title, description, price, status, stock, category, thumbnail);
        return res.send({ status: "success", message: "Producto agregado" });
    } catch (error) {
        console.error(error);
        return res.send({ status: "error", message: "Error al agregar el producto" });
    }
});

router.put('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid);
    const updates =  req.body;
    try {
        await pm.updateProduct(id, updates);
        res.send({status: "success", message: "Producto actualizado"});
    } catch (error) {
        res.send({status: "error", message: "Hubo un error"});
    }
})

router.delete('/:pid', async (req, res) => {
    const id = parseInt(req.params.pid);
    try {
        await pm.deleteProduct(id);
        res.send({status: "success", message: "Producto eliminado correctamente"})
    } catch (error) {
        res.send({status: "error", message: error.message})
    }
})

export {router as productRouter}