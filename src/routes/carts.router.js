import { Router } from 'express';
import { cm } from '../persistenceFile/index.js';

const router = Router()

router.get('/:cid', async (req, res) => {
    const carritoID = parseInt(req.params.cid)
    const carritoSelected = await cm.getCartById(carritoID)
    if(!carritoSelected){
        res.send({status: "error", message: "No hay un carrito con ese ID"})
    }
    const productsCarrito = JSON.stringify(carritoSelected.products)
    res.send({status: "succes", message: `Su producto es ${productsCarrito}`})
})

router.post('/', async (req, res) => {
    try {
        await cm.createCart();
        return res.send({ status: "success", message: "Producto agregado al carrito" });
    } catch (error) {
        console.error(error);
        return res.send({ status: "error", message: "Error al agregar el producto al carrito" });
    }
});

router.post('/:cid/product/:pid', async(req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    const {quantity} = req.body;

    try {
        await cm.addProductToCart(cid, pid, quantity)
        res.send({status: "success", message: "Producto actualizado"})
    } catch (error) {
        res.send({status: "error", message: error.message})
    }
})





export {router as cartRouter}