const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// CODDING: Modelos
const User = require('../models/userModel');

async function auth(req, res, next){
    try{
        const token = req.query.token;
        if(!token) return res.status(404).json({error: `Token não encontrado`});
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(mongoose.Types.ObjectId(decoded.id));

        
        if(!user){
            return res.status(404).json({error: 'Usuario não encontrado'});
        }
        
        req.user = user;
        next();
    }catch(error){
        
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({ error: "Token JWT malformado ou inválido" });
        } else if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: "Token JWT expirado" });
        } else {
            console.log(`ERRO INTERNO DO SERVIDOR: `, error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}


// pegar conta 
router.get('/account/:idAccountFb',auth, async (req, res, next)=>{
    try{
        
        const {idAccountFb} = req.params;
        if(!idAccountFb) return res.status(404).json({error: "Id da conta não encontrado."});

        const account = req.user.accountsFb.find(account=>account.idAccount === idAccountFb);
        if(!account) return res.status(404).json({error:`Id da conta inválido.`});

        let {token, fields} = req.query;
        if(!token) return res.status(404).json({error:"Token não encontrado."});
        if(fields){
            fields = fields.split(',').map(field=>field.trim());
        }else{
            fields = [];
        }

        const response = {account:{name: account.name, id:account.idAccount},fields:[]};
        
        // pegar foto de perfil diretamente do facebook
        if(fields.includes('photo')){
            const request = await fetch(`https://graph.facebook.com/v12.0/${account.idAccount}?fields=picture.type(large)&access_token=${account.accessToken}`);
            if(request.ok){
                const photoData = await request.json();
                const photoUrl = photoData.picture.data.url;

                // atualizar photo no banco de dados
                const user = await User.findByIdAndUpdate(
                    mongoose.Types.ObjectId(req.user._id), 
                    { $set: { "accountsFb.$[account].photo": photoUrl } },
                    { arrayFilters: [{ "account.idAccount": idAccountFb }], new: true });
                
                // adicionar photo na resposta
                response.fields.push("photo");
                response.account.photo = photoUrl;
            }
        }

        return res.status(200).json(response);
    }catch(error){
        return res.status(500).json({error: `${error}`});
    }
});

// pegar contas
router.get('/accounts',auth,(req, res, next)=>{
    try{    
        const accounts = [];
        req.user.accountsFb.forEach(account=>{
            accounts.push({name: account.name,
            idAccount: account.idAccount,
            photo: account.photo});
        });
        return res.status(200).json({accounts});
    }catch(error){
        return res.status(500).json({error:"erro interno no servidor"});
    }
});

// pegar paginas pelo id
router.get('/pages',auth,(req, res, next)=>{
    try{
        const {token, idAccountFb} = req.query;
        console.log('valor do token:',token);
        console.log('valor do idAccountFb:',idAccountFb);
        

        if(!token) return res.status(400).json({error:"token não informado"}); // token de autenticação
        if(!idAccountFb) return res.status(400).json({error:"idAccountFb não encontrado"}); // id da conta do facebook

        
        const pages = req.user.pages.filter(page=> page.idAccount === idAccountFb); // filtrar paginas
      
        return res.status(200).json({pages});
    }catch(error){
        console.log('error:',error);
        return res.status(500).json({error: `${error}`});
    }
    
});


module.exports = router;



