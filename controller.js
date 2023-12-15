const Query = require('./querys');
const qr = new Query();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')



exports.login = async (req, res)=>{
    const data = req.body;
    console.log(data);
    if(data.login == undefined || data.senha == undefined){
        return res.status(400).send({
            message: "Credenciais Inválidas"
        })
    }else{
        try {
            const con = await qr.consultaUsuario(data);
            if(con.length > 0){
                let loged = await bcrypt.compare(data.senha, con.data[0].senha);
                if(loged){
                    const  token = jwt.sign({ id: con.data[0].id, tipo: con.data[0].tipo  }, '@cessoFLFnti', {
                        expiresIn: 60 * 600
                    });

                    return  res.status(200).json({
                        message: "Usuario Authenticado",
                        token: token,
                        type: con.data[0].tipo,
                        nome: con.data[0].nome,
                        guiche: con.data[0].guiche,
                        s_id: con.data[0].s_id,
                        s_nome: con.data[0].s_nome
                    })
                }
            }
            return res.status(401).json({
                message: "Credenciais inválidas"
            })
        } catch (error) {
            console.log(error)
            res.status(500).json()
        }
    }  
} 

exports.novoUsuario = async (req, res) =>{
    const data = req.body;
    if(data.nome == "" || data.login == "" || data.senha == "" || data.tipo == "" ){
        return res.status(400).json({
            message: 'Dados inválidos: Campos estão pendentes'
        })
    }

    if(data.tipo != "atend"){
        data.s_id = 999
    }
    try {
        let usuarios = await qr.consultaUsuario(data)
        if(usuarios.length > 0){
            return res.status(400).json({
                message: 'usuario ja existente'
            })
        }
        let crypto = await bcrypt.hash(data.senha, 10);
        data.pass = crypto;
        let resp = await qr.cadastrarUsuario(data);
        if(!resp){
            return res.status(400).json({
                message: 'Algo deu errado'
            })
        }
        return res.status(200).json({
            message: 'usuario criado'
        })
    } catch (error) {
        return res.status(500).json()
    }
}
 
exports.listaUsuarios = async (req, res) =>{
    try {
        let usuarios = await qr.consultaUsuarios()
        
        if(usuarios.length > 0){
            return res.status(200).json(usuarios.data)
        }else{
            return res.status(201).json({
                message: 'Sem usuarios'
            })
        }    
    } catch (error) {
        console.log(error)
        res.status(500).json()
    }
}

exports.editarUsuario = async (req, res) =>{
    const data = req.body;
    if(data.nome == "" || data.login == "" || data.tipo == "" ){
        return res.status(400).json({
            message: 'Dados inválidos: Campos estão pendentes'
        })
    }
    try {
        if(data.senha != "" && data.senha != null && data.senha != undefined){
            let crypto = await bcrypt.hash(data.senha, 10);
            data.pass = crypto;
            let resp = await qr.aletarSenha(data);
            if(!resp){
                return res.status(400).json({
                    message: 'Algo deu errado'
                })
            }
        }
        let resp = await qr.atualizarUsuario(data);
        if(!resp){
            return res.status(400).json({
                message: 'Algo deu errado'
            })
        }
        return res.status(200).json({
            message: 'usuario Ataualizado'
        })
    } catch (error) {
        return res.status(500).json()
    }
}

exports.novoServico = async (req, res) =>{
    const data = req.body;
    try {
       
        let resp = await qr.cadastrarServico(data);
        if(!resp){
            return res.status(400).json({
                message: 'Algo deu errado'
            })
        }
        return res.status(200).json({
            message: 'Serviço criado'
        })
    } catch (error) {
        return res.status(500).json()
    }
}

exports.listaServicos = async (req, res) =>{
    try {
        let servicos = await qr.consultaServicos()
        
        if(servicos.length > 0){
            return res.status(200).json(servicos.data)
        }else{
            return res.status(201).json({
                message: 'Sem serviços'
            })
        }    
    } catch (error) {
        res.status(500).json()
    }
}

exports.listaConfigs = async (req, res) =>{
    try {
        let configs = await qr.consultaConigs()
        
        if(configs.length > 0){
            return res.status(200).json(configs.data)
        }else{
            return res.status(201).json({
                message: 'Sem serviços'
            })
        }    
    } catch (error) {
        res.status(500).json()
    }
}

exports.updateConfigs = async (req, res) =>{
    try {
        const data = req.body
        let configs = await qr.updateConfigs(data)
        
        if(configs){
             res.status(200).json(configs.data)
        }else{
            throw new Error("Erro")
        }    
    } catch (error) {
        res.status(500).json()
    }
}

exports.listaServicosAtivos = async (req, res) =>{
    try {
        let servicos = await qr.consultaServicosAtivos()
        
        if(servicos.length > 0){
            return res.status(200).json(servicos.data)
        }else{
            return res.status(201).json({
                message: 'Sem serviços'
            })
        }    
    } catch (error) {
        res.status(500).json()
    }
}

exports.editarServico = async (req, res) =>{
    const data = req.body;
    console.log(data)
    try {
        let resp = await qr.atualizarServico(data);
        if(!resp){
            return res.status(400).json({
                message: 'Algo deu errado'
            })
        }
        return res.status(200).json({
            message: 'Servico atualizado'
        })
    } catch (error) {
        return res.status(500).json()
    }
}


