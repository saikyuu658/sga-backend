const express = require('express');
const rota = express.Router();
const controller = require('./controller')
const auth = require('./midleware')

rota.post('/login', controller.login);
rota.post('/cadastrar/usuario',auth.authAdmin, controller.novoUsuario);
rota.post('/atualizar/usuario', auth.authAdmin, controller.editarUsuario);
rota.get('/consulta/usuario', auth.authAdmin, controller.listaUsuarios);

rota.post('/atualizar/servico', auth.authAdmin, controller.editarServico);
rota.post('/cadastrar/servico', auth.authAdmin, controller.novoServico);
rota.get('/consulta/servicos', auth.authAdmin, controller.listaServicos);

rota.get('/consulta/configs', controller.listaConfigs);
rota.post('/atualizar/configs', auth.authAdmin, controller.updateConfigs);

rota.get('/consulta/normal/servicos', auth.authUser, controller.listaServicosAtivos);












module.exports = rota;

