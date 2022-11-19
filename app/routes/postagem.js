const express = require('express')
const path = require('path')
const multer = require('multer')

const router = express.Router()
const jsonCRUD = require('../../config/jsonCRUD')

const multerConfig = require('../../config/multerConfig')

const Postagem = require('../models/Post')

const sf = {
    path: path.resolve(__dirname, '..', '..', 'config', 'jsons', 'post.json' ),
    encoding: 'utf-8'
}

router.get('/show/:postId', async (req, res) =>{
    const id = req.params.postId * 1

    const posts = await jsonCRUD.JSONRead(sf.path, sf.encoding).then(res => {
        return res
    })
    
    const post = posts.find(post => post.id == id)

    res.status(200).render('layout/home', {
        conteudo: 'postagem/index',
        post    
    })
})

router.get('/create', async (req, res) => {
    try{
        var corpo = null

        res.status(200).render('layout/admin', {
            conteudo: 'postagem/create',
            corpo
        })
    }catch(error){
        res.status(400).send(error)
    }
})

router.post('/conteudo', async (req, res) => {
    try{
        
        const corpo = { titulo, subtitulo, cabecalho, textPost}  = req.body

        res.status(200).render('layout/admin', {
            conteudo: 'postagem/create',
            corpo
        })
        
    }catch(error){
        res.status(400).send(error)
    }
})

router.post('/', async (req, res) => {
    try{
        
        const corpo = { titulo, subtitulo, cabecalho, image, textPost}  = req.body

        const post = new Postagem(corpo)

        const posts = await jsonCRUD.JSONRead(sf.path, sf.encoding).then(res => {
            return res
          })
          
          if (!posts) {
            res.status(404).send({Erro: 'posts não encontrado!'})
          }
          
          corpo.id = posts.length + 1

        if(image){
            res.status(200).render('layout/admin', {
                conteudo: 'postagem/create',
                corpo
            })
        }else{
            res.status(200).redirect('/auth/posts')
        }
        
    }catch(error){
        res.status(400).send(error)
    }
})

router.post('/image/:postId', multer(multerConfig).single('file'), async (req, res) => {
    try{
        const id = req.params.postId * 1
        const image = req.file

        const posts = await jsonCRUD.JSONRead(sf.path, sf.encoding).then(res => {
            return res
        })
          
        if (!posts) {
            res.status(404).send({Erro: 'posts não encontrado!'})
        }
          
           
        const novosPosts = posts.map(post => {

            if(post.id == id){
                post.postagem.image = image.filename
            }
            
            return post
        })
        
        const uppdate = await jsonCRUD.JSONWrite(sf.path, novosPosts, sf.encoding)

        res.status(200).redirect('/auth/posts')
        
    }catch(error){
        res.status(400).send(error)
    }
})

module.exports = app => app.use('/post', router)