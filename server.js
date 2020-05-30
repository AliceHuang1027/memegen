const express = require('express')
const app = express()

const Jimp = require('jimp')
const port = process.env.PORT || 8900

app.use(express.static(__dirname))
app.use(express.json({limit:'10mb'}))
app.options('/*',(req,res)=>{
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Origin', req.headers.origin)
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Credentials'
    )
    res.send('ok')
})
const memory = {}
const list = ["animals","arch","nature","people","tech"]
app.get(`/memegen/api/:text`,(req,res)=>{
    if(!req){
        res.send('check your url')
    }

    const obj ={}
 
    obj.blur =req.query.blur
    obj.black = req.query.black
    
    obj.text = req.params.text

    obj.sepia = req.query.sepia
    obj.greyscale = req.query.greyscale
    if(req.query.category && list.find(e=>{return e===req.query.category})){

        obj.category = req.query.category
    }
    
    
    if(req.query.src){
        obj.src= req.query.src
    }
    if(!obj.category && !req.query.src){
        obj.src= `https://placeimg.com/640/480/any`
   }
    if(!req.query.src && obj.category){
        obj.src = `https://placeimg.com/640/480/${obj.category}`
    }
 


    Jimp.read(obj.src).then(image =>{

        console.log(image)
        if(obj.black==='true'){
            Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(font =>{
                image.print(font,10,10,obj.text)
                if(obj.blur)
                {image.blur(+obj.blur)}
                if(obj.greyscale){
                    image.greyscale(+obj.greyscale)
                }
                if(obj.sepia){
                    image.sepia(+obj.sepia)
                }
                
                image.getBufferAsync(Jimp.MIME_JPEG).then(buffer =>{
                    res.set('Content-Type', 'image/jpeg')
                    console.log(buffer)
                    const name = JSON.stringify(obj)
                    console.log(name)
                    if(Object.keys(memory).length<10){

                        if(memory[name]){
                            if(memory[name].buffer){
                                memory[name].count +=1
                                return res.send(memory[name].buffer)
                            }
                            memory[name].count +=1
                        }
                        if(!memory[name]){
                            memory[name]={"buffer":buffer,"count":1}
                        }
                       
                    }
                    console.log('memory',memory)
                    res.send(buffer)
                })
                 
    
            })
        }
        if(obj.black !=='true'){
            Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then(font =>{
                image.print(font,10,10,obj.text)
                if(obj.blur)
                {image.blur(+obj.blur)}
                if(obj.greyscale){
                    image.greyscale(+obj.greyscale)
                }
                if(obj.sepia){
                    image.sepia(+obj.sepia)
                }
                
                image.getBufferAsync(Jimp.MIME_JPEG).then(buffer =>{
                    res.set('Content-Type', 'image/jpeg')
                    console.log(buffer)
                    const name = JSON.stringify(obj)
                    console.log(name)
                    if(Object.keys(memory).length<10){

                        if(memory[name]){
                            if(memory[name].buffer){
                                memory[name].count +=1
                                return res.send(memory[name].buffer)
                            }
                            memory[name].count +=1
                        }
                        if(!memory[name]){
                            memory[name]={"buffer":buffer,"count":1}
                        }
                       
                    }
                    console.log('memory',memory)
                    res.send(buffer)
                })
            })
        }
       
    })

})

app.listen(port,()=>{console.log(`listening on port ${port}`)})
