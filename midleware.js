const jwt = require('jsonwebtoken');

    exports.authAdmin = async (req, res, next)=>{
        const token = req.headers.authorization;
        
        if(!token){
            return  res.status(401).json({ auth: false, message: 'Sem token.' });
        }else{
            jwt.verify(token, '@cessoFLFnti', (err, decoded)=>{
                if(err){
                    return res.status(401).json({ auth: false, message: 'Token invalido' });
                }else if(decoded.tipo != 'adm'){
                    return res.status(401).json({ auth: false, message: 'Token invalido' });
                }
                req.body.id_user = decoded.id
                return next()
            })
        }
        
    }

    exports.authUser = async (req, res, next)=>{
        const token = req.headers.authorization;
        
        if(!token){
            return  res.status(401).json({ auth: false, message: 'Sem token.' });
        }else{
            jwt.verify(token, '@cessoFLFnti', (err, decoded)=>{
                if(err){
                    return res.status(401).json({ auth: false, message: 'Token invalido' });
                }
                req.body.id_user = decoded.id
                return next()
            })
        }
        
    }