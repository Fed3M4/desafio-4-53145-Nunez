import {Router} from 'express'
import { pm } from '../persistenceFile/index.js'

const router = Router()

router.get('/chat', (req, res) => {
    res.render('index', {})
})

router.get('/home', async (req, res) =>{
    let products = await pm.getProducts()
    res.render('home', {
        products
    })
})

router.get("/realTimeProducts",(req,res)=>{
    res.render("realTimeProducts")
})

export {router as viewsRouter}