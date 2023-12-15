const c = require('config')
const pg = require('./config/conexao')
class Consultas {

     async consultaUsuario(data){
        try {
             const con = await pg.query('select u.id, u.nome, u.login, u.senha, u.status, u.tipo, u.guiche, fk_servico as s_id, s.description as s_nome from sga.usuarios u inner join sga.servicos s on u.fk_servico = s.id where u.login = $1 and u.status = true', [data.login])
             return {data: con.rows, length: con.rowCount }
        } catch (error) {
             return error
        }
    };

     async consultaUsuarios(){
          try {
               const con = await pg.query('select u.id, u.nome, u.login, u.status, u.tipo, u.guiche, fk_servico as s_id, s.description as s_nome from sga.usuarios u inner join sga.servicos s on u.fk_servico = s.id order by nome ASC',)
               return {data: con.rows, length: con.rowCount }
          } catch (error) {
               return error
          }
     };

     async consultaServicos(){
          try {
               const con = await pg.query('select * from sga.servicos where id!=999 order by description asc',)
               return {data: con.rows, length: con.rowCount }
          } catch (error) {
               return error
          }
     };

     async consultaServicosAtivos(){
          try {
               const con = await pg.query('select * from sga.servicos where status = true and id != 999 order by description asc',)
               return {data: con.rows, length: con.rowCount }
          } catch (error) {
               return error
          }
     };
     
     async cadastrarUsuario(data){
        try {
               let jso = [data.nome, data.login, data.pass, data.tipo, data.guiche, data.s_id]
               await pg.query(`
                    insert 
                    into sga.usuarios(nome, login, senha, status, tipo, guiche, fk_servico) 
                    values($1,$2 ,$3, true, $4, $5, $6) `, 
                    jso)
               return true
        } catch (error) {
               console.log(error)
             return false
        }
     }

     async cadastrarServico(data){
          try {
                 let jso = [data.description, data.pd_senha]
                 await pg.query(`
                      insert 
                      into sga.servicos(description, status, pd_senha) 
                      values($1, true, $2)`, 
                      jso)
                 return true
          } catch (error) {
               console.log(error)
               return false
          }
       }

     async aletarSenha(data){
          try {
                 let jso = [data.pass, data.id]
                 await pg.query(`
                      update sga.usuarios set senha = $1 where id = $2`, 
                      jso)
                 return true
          } catch (error) {
               return false
          }
     }

     async atualizarUsuario(data){
          try {
                 let jso = [data.nome, data.login, data.status, data.id, data.guiche, data.s_id]
                 await pg.query(`
                      update sga.usuarios set nome = $1, login = $2, status = $3, guiche = $5, fk_servico=$6 where id = $4`, 
                      jso)
                 return true
          } catch (error) {
               return false
          }
     }
 
     async atualizarServico(data){
          try {
        
                 let jso = [data.description, data.status, data.id, data.pd_senha]
                 await pg.query(`
                      update sga.servicos set description = $1,  status = $2, pd_senha=$4 where id = $3`, 
                      jso)
                 return true
          } catch (error) {
               console.log(error)
               return false
          }
     }

     async consultaConigs(){
          try {
               const con = await pg.query('select * from sga.configs',)
               return {data: con.rows, length: con.rowCount }
          } catch (error) {
               return error
          }
     };

     async updateConfigs(data){
          try {
               const con = await pg.query('UPDATE sga.configs SET  son = $1, mensagem = $2, conteudo = $3, tipo_conteudo = $4',
                    [data.som, data.mensagem, data.conteudo, data.tipo]
               )
               return true
          } catch (error) {
               return error
          }
     };
     
}

module.exports = Consultas;