const express = require('express')
const app = express();
const http = require('http')
var cors = require('cors')
const rota = require('./rotas');
const bodyParser = require('body-parser')
const { Server } = require('socket.io')
const fs = require('fs');
// http://192.168.102.168:8080
const cron = require('node-cron');

cron.schedule('37 8 * * *', () => {
    senhas = {
        senhasEsperando: [],
        senhasChamadas: [],
        senhasAtendidas: []
    }
    fs.writeFile('./storage/senha.json', JSON.stringify(senhas), (err)=>{
        if(err){
            console.log('erro para escrever: ')
            console.log(err)
        }
    })
});

app.use(cors({origin: 'http://192.168.102.138:8080', optionsSuccessStatus: 200}))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(rota);


const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST']
    }
});
    let senhas = {
        senhasEsperando: [],
        senhasChamadas: [],
        senhasAtendidas: []
    }
    fs.readFile('./storage/senha.json', 'utf8', (err, data)=>{
        if(err){
            console.log('Não tem arquivo')
            fs.writeFile('./storage/senha.json', JSON.stringify(senhas), (err)=>{
                if(err){
                    console.log('erro para escrever: ')
                    return ;
                }
            })
        }else{
            console.log('tem o arquivo')
            senhas = JSON.parse(data);
        }
    });
    
    io.on('connection', (socket)=>{
        console.log(`${socket.id} connected`);
        
        socket.emit('listar senhas', senhas );

        socket.on('criar senha', (senha) => {
            senhas.senhasEsperando.push(senha);
            fs.writeFile('./storage/senha.json', JSON.stringify(senhas), (err)=>{
                if(err){
                    console.log('erro para escrever: ')
                    console.log(err)
                }else{
                    socket.broadcast.emit('listar senhas', senhas )
                }
            })
        });

        socket.on('chamar novamente', (data)=>{
            let pass;
            console.log(data)
            for (let i = 0; i < senhas.senhasChamadas.length; i++) {
                if(senhas.senhasChamadas[i].senha == data.senha){
                    pass = data
                    senhas.senhasChamadas.splice(i, 1);
                }
            }
            senhas.senhasChamadas.push(pass)

            socket.broadcast.emit('listar senhas', senhas )
            socket.broadcast.emit('alert', '' )

        });

        socket.on('chamar senha', async (data) => {
            let pass;  
            for (let i = 0; i < senhas.senhasEsperando.length; i++) {
                if(senhas.senhasEsperando[i].senha == data.senha){
                    pass = data
                    senhas.senhasEsperando.splice(i, 1);
                }
            }
            pass.status = 'atendendo'
            senhas.senhasChamadas.push(pass)
            fs.writeFile('./storage/senha.json', JSON.stringify(senhas), (err)=>{
                if(err){
                    console.log('erro para escrever: ')
                    console.log(err)
                }else{
                    socket.broadcast.emit('listar senhas', senhas )
                    socket.broadcast.emit('alert', 'pastel' )
                }
            })
        });

        socket.on('voltar senha', (data)=>{
            console.log(data)
            let pass;  
            for (let i = 0; i < senhas.senhasChamadas.length; i++) {
                
                if(senhas.senhasChamadas[i].senha == data.senha){
                    pass = data
                    senhas.senhasChamadas.splice(i, 1);
                }
            }
            pass.status = 'esperando'
            senhas.senhasEsperando.push(pass)
            fs.writeFile('./storage/senha.json', JSON.stringify(senhas), (err)=>{
                if(err){
                    console.log('erro para escrever: ')
                    console.log(err)
                }else{
                    socket.broadcast.emit('listar senhas', senhas )
                }
            })
        })

        socket.on('chamar proximo', (data)=>{
            let pass;
            console.log(data);
            for (let i = 0; i < senhas.senhasChamadas.length; i++) {
                
                if(senhas.senhasChamadas[i].senha == data.senha){
                    pass = data
                    senhas.senhasChamadas.splice(i, 1);
                }
            }
            pass.status = 'finalizado';
            senhas.senhasAtendidas.push(pass)
            let call;
            let index;
            for(const [i, se] of senhas.senhasEsperando.entries()){
                
                if(se.servico == data.servico){
                    index = i;
                    call = JSON.parse(JSON.stringify(se));
                    break;
                }
            }
            if(call != undefined){
                call.status = "atendendo";
                call.guiche = data.guiche;
                senhas.senhasChamadas.push(call);
            }
            senhas.senhasEsperando.splice(index, 1);

            fs.writeFile('./storage/senha.json', JSON.stringify(senhas), (err)=>{
                if(err){
                    console.log('erro para escrever: ')
                    console.log(err)
                }else{
                    socket.broadcast.emit('listar senhas', senhas )
                }
            })
        })

        socket.on('finalizar atendimento', (data)=>{
            let pass;
            for (let i = 0; i < senhas.senhasChamadas.length; i++) {
                
                if(senhas.senhasChamadas[i].senha == data.senha){
                    pass = data
                    senhas.senhasChamadas.splice(i, 1);
                }
            }
            pass.status = 'finalizado'
            senhas.senhasAtendidas.push(pass)

            fs.writeFile('./storage/senha.json', JSON.stringify(senhas), (err)=>{
                if(err){
                    console.log('erro para escrever: ')
                    console.log(err)
                }else{
                    socket.broadcast.emit('listar senhas', senhas )
                }
            })
            socket.broadcast.emit('listar senhas', senhas )
        })

        socket.on("disconnect", ()=>{
            console.log(`${socket.id} desconectado`)
        });
       
    })

server.listen(3000,()=>{
    console.log('server running now')
});


