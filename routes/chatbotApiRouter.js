const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// CODDING: Modelo
const User = require('../models/userModel');
const Chatbot = require('../models/chatbotModel');

async function auth(req, res, next){
    const token = req.query.token;
    if(!token) return res.status(400).json({error: 'Token não informado'});

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(mongoose.Types.ObjectId(decoded.id));

        
        if(!user){
            return res.status(404).json({error: 'Usuario não encontrado'});
        }
        
        req.user = user; // apenas id do usuario
        next();
    }catch(error){
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({ error: "Token JWT malformado ou inválido" });
        } else if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: "Token JWT expirado" });
        } else {
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}

// 

// pegar chatbots
router.get('/',auth,async (req, res, next)=>{
    try{
        let chatbots = await Chatbot.find({user: mongoose.Types.ObjectId(req.user.id)}); // pegar chatbots do usuario autenticado

        // pegar logo da pagina do facebook e atualizar no banco de dados
        async function getPhotoAndUpdate(chatbot){
            const page = await req.user.pages.find(page=>  page.idPage === chatbot.page.page.idPage);
            if(page){ // pagina encontrada
                const url = `https://graph.facebook.com/v12.0/${page.idPage}?fields=picture&access_token=${page.accessToken}`;
                const request = await fetch(url, {method: "GET"});
                if(request.ok){ 
                    // foto da pagina do facebook encontrada
                    const response = await request.json(); 
                    const url = response.picture.data.url;

                    // atualizar logo da pagina no usuario
                    await User.findOneAndUpdate(
                        {_id: mongoose.Types.ObjectId(req.user._id),"pages.idPage": page.idPage}, 
                        {$set:{"pages.$[page].photo":url}},
                        {new: true, arrayFilters:[{"page.idPage":page.idPage}]});

                    // atualizar logo da pagina no chatbot
                    await Chatbot.findOneAndUpdate(
                        {_id: chatbot._id},
                        {$set:{"page.page.photo":url}},
                        {new: true}
                    );
                }
            }
            
        }

        let photoExpired = false;

        for(let chatbot of chatbots){
            if(chatbot.page?.page?.photo){ 
                const requestPhoto = await fetch(chatbot.page?.page?.photo, {method: "HEAD"});
                if(!requestPhoto.ok){ // foto da pagina expirada
                    photoExpired = true;
                    await getPhotoAndUpdate(chatbot); // atualizar foto da pagina
                }
            }
        }
        
        if(photoExpired === true){
            
            // pegar chatbots com a foto atualizada
            chatbots = await Chatbot.find({user: mongoose.Types.ObjectId(req.user.id)});
        }
    

        return res.status(200).json({chatbots});
    }catch(error){
        console.log(`error:`, error);
        return res.status(500).json({error: error});
    }
});

// criar chatbot
router.post('/',auth, async (req, res, next)=>{
    // buscar chatbots
    const chatbots = await Chatbot.find({user: mongoose.Types.ObjectId(req.user.id)})

    // planos
    if(req.user.plan === "Plano Básico"){
        const response = {
            "error": {
              "type": "PlanBasicError",
              "message": "Faça upgrade do seu plano para conseguir criar automações.",
              "status": 403,
              "timestamp": new Date().toISOString(),
             
            }
        }
          
        return res.status(403).json(response);
    }else if(req.user.plan === "Plano Pro"){
        console.log('quantidade de chatbots encontrados:', chatbots.length);
        if(chatbots.length>=3){
            
            const response = {
                "error": {
                  "type": "PlanProError",
                  "message": "Limite de 3 automações atingido. Faça upgrade do seu plano para avançado.",
                  "status": 403,
                  "timestamp": new Date().toISOString(),
                 
                }
            }
          
            
            return res.status(403).json(response);
        }
    }else if(req.user.plan === "Plano Avançado"){
        if(chatbots.length >= 10){
            const response = {
                "error": {
                  "type": "PlanAdvancedError",
                  "message": "Limite de 10 automações atingido.",
                  "status": 403,
                  "timestamp": new Date().toISOString(),
                 
                }
            }

            return res.status(403).json(response);
        }
    }else{
        return res.status(404).json({type: "PlanNotFound",message:`Nenhum plano de assinatura encontrado.`});
    }
    
    const chatbot = new Chatbot({user: mongoose.Types.ObjectId(req.user.id)});
    await chatbot.save();

    return res.status(200).json({message:'chatbot criado', chatbot});
})

// alterar chatbot
router.put('/:id',auth, async (req, res, next)=>{
    try{
        const chatbotId = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(chatbotId)){ // id do chatbot inválido
            return res.status(400).json({ error: 'ID fornecido é inválido.' });
        }

        const chatbot = await Chatbot.findById(mongoose.Types.ObjectId(chatbotId)); 
        if(!chatbot){ // chatbot não encontrado
            return res.status(404).json({error:`Nenhuma automação encontrada com o ID fornecido.`});
        } 

        // verificando autenticidade do usuario em relação ao chatbot
        if(!mongoose.Types.ObjectId(chatbot.user).equals(mongoose.Types.ObjectId(req.user.id))){
            return res.status(401).json({error:`Você não tem permissão para realizar alteração nessa automação.`});
        }

        const body = req.body;
        const updateObject = {};
        const updateKeys = [];

        
        // alterar nome do chatbot
        if(body.name && body.name !== chatbot.name) updateObject.name = body.name;
        
        // alterar status do chatbot
        if(body.status && body.status !== chatbot.status && (body.status === "desligado" || body.status === "ligado")){
            updateObject.status = body.status;
        }

        // Função para assinar ou cancelar assinatura do webhook
        async function manageWebhookSubscription({page, subscriptionType}) {
            const idPage = page.idPage;
            const method = subscriptionType === "add" ? 'POST' : 'DELETE';
            const accessToken = subscriptionType == "add" ? page.accessToken : process.env.APP_TOKEN;
            console.log(`idPage:`, idPage);
            console.log(`method:`, method);
            console.log(`accessToken:`, accessToken);
            const url = `https://graph.facebook.com/v13.0/${idPage}/subscribed_apps?access_token=${accessToken}&subscribed_fields=messages,messaging_postbacks`; 
            const response = await fetch(url, { method });
            return response;
        } 

        // alterar pagina do facebook vinculada ao chatbot
        if(body.page?.page?.idPage && body.page?.account?.idAccount && chatbot.page?.page?.idPage !== body.page.page.idPage && chatbot.page?.account?.idAccount !== body.page.account.idAccount){
            const pageSearch = req.user.pages.filter(page => page.idPage === body.page.page.idPage);
            const accountSearch = req.user.accountsFb.filter(account=> account.idAccount === body.page.account.idAccount);
            if(pageSearch.length > 0 && accountSearch.length > 0){
                const page = pageSearch[0];
                const account = accountSearch[0];
                if(page.idAccount === account.idAccount){ // verificando autenticidade de dono da pagina do facebook 
                    // adicionar pagina da assinatura webhook
                    const requestWebhook = await manageWebhookSubscription({page: page, subscriptionType: "add"}); // remover pagina da assinatura webhook 
                    console.log('requestWebhook:', await requestWebhook.json());
    
                    updateObject.page = {page:{}, account:{}};
                    updateObject.page.page = {
                        idPage: page.idPage,
                        idAccount: page.idAccount,
                        name: page.name,
                        description: page.description,
                        photo: page.photo
                    };

                    updateObject.page.account = {
                        name: account.name,
                        idAccount: account.idAccount,
                        platform: account.platform,
                        photo: account.photo,
                        date: account.date

                    };

                    
                }
            }  
        }

        // remover pagina do facebook vinculada ao chatbot
        if(body.page && typeof body.page === "object" && Object.keys(body.page).length === 0){
            if(typeof chatbot.page?.page === "object" && Object.keys(chatbot.page?.page).length > 0 &&
                typeof chatbot.page?.account === "object" && Object.keys(chatbot.page?.account).length > 0){
                    const pageSearch = req.user.pages.filter(page => page.idPage === chatbot.page.page.idPage); // procurar pagina
                    if(pageSearch.length>0){
                        const page = pageSearch[0]; // pagina encontrada

                        // pegar todos os chatbots do usuario
                        const chatbots = await Chatbot.find({user: mongoose.Types.ObjectId(chatbot.user)});
               
                        const isChatbotFound = chatbots.some(chatbotFound =>{ // verificar se não tem nenhum chatbot com a página vinculada 
                            return chatbotFound._id.toString() !== chatbot._id.toString() && 
                                   chatbotFound.page?.page?.idPage === chatbot.page?.page?.idPage
                        }
                        );
             
                        // remover pagina da assinatura webhook
                        if(!isChatbotFound){
                            const requestWebhook = await manageWebhookSubscription({page: page, subscriptionType: "remove"}); // remover pagina da assinatura webhook 
                            console.log('requestWebhook:', await requestWebhook.json());
                        }
                        
                        
                        updateObject.page = {page:{}, account:{}};
                        
                    }
                }
        }

        if(typeof body.page?.page === "object" && Object.keys(body.page?.page).length === 0 && 
            typeof body.page?.account === "object" && Object.keys(body.page?.account).length === 0){
            if(typeof chatbot.page?.page === "object" && Object.keys(chatbot.page?.page).length > 0 &&
                typeof chatbot.page?.account === "object" && Object.keys(chatbot.page?.account).length > 0){
                    const pageSearch = req.user.pages.filter(page => page.idPage === chatbot.page.page.idPage); // procurar pagina
                    if(pageSearch.length>0){
                        const page = pageSearch[0]; // pagina encontrada
                    
                        // pegar todos os chatbots do usuario
                        const chatbots = await Chatbot.find({user: mongoose.Types.ObjectId(chatbot.user)});
               

                        const isChatbotFound = chatbots.some(chatbotFound => {  // verificar se não tem nenhum chatbot com a página vinculada
                            return chatbotFound._id.toString() !== chatbot._id.toString() && 
                                chatbotFound.page?.page?.idPage === chatbot.page?.page?.idPage
                            }
                        );

                        // remover pagina da assinatura webhook
                        if(!isChatbotFound){
                            const requestWebhook = await manageWebhookSubscription({page: page, subscriptionType: "remove"}); // remover pagina da assinatura webhook
                            console.log('requestWebhook:', await requestWebhook.json());
                        }
                        
                        updateObject.page = {page:{}, account:{}};
                        
                    }
                }    
        }

       

       
        // CODDING: alterar trigger
        if(body.trigger && chatbot.flowchart.trigger){
            // alterar type
            if(body.trigger.type && chatbot.flowchart.trigger.type && body.trigger.type !== chatbot.flowchart.trigger.type && ["message","comment"].includes(body.trigger.type)){
                if(!Object.keys(updateObject).includes('flowchart')) updateObject.flowchart = chatbot.flowchart; // adicionar chatbot na atualização

                updateObject.flowchart.trigger.type = body.trigger.type;
                updateKeys.push(`flowchart.trigger.type`);
            }

            // alterar todo conteúdo de keyword
            if(body.trigger.keyword && typeof body.trigger.keyword === "string"){
                if(!Object.keys(updateObject).includes('flowchart')) updateObject.flowchart = chatbot.flowchart; // adicionar chatbot na atualização

                updateObject.flowchart.trigger.keyword = body.trigger.keyword;
                updateKeys.push("flowchart.trigger.keyword");
            }

            // alterar todo conteúdo de negativeKeyword
            if(body.trigger.negativeKeyword && typeof body.trigger.negativeKeyword === "string"){
                if(!Object.keys(updateObject).includes('flowchart')) updateObject.flowchart = chatbot.flowchart; // adicionar chatbot na atualização

                updateObject.flowchart.trigger.negativeKeyword = body.trigger.negativeKeyword;
                updateKeys.push("flowchart.trigger.negativeKeyword");
            }

            // adicionar palavra keyword usando "addKeyword"
            if(Array.isArray(body.trigger.addKeyword)){
                // palavras-chaves do banco de dados(mongodb)
                const keywordsInMongoDB = (chatbot.flowchart.trigger.keyword ? chatbot.flowchart.trigger.keyword:"").split(',').map(keyword=>keyword.trim().toUpperCase()).filter(keyword=>keyword.length>0);

                // novas palavras-chaves para adicionar
                const newKeywords = body.trigger.addKeyword.map(keyword=>keyword.trim().toUpperCase()).filter(keyword=>(keyword.length>0 && !keywordsInMongoDB.includes(keyword)));

                if(newKeywords.length>0){ // adicionar novas palavras chaves
                    if(!Object.keys(updateObject).includes('flowchart')) updateObject.flowchart = chatbot.flowchart; // adicionar chatbot na atualização
                    
                    updateObject.flowchart.trigger.keyword = keywordsInMongoDB.map(keyword=>keyword.toLowerCase()).join(', ')+", "+newKeywords.map(keyword=>keyword.toLowerCase()).join(', ');
                    updateKeys.push("flowchart.trigger.addKeyword");
                }
            }

            // remover palavra keyword usando "removeKeyword"
            if(Array.isArray(body.trigger.removeKeyword)){
                // palavras-chaves do banco de dados(MongoDB)
                const keywordsInMongoDB = (chatbot.flowchart.trigger.keyword ? chatbot.flowchart.trigger.keyword:"").split(',').map(keyword=>keyword.trim().toUpperCase()).filter(keyword=>keyword.length>0);
                
                // palavras-chaves pra remover
                const removeKeywords = body.trigger.removeKeyword.map(keyword=>keyword.trim().toUpperCase()).filter(keyword=>(keyword.length>0 && keywordsInMongoDB.includes(keyword)));

                if(removeKeywords.length>0){
                    if(!Object.keys(updateObject).includes('flowchart')) updateObject.flowchart = chatbot.flowchart; // adicionar chatbot na atualização
                
                    updateObject.flowchart.trigger.keyword = keywordsInMongoDB.filter(keyword=>!removeKeywords.includes(keyword)).map(keyword=>keyword.toLowerCase()).join(', ');
                    updateKeys.push("flowchart.trigger.removeKeyword");
                }
            }

            // adicionar palavra negativeKeyword usando "addNegativeKeyword"
            if(Array.isArray(body.trigger.addNegativeKeyword)){
                // palavras-chaves do banco de dados(MongoDB)
                const negativeKeywordInMongoDB = (chatbot.flowchart.trigger.negativeKeyword ?chatbot.flowchart.trigger.negativeKeyword : "").split(',').map(keyword=>keyword.trim().toUpperCase()).filter(keyword=>keyword.length>0);


                // palavras-chaves para adicionar em negativeKeyword
                const addNegativeKeywords = body.trigger.addNegativeKeyword.map(keyword=> keyword.trim().toUpperCase()).filter(keyword=> (keyword.length>0 && !negativeKeywordInMongoDB.includes(keyword))).map(keyword=>keyword.toLowerCase());
                if(addNegativeKeywords.length>0){
                    if(!Object.keys(updateObject).includes('flowchart')) updateObject.flowchart = chatbot.flowchart; // adicionar chatbot na atualização

                    updateObject.flowchart.trigger.negativeKeyword = (negativeKeywordInMongoDB.length > 0 ? negativeKeywordInMongoDB.map(keyword=>keyword.toLowerCase()).join(', ')+", ":"")+addNegativeKeywords.join(', ');
                    updateKeys.push('flowchart.trigger.negativeKeyword');
                }
            }

            // remover palavra de negativeKeyword usando "removeNegativeKeyword"
            if(Array.isArray(body.trigger.removeNegativeKeyword)){
                // palavras-chaves do banco de dados(MongoDB)
                const negativeKeywordInMongoDB = (chatbot.flowchart.trigger.negativeKeyword ?chatbot.flowchart.trigger.negativeKeyword : "").split(',').map(keyword=>keyword.trim().toUpperCase()).filter(keyword=>keyword.length>0);

                // palavras-chaves para adicionar em negativeKeyword
                const removeNegativeKeywords = body.trigger.removeNegativeKeyword.map(keyword=> keyword.trim().toUpperCase()).filter(keyword=> (keyword.length>0 && negativeKeywordInMongoDB.includes(keyword)));
                
                if(removeNegativeKeywords.length>0){
                    if(!Object.keys(updateObject).includes('flowchart')) updateObject.flowchart = chatbot.flowchart; // adicionar chatbot na atualização

                    updateObject.flowchart.trigger.negativeKeyword = negativeKeywordInMongoDB.filter(keyword=>!removeNegativeKeywords.includes(keyword)).map(keyword=>keyword.toLowerCase()).join(', ');
                    updateKeys.push('flowchart.trigger.negativeKeyword');
                }
            }

            // alterar postId
            if(body.trigger.postId !== chatbot.flowchart.trigger.postId){
                if(!Object.keys(updateObject).includes('flowchart')) updateObject.flowchart = chatbot.flowchart; // adicionar chatbot na atualização

                updateObject.flowchart.trigger.postId = body.trigger.postId;
                updateKeys.push('flowchart.trigger.postId');
            }


        }

        // CODDING: Alterar fluxograma/flowchart
        if(body.flowchart){
            // Função para gerar ID único para o children
            function generateChildrenId(){
                const children = chatbot.flowchart.children[0];
              
                let childrensIds = [];
                function getChildrenId({children}){
                    
                    if(children.id){
                        childrensIds.push(children.id);
                    };

                    if(children.type === "card" && children.content?.elements?.length){
                        for(const element of children.content.elements){
                            if(element.buttons?.length){
                                for(const button of element.buttons){
                                    if(button.type === "postback" && button.children?.length){
                                        getChildrenId({children: button.children[0]});
                                    }
                                }
                            }
                        }
                    }

                    if(children.type === "message" && children.buttons?.length){
                        for(const button of children.buttons){
                            if(button.type === "postback" && button.children?.length){
                                getChildrenId({children: button.children[0]});
                            }
                        }
                    }

                    if(children.children?.length){
                        getChildrenId({children: children.children[0]});
                    }
                }
                if(children){
                    getChildrenId({children: children});
                }
                

                let number = 0;
                while(childrensIds.includes(`children-${number.toString().padStart(2,"0")}`)){
                    number++;
                }
                return `children-${number.toString().padStart(2,"0")}`;
            }

            // Função para gerar um IDs único para um botão que não corresponda a nenhum dos IDs existentes 
            function generateButtonId({buttons}){
               
                // criar lista dos IDS válidos dos botões 
                const buttonsIds = buttons
                .map(button => button.id) // Extrai os IDs de cada botão
                .filter(id => id); // Filtra e remove qualquer ID falso ou vazio

                let number = 0;

                // Gera um novo ID até encontrar um que não esteja na lista de IDs existentes
                while (buttonsIds.includes(`button-${number.toString().padStart(2, "0")}`)) {
                    number++;
                }

                // Retorna o ID único gerado
                return `button-${number.toString().padStart(2, "0")}`;
                
            }

            // Função para gerar um IDs único para um elemento que não corresponda a nenhum dos IDs existentes 
            function generateElementId({elements}){
               
                // criar lista dos IDS válidos dos botões 
                const elementsIds = elements
                .map(element => element.id) // Extrai os IDs de cada elemento
                .filter(id => id); // Filtra e remove qualquer ID falso ou vazio

                let number = 0;

                // Gera um novo ID até encontrar um que não esteja na lista de IDs existentes
                while (elementsIds.includes(`element-${number.toString().padStart(2, "0")}`)) {
                    number++;
                }

                // Retorna o ID único gerado
                return `element-${number.toString().padStart(2, "0")}`;
                
            }

            // Estruturar children antes de adiciona-lo no flowchart
            function structureChildren({children, addNewId=true}){
                console.log('function @structureChildren, valor de children:', children, 'valor de addNewId:', addNewId);
                if(addNewId){
                    console.log("antes de executar a função: generateChildrenId()")
                    children.id = generateChildrenId([]);
                    console.log("antes de executar a função: generateChildrenId()")
                    
                    console.log('valor do novo ID gerado:', children.id)
                }

                if(children.type === "message" && children.content && typeof children.content === "string"){
                   
                    let childrenData = {
                        id: children.id, 
                        type: children.type,
                        content: children.content
                    };
                    console.log('valor de childrenData inicial para criar mensagem do tipo "message":',childrenData);

                    // Adicionar delay
                    if(children.delay && isObject(children.delay) && children.delay.seconds && parseInt(children.delay.seconds)){
                        childrenData.delay = {seconds: children.delay.seconds};
                    }

                    // Adicionar botões
                    if (children.buttons && Array.isArray(children.buttons) && children.buttons.length) {
                        // Filtrar botões 
                        const buttonsFound = children.buttons.filter(button =>
                            (button.type === "web_url" && button.title && typeof button.title === "string" && button.url && typeof button.url === "string") ||
                            (button.type === "postback" && button.title && typeof button.title === "string" && button.children && Array.isArray(button.children) && button.children.length)
                        ).map((button, index) => {
                            let buttonData = { id: `button-${index.toString().padStart(2, "0")}`, type: button.type, title: button.title };
                            if (button.type === "web_url") {
                                buttonData.url = button.url;
                            } else if (button.type === "postback") {
                                const { status, children: childrenStructured } = structureChildren({ children: button.children[0] });
                                if (status) {
                                    const payload = `${buttonData.id}-${Date.now().toString(32)}-${Math.random().toString(32).slice(2)}-${Math.random().toString(32).slice(2)}`;
                                    buttonData.payload = payload;
                                    buttonData.children = [childrenStructured];
                                }
                            }
                            return buttonData;
                        });
        
                        // Adicionar botões encontrados
                        if (buttonsFound.length) { 
                            childrenData.buttons = buttonsFound;
                        }
                    }

                    // Adicionar children
                    if(children.children && Array.isArray(children.children) && children.children.length){
                        const {status, children: childrenStructured} = structureChildren({children: children.children[0]});
                        if(status){
                            childrenData.children = [];
                            childrenData.children.push(childrenStructured);
                        }
                    }

                    return {status: true, children: childrenData};
                }
                if(children.type === "card" && children.content && isObject(children.content) && children.content.elements && Array.isArray(children.content.elements) && children.content.elements.length) {
                    let childrenValidated = false;
                    let childrenData = {
                        id: children.id,
                        type: children.type,
                    };

                    // Adicionar delay
                    if(children.delay && isObject(children.delay) && children.delay.seconds && parseInt(children.delay.seconds)){
                        childrenData.delay = {seconds: children.delay.seconds};
                    }

                    // Lista de IDs dos elementos
                    let elementIds = [];

                    // Filtrar elementos encontrados
                    const elementsFound = children.content.elements.filter(element =>
                        element.title && typeof element.title === "string" &&
                        element.subtitle && typeof element.subtitle === "string" &&
                        element.image_url && typeof element.image_url === "string"
                    ).map(element => {
                        const elementData = { // Criar elemento
                            title: element.title,
                            subtitle: element.subtitle,
                            image_url: element.image_url,
                            id: generateElementId({ elements: elementIds })
                        };
                        elementIds.push(elementData.id); // Adicionar ID na lista

                        // Adicionar botões
                        if (element.buttons && Array.isArray(element.buttons) && element.buttons.length) {
                            // Filtrar botões 
                            const buttonsFound = element.buttons.filter(button =>
                                (button.type === "web_url" && button.title && typeof button.title === "string" && button.url && typeof button.url === "string") ||
                                (button.type === "postback" && button.title && typeof button.title === "string" && button.children && Array.isArray(button.children) && button.children.length)
                            ).map((button, index) => {
                                let buttonData = { id: `button-${index.toString().padStart(2, "0")}`, type: button.type, title: button.title };
                                if (button.type === "web_url") {
                                    buttonData.url = button.url;
                                } else if (button.type === "postback") {
                                    const { status, children: childrenStructured } = structureChildren({ children: button.children[0] });
                                    if (status) {
                                        const payload = `${buttonData.id}-${Date.now().toString(32)}-${Math.random().toString(32).slice(2)}-${Math.random().toString(32).slice(2)}`;
                                        buttonData.payload = payload;
                                        buttonData.children = [childrenStructured];
                                    }
                                }
                                return buttonData;
                            });
            
                            // Adicionar botões encontrados
                            if (buttonsFound.length) { 
                                elementData.buttons = buttonsFound;
                            }
                        }
                       

                        
                        return elementData;
                    });
                    
                    // Elementos encontrados
                    if(elementsFound.length){ 
                        childrenValidated = true;
                        childrenData.content = {};
                        childrenData.content.elements = elementsFound;
                    }

                    // Adicionar children
                    if(children.children && Array.isArray(children.children) && children.children.length){
                        const {status, children: childrenStructured} = structureChildren({children: children.children[0]});
                        if(status){
                            childrenData.children = [];
                            childrenData.children.push(childrenStructured);
                        }
                    }

                    if(childrenValidated){
                        return {status: true, children: childrenData};
                    }
                }
                if(children.type === "audio" && children.audio && isObject(children.audio) && children.audio.audio_url && typeof children.audio.audio_url === "string"){
                    let childrenData = {
                        id: children.id, 
                        type: children.type,
                        audio:{audio_url:children.audio.audio_url}
                    }

                    // Adicionar delay
                    if(children.delay && isObject(children.delay) && children.delay.seconds && parseInt(children.delay.seconds)){
                        childrenData.delay = {seconds: children.delay.seconds};
                    }

                    // Adicionar children
                    if(children.children && Array.isArray(children.children) && children.children.length){
                        const {status, children: childrenStructured} = structureChildren({children: children.children[0]});
                        if(status){
                            childrenData.children = [];
                            childrenData.children.push(childrenStructured);
                        }
                    }

                    return {status: true, children: childrenData};

                    
                }
                if(children.type === "image" && children.image && isObject(children.image) && children.image.image_url && typeof children.image.image_url === "string"){
                    let childrenData = {
                        id: children.id, 
                        type: children.type,
                        image:{image_url:children.image.image_url}
                    }

                    // Adicionar delay
                    if(children.delay && isObject(children.delay) && children.delay.seconds && parseInt(children.delay.seconds)){
                        childrenData.delay = {seconds: children.delay.seconds};
                    }

                    // Adicionar children
                    if(children.children && Array.isArray(children.children) && children.children.length){
                        const {status, children: childrenStructured} = structureChildren({children: children.children[0]});
                        if(status){
                            childrenData.children = [];
                            childrenData.children.push(childrenStructured);
                        }
                    }

                    return {status: true, children: childrenData};
                }
                if(children.type === "video" && children.video && isObject(children.video) && children.video.video_url && typeof children.video.video_url === "string"){
                    let childrenData = {
                        id: children.id, 
                        type: children.type,
                        video:{video_url:children.video.video_url}
                    }

                    // Adicionar delay
                    if(children.delay && isObject(children.delay) && children.delay.seconds && parseInt(children.delay.seconds)){
                        childrenData.delay = {seconds: children.delay.seconds};
                    }

                    // Adicionar children
                    if(children.children && Array.isArray(children.children) && children.children.length){
                        const {status, children: childrenStructured} = structureChildren({children: children.children[0]});
                        if(status){
                            childrenData.children = [];
                            childrenData.children.push(childrenStructured);
                        }
                    }

                    return {status: true, children: childrenData};
                }
                if(children.type === "file" && children.file && isObject(children.file) && children.file.file_url && typeof children.file.file_url === "string"){
                    let childrenData = {
                        id: children.id, 
                        type: children.type,
                        file:{file_url:children.file.file_url}
                    }

                    // Adicionar delay
                    if(children.delay && isObject(children.delay) && children.delay.seconds && parseInt(children.delay.seconds)){
                        childrenData.delay = {seconds: children.delay.seconds};
                    }

                    // Adicionar children
                    if(children.children && Array.isArray(children.children) && children.children.length){
                        const {status, children: childrenStructured} = structureChildren({children: children.children[0]});
                        if(status){
                            childrenData.children = [];
                            childrenData.children.push(childrenStructured);
                        }
                    }

                    return {status: true, children: childrenData};
                }  
                
                return  {status: false, children: {}};
            }

            // Remover children pelo ID
            function removeChildren(children, childrenId) {
                let childrenChanged = false;

                // Children
                if(children.children && Array.isArray(children.children) && children.children.length){
                    children.children = children.children.filter(child => {
                        if (child.id === childrenId) {
                            childrenChanged = true;
                           
                            return false; // Remove o children com o ID correspondente
                        } else {
                            // Verificar botões dos elementos
                            if(child.type === "card" && child.content && isObject(child.content) && child.content.elements && Array.isArray(child.content.elements) && child.content.elements.length){
                                for(const element of child.content.elements){
                                    if(element.buttons && Array.isArray(element.buttons) && element.buttons.length){
                                        element.buttons = element.buttons.filter(button=>{
                                            if(button.type === "postback" && button.children && Array.isArray(button.children) && button.children.length){
                                                console.log(`button do elemento ${element.title} encontrado:`, button);
                                                
                                                const { status, children: updateChildren } = removeChildren(button, childrenId);
                                               
                                                if(status){

                                                    childrenChanged = true;
                                                    button.children = updateChildren.children;
                                                    return false;
                                                };
                                            }

                                            return true;
                                        })

                                       
                                    }
                                }
                            }

                             // Verifica se o children atual tem botões
                            if (child.buttons && Array.isArray(child.buttons) && child.buttons.length > 0) {
                                child.buttons = child.buttons.filter(button=>{
                                    
                                    if (button.type === "postback" && button.children && Array.isArray(button.children) && button.children.length > 0) {
                                      
                                        // Chama recursivamente a função para remover os filhos do botão
                                        const { status, children: updateChildren } = removeChildren(button, childrenId);
                                        if( status ){
                                            childrenChanged = true;
                                            button.children = updateChildren.children;
                                            return false;
                                        }
                                    }

                                    return true;
                                });
                               
                            }  

                            if (child.children && Array.isArray(child.children) && child.children.length > 0) {
                                // Se o children atual tiver filhos, chama recursivamente a função para removê-los
                                const { status, children: updateChildren } = removeChildren(child, childrenId);
                                if(status){
                                    childrenChanged = true;
                                    child.children = updateChildren.children;
                                    console.log('childrenChanged:',childrenChanged);
                                }
                            }
                            return true; // Mantém o children
                        }
                    });
                }
                
            
                return {status: childrenChanged, children: children};
            }

            // função pra procurar children de forma recursiva usando um "id" como referência
            function search({children,searchId}){
                
                if(children.id === searchId){
                    return children;
                };

                if(children.type === "card" && children.content?.elements?.length > 0){
                    for(const element of children.content.elements){
                        if(element.buttons?.length > 0){
                            for(const button of element.buttons){
                                if(button.type === "postback" && button.children?.length > 0){
                                    const childrenFound = search({children: button.children[0], searchId: searchId});
                                    if(childrenFound){
                                        return childrenFound;
                                    }
                                }
                            }
                        }
                    }
                }

                if(children.type === "message" && children.buttons?.length > 0){
                    for(const button of children.buttons){
                        if(button.children?.length > 0){
                            const childrenFound = search({children: button.children[0], searchId: searchId})
                            if(childrenFound){
                                return childrenFound;
                            }
                        }
                    }
                    
                }

                if(children.children?.length > 0){
                    const childrenFound = search({children: children.children[0], searchId: searchId})
                    if(childrenFound){
                        return childrenFound;
                    }
                }


            }

            // Verifica se o valor passado como argumento é um objeto
            function isObject(value) { 
                return Object.prototype.toString.call(value) === '[object Object]';
            }

            // Adicionar primeiro "children" no flowchart
            if(body.flowchart.addFirstChildren && Array.isArray(body.flowchart.addFirstChildren) && body.flowchart.addFirstChildren.length && isObject(body.flowchart.addFirstChildren[0])){
                if(!chatbot.flowchart.children.length){
                    const {status, children: childrenStructured} = structureChildren({children: body.flowchart.addFirstChildren[0]});
                    if(status){
                        chatbot.flowchart.children.push(childrenStructured);
                        updateKeys.push('@addFirstChildren children.children');
                        updateObject.flowchart = chatbot.flowchart;
                    }
                }
                
            }

            if(body.flowchart.search){
                // atribuindo referência ao children encontrado
                const children = search({children: chatbot.flowchart.children[0], searchId: body.flowchart.search}); // encontrar children
                
                if(children){ // children encontrado
                    // Remover children
                    if(body.flowchart.remove && typeof body.flowchart.remove === "boolean" && body.flowchart.remove === true){
                        const {status, children: updateChildren} = removeChildren({children: chatbot.flowchart.children}, body.flowchart.search);
                        if(status){
                            updateKeys.push('@childrenRemoved children.children');
                            updateObject.flowchart = {trigger: chatbot.flowchart.trigger, children:updateChildren.children};

                        }
                    } 

                    // Alterar flowchart
                    if(body.flowchart.change && body.flowchart.change.type && !body.flowchart.remove){
                        
                        if(body.flowchart.change.type !== children.type){ // Alterar todo o children para outro tipo [message, card, audio, image, file]
                            let hasChanged = false;

                            // Limpar campos do children para adicionar mudança
                            function clearChildren({children}){
                                if(children.type === "card"){
                                    delete children.content;
                                    
                                }

                                if(children.type === "audio"){
                                    delete children.audio;
                                }
                                if(children.type === "video"){
                                    delete children.video;
                                }
                                if(children.type === "image"){
                                    delete children.image;
                                }
                                if(children.type === "file"){
                                    delete children.file;
                                }

                                if(children.type === "message"){
                                    delete children.content;
                                    delete children.buttons;
                                    
                                }

                                
                            }
                            clearChildren({children: children});
                            
                            if(body.flowchart.change.type === "message" && body.flowchart.change.content && typeof body.flowchart.change.content === "string" && body.flowchart.change.content.length >0){
                                // type
                                children.type = "message";
                                updateKeys.push('children.type');

                                // content
                                children.content = body.flowchart.change.content;
                                updateKeys.push(`children.content`);

                                // delay
                                if(body.flowchart.change.delay && isObject(body.flowchart.change.delay) && body.flowchart.change.delay.seconds && parseInt(body.flowchart.change.delay.seconds)){
                                    children.delay = {seconds: body.flowchart.change.delay.seconds};
                                    updateKeys.push('children.delay');
                                }

                            
                                if(!children.buttons) children.buttons = [];
                                if(!children.children) children.children = [];

                                // adicionar botão
                                if(body.flowchart.change.buttons?.length > 0){
                                    for(const button of body.flowchart.change.buttons){
                                        

                                        if(button.type === "web_url" && button.title && button.url){
                                            if(!updateKeys.includes("children.buttons")) updateKeys.push("children.buttons");
                                            children.buttons.push(button);
                                        }

                                        if(button.type === "postback" && button.title && button.payload && button.children?.length > 0){
                                            if(!updateKeys.includes("children.buttons")) updateKeys.push("children.buttons");
                                            children.buttons.push(button);
                                        }
                                    }
                                }

                                // adicionar children/filho
                                if(body.flowchart.change.children?.length > 0){
                                    updateKeys.push("children.children");

                                    
                                    children.children.push(body.flowchart.change.children[0]);
                                }

                                updateObject.flowchart = chatbot.flowchart;
                            }

                            if(body.flowchart.change.type === "card" && body.flowchart.change.content && isObject(body.flowchart.change.content) && body.flowchart.change.content.elements && Array.isArray(body.flowchart.change.content.elements) && body.flowchart.change.content.elements.length){
                                children.type = "card";
                                children.content = {};
                                children.content.elements = [];
                                if(!children.children) children.children = [];

                                // delay
                                if(body.flowchart.change.delay && isObject(body.flowchart.change.delay) && body.flowchart.change.delay.seconds && parseInt(body.flowchart.change.delay.seconds)){
                                    children.delay = {seconds: body.flowchart.change.delay.seconds};
                                    updateKeys.push('children.delay');
                                }

                                // adicionar elementos
                                for(const [index,element] of body.flowchart.change.content.elements.entries()){
                                    if(element.title && element.subtitle && element.image_url){
                                        // Estruturar elemento
                                        const newElement = {
                                            id:`element-${index.toString().padStart(2,'0')}`,
                                            title: element.title,
                                            subtitle: element.subtitle,
                                            image_url: element.image_url
                                        };

                                        // Adicionar botões no elemento
                                        if(element.buttons && Array.isArray(element.buttons) && element.buttons.length){
                                            newElement.buttons = [];
                                            for(const [index, button] of element.buttons.entries()){
                                                if(button.type === "web_url" && button.title && button.url){
                                                    if(!updateKeys.includes("children.buttons")) updateKeys.push("children.buttons");
                                                    newElement.buttons.push({id: `button-${index.toString().padStart(2,"0")}`, type: button.type, title: button.title, url: button.url});
                                                }
                                                
                                                if(button.type === "postback" && button.title && button.children){
                                                    if(!updateKeys.includes("children.buttons")) updateKeys.push("children.buttons");
                                                    button.payload = `${`button-${index.toString().padStart(2,"0")}`}-${Date.now().toString(32)}-${Math.random().toString(32).slice(2)}-${Math.random().toString(32).slice(2)}`;

                                                    // criar ID único pra o elemento filho associado ao botão
                                                    const parentChildren = button.children[0];
                                                    parentChildren.id = generateChildrenId();
                                                    parentChildren.children = [];

                                                    newElement.buttons.push({id: `button-${index.toString().padStart(2,"0")}`, type: button.type, title: button.title, payload: button.payload, children: [parentChildren]});
                                                }
                                            }
                                        }else{ // nenhum botão
                                            newElement.buttons = [];
                                        }

                                        // adicionar elemento 
                                        children.content.elements.push(newElement);
                                    }
                                }

                                // Adicionar children
                                let isChildrenChanged = false;
                                if(body.flowchart.change.children && Array.isArray(body.flowchart.change.children) && body.flowchart.change.children.length && isObject(body.flowchart.change.children[0])){
                                    isChildrenChanged = true;
                                    let parentChildren = body.flowchart.change.children[0];

                                    // Função para obter lista de IDs de todos os childrens
                                    function getChildrensIds({children}){
                                        const lista = [];
                                        function getChildrenId({children}){
                                            if(children.id) lista.push(children.id);
    
                                            if(children.type === "card" && children.content?.elements?.length){
                                                for(const element of children.content.elements){
                                                    if(element.buttons?.length){
                                                        for(const button of element.buttons){
                                                            if(button.type === "postback" && button.children?.length){
                                                                getChildrenId({children: button.children[0], lista: lista});
                                                            }
                                                        }
                                                    }
                                                }
                                            }
    
                                            if(children.type === "message" && children.buttons?.length){
                                                for(const button of children.buttons){
                                                    if(button.type === "postback" && button.children?.length){
                                                        getChildrenId({children: button.children[0], lista: lista});
                                                    }
                                                }
                                            }
    
                                            if(children.children?.length){
                                                getChildrenId({children: children.children[0], lista: lista});
                                            }
                                        }
                                        getChildrenId({children: children});
                                        return lista;
                                    }

                                    // Obter lista de IDs de childrens
                                    const childrensIds = getChildrensIds({children: chatbot.flowchart.children[0]}); // ["children-00","children-01",...]

                                    // Função para criar um novo ID único que não corresponda a nenhum dos IDs existentes
                                    function generateChildrenId({childrensIds}){
                                        let numberChildren = 0;
                                        let childrenId = `children-${numberChildren.toString().padStart(3,"0")}`;
                                        while(childrensIds.includes(childrenId)){
                                            numberChildren++;
                                            childrenId = `children-${numberChildren.toString().padStart(3,"0")}`;
                                        }
                                        return childrenId;
                                    }

                                    // Criar um novo ID único
                                    parentChildren.id = generateChildrenId({childrensIds: childrensIds})
                                    
                              
                                    children.children.push(parentChildren);
                                }

                                if(children.content.elements.length){ // Alteração realizada
                                    updateKeys.push('children.type');
                                    updateKeys.push('children.content');
                                    if(isChildrenChanged) updateKeys.push('children.children');
                                    
                                    updateObject.flowchart = chatbot.flowchart;
                                }
                            }

                            if(body.flowchart.change.type === "audio" && body.flowchart.change.audio && isObject(body.flowchart.change.audio) && body.flowchart.change.audio.audio_url && typeof body.flowchart.change.audio.audio_url === "string"){
                                // delay
                                if(body.flowchart.change.delay && isObject(body.flowchart.change.delay) && body.flowchart.change.delay.seconds && parseInt(body.flowchart.change.delay.seconds)){
                                    children.delay = {seconds: body.flowchart.change.delay.seconds};
                                    updateKeys.push('children.delay');
                                }
                                
                                children.type = "audio";
                                children.audio = {audio_url: body.flowchart.change.audio.audio_url};
                                if(!children.children) children.children = [];
                                updateKeys.push('children.audio');
                                hasChanged = true;
                            }

                            if(body.flowchart.change.type === "video" && body.flowchart.change.video && isObject(body.flowchart.change.video) && body.flowchart.change.video.video_url && typeof body.flowchart.change.video.video_url === "string"){
                                // delay
                                if(body.flowchart.change.delay && isObject(body.flowchart.change.delay) && body.flowchart.change.delay.seconds && parseInt(body.flowchart.change.delay.seconds)){
                                    children.delay = {seconds: body.flowchart.change.delay.seconds};
                                    updateKeys.push('children.delay');
                                }
                                
                                children.type = "video";
                                children.video = {video_url: body.flowchart.change.video.video_url};
                                if(!children.children) children.children = [];
                                updateKeys.push('children.video');
                                hasChanged = true;
                            }
                            
                            if(body.flowchart.change.type === "image" && body.flowchart.change.image && isObject(body.flowchart.change.image) && body.flowchart.change.image.image_url && typeof body.flowchart.change.image.image_url === "string"){
                                // delay
                                if(body.flowchart.change.delay && isObject(body.flowchart.change.delay) && body.flowchart.change.delay.seconds && parseInt(body.flowchart.change.delay.seconds)){
                                    children.delay = {seconds: body.flowchart.change.delay.seconds};
                                    updateKeys.push('children.delay');
                                }
                                
                                children.type = "image";
                                children.image = {image_url: body.flowchart.change.image.image_url};
                                if(!children.children) children.children = [];
                                updateKeys.push('children.image');
                                hasChanged = true;
                            }

                            if(body.flowchart.change.type === "file" && body.flowchart.change.file && isObject(body.flowchart.change.file) && body.flowchart.change.file.file_url && typeof body.flowchart.change.file.file_url === "string"){
                                // delay
                                if(body.flowchart.change.delay && isObject(body.flowchart.change.delay) && body.flowchart.change.delay.seconds && parseInt(body.flowchart.change.delay.seconds)){
                                    children.delay = {seconds: body.flowchart.change.delay.seconds};
                                    updateKeys.push('children.delay');
                                }
                                
                                children.type = "file";
                                children.file = {file_url: body.flowchart.change.file.file_url};
                                if(!children.children) children.children = [];
                                updateKeys.push('children.file');
                                hasChanged = true;
                            }


                            if(hasChanged){
                                updateKeys.push('@typeChanged children.type');
                                updateObject.flowchart = chatbot.flowchart;
                            }
                        }else{  // Altera apenas campos específicos do children [button, children, content]
                            // Editar mensagem
                            if(body.flowchart.change.type === "message"){
                                let hasChanged = false;

                                // Adicionar delay
                                if(body.flowchart.change.delay && isObject(body.flowchart.change.delay) && body.flowchart.change.delay.seconds && parseInt(body.flowchart.change.delay.seconds)){
                                    children.delay = {seconds: body.flowchart.change.delay.seconds};
                                    updateKeys.push('children.delay');
                                    hasChanged = true;
                                }

                                // Remover delay
                                if(children.delay && body.flowchart.change.removeDelay && typeof body.flowchart.change.removeDelay === "boolean" && body.flowchart.change.removeDelay){
                                    delete children.delay;
                                    updateKeys.push('children.delay');
                                    hasChanged = true;
                                }

                                // Alterar conteudo 
                                if(body.flowchart.change.content && typeof body.flowchart.change.content === "string" && body.flowchart.change.content.length > 0 && body.flowchart.change.content !== children.content){
                                    if(!hasChanged) hasChanged = true;

                                    children.content = body.flowchart.change.content;
                                    updateKeys.push(`children.content`);
                                }

                                // Remover todos botões
                                if(body.flowchart.change.buttons && Array.isArray(body.flowchart.change.buttons) && !body.flowchart.change.buttons.length){
                                    if(!hasChanged) hasChanged = true;
                                    
                                    children.buttons = [];
                                    updateKeys.push('children.buttons');
                                }

                                // Substituir botões
                                if(body.flowchart.change.buttons?.length > 0){
                                    children.buttons = [];
                                    for(const [index, button] of body.flowchart.change.buttons.entries()){

                                        if(button.type === "web_url" && button.title && button.url){
                                            if(!hasChanged) hasChanged = true;
                                            if(!updateKeys.includes("children.buttons")) updateKeys.push("children.buttons");
                                            children.buttons.push({id:`button-${index.toString().padStart(2,"0")}` ,type: button.type, title: button.title, url: button.url});
                                        }

                                        if(button.type === "postback" && button.title && button.children?.length > 0){
                                            if(!hasChanged) hasChanged = true;
                                            if(!updateKeys.includes("children.buttons")) updateKeys.push("children.buttons");
                                            button.payload = `${`button-${index.toString().padStart(2,"0")}`}-${Date.now().toString(32)}-${Math.random().toString(32).slice(2)}-${Math.random().toString(32).slice(2)}`;

                                            // criar ID único pra o elemento filho associado ao botão
                                            const parentChildren = button.children[0];
                                            parentChildren.id = generateChildrenId();
                                            parentChildren.children = [];

                                            children.buttons.push({id: `button-${index.toString().padStart(2,"0")}`, type: button.type, title: button.title, payload: button.payload, children: [parentChildren]});
                                        }
                                    }
                                }
                                
                                // Adicionar botões
                                if(body.flowchart.change.addButtons && Array.isArray(body.flowchart.change.addButtons) && body.flowchart.change.addButtons.length){
                                    if(!children.buttons) children.buttons = [];

                                    
                                    // Função para gerar um ID único para um botão que não corresponda a nenhum dos IDs existentes 
                                    function generateButtonId({buttons}){
                                        console.log(`valor de buttons dentro da função generateButtonId:`, buttons);
                                        // criar lista dos IDS válidos dos botões 
                                        const buttonsIds = buttons
                                        .map(button => button.id) // Extrai os IDs de cada botão
                                        .filter(id => id); // Filtra e remove qualquer ID falso ou vazio

                                        let number = 0;

                                        // Gera um novo ID até encontrar um que não esteja na lista de IDs existentes
                                        while (buttonsIds.includes(`button-${number.toString().padStart(2, "0")}`)) {
                                            number++;
                                        }

                                        // Retorna o ID único gerado
                                        return `button-${number.toString().padStart(2, "0")}`;
                                        
                                    }

                                    

                                    for(const button of body.flowchart.change.addButtons){
                                        button.id = generateButtonId({buttons: children.buttons});

                                        if(button.type === "web_url" && button.title && button.url){
                                            if(!hasChanged) hasChanged = true;
                                            if(!updateKeys.includes("children.buttons")) updateKeys.push("children.buttons");
                                            children.buttons.push({id: button.id, type: button.type, title: button.title, url: button.url});
                                        }

                                        if(button.type === "postback" && button.title && button.children?.length > 0){
                                            if(!hasChanged) hasChanged = true;
                                            if(!updateKeys.includes("children.buttons")) updateKeys.push("children.buttons");

                                            // Adicionar payload
                                            button.payload = `${button.id}-${Date.now().toString(32)}-${Math.random().toString(32).slice(2)}-${Math.random().toString(32).slice(2)}`;

                                            // Adicionar ID no children
                                            const parentChildren = button.children[0];
                                            parentChildren.id = generateChildrenId();
                                            parentChildren.children = [];

                                            children.buttons.push({id: button.id, type: button.type, title: button.title, payload: button.payload, children: [parentChildren]});
                                        }
                                    }
                                }

                                // Remover botão especifico
                                if(body.flowchart.change.removeButtons && Array.isArray(body.flowchart.change.removeButtons) && body.flowchart.change.removeButtons.length){
                                    for(const buttonToRemove of body.flowchart.change.removeButtons){
                                        const buttonFound = children.buttons.find(btn=>btn.id === buttonToRemove.id);
                                        if(buttonFound){
                                            if(!hasChanged) hasChanged = true;
                                            if(!updateKeys.includes("children.buttons")) updateKeys.push("children.buttons");

                                            children.buttons = children.buttons.filter(btn=>btn.id!== buttonToRemove.id);
                                        }
                                    }
                                }

                                // Remover children
                                if(body.flowchart.change.children && Array.isArray(body.flowchart.change.children) && !body.flowchart.change.children.length){
                                    if(!hasChanged) hasChanged = true;
                                    updateKeys.push("children.children");
                                    children.children = [];
                                }

                                // Alterar children
                                if(body.flowchart.change.children && Array.isArray(body.flowchart.change.children) && body.flowchart.change.children.length && isObject(body.flowchart.change.children[0])){
                                    if(!hasChanged) hasChanged = true;

                                    const {status, children: childrenStructured} = structureChildren({children: body.flowchart.change.children[0]});
                                    if(status){
                                        children.children = [];
                                        children.children.push(childrenStructured);
                                        updateKeys.push('children.children');
                                    }
                                    
                                }

                                if(hasChanged){
                                    updateObject.flowchart = chatbot.flowchart;
                                } 
                                
                            }

                            // Editar card
                            if(body.flowchart.change.type === "card"){
                                let hasChanged = false;

                                // delay
                                if(body.flowchart.change.delay && isObject(body.flowchart.change.delay) && body.flowchart.change.delay.seconds && parseInt(body.flowchart.change.delay.seconds)){
                                    children.delay = {seconds: body.flowchart.change.delay.seconds};
                                    updateKeys.push('children.delay');
                                    hasChanged = true;
                                }

                                // remover delay
                                if(children.delay && body.flowchart.change.removeDelay && typeof body.flowchart.change.removeDelay === "boolean" && body.flowchart.change.removeDelay){
                                    delete children.delay;
                                    updateKeys.push('children.delay');
                                    hasChanged = true;
                                }

                                // Remover todos os elementos
                                if(body.flowchart.change.content && isObject(body.flowchart.change.content) && body.flowchart.change.content.elements && Array.isArray(body.flowchart.change.content.elements) && !body.flowchart.change.content.elements.length){
                                    children.content.elements = [];
                                    hasChanged = true;
                                    updateKeys.push("children.content");
                                }

                                // Susbstituir elementos
                                if(body.flowchart.change.content && isObject(body.flowchart.change.content) && body.flowchart.change.content.elements && Array.isArray(body.flowchart.change.content.elements) && body.flowchart.change.content.elements.length){
                                    children.content.elements = [];

                                    // Percorrer elementos 
                                    for(const [index, element] of body.flowchart.change.content.elements.entries()){
                                        // element.title
                                        // element.subtitle
                                        // element.image_url
                                        // element.buttons

                                        if(element.title && element.subtitle && element.image_url){
                                            
                                            // Criar novo elemento
                                            const newElement = {
                                                id: `element-${index.toString().padStart(2,"0")}`,
                                                title: element.title, 
                                                subtitle: element.subtitle,
                                                image_url: element.image_url,
                                                buttons:[]
                                            }

                                            // Adicionar botões
                                            if(element.buttons?.length){ // Percorrer botões
                                                for(const [index, button] of element.buttons.entries()){
                                                    // button.type
                                                    // button.title
                                                    // button.url

                                                    if(button.type === "web_url" && button.title && button.url){
                                                        if(!updateKeys.includes("children.buttons")) updateKeys.push("children.buttons");


                                                        newElement.buttons.push({id:`button-${index.toString().padStart(2,"0")}` ,type: button.type, title: button.title, url: button.url});
                                                    }
            
                                                    if(button.type === "postback" && button.title && button.children?.length){
                                                        if(!updateKeys.includes("children.buttons")) updateKeys.push("children.buttons");
                                                        
                                                        button.payload = `${`button-${index.toString().padStart(2,"0")}`}-${Date.now().toString(32)}-${Math.random().toString(32).slice(2)}-${Math.random().toString(32).slice(2)}`;
            
                                                        // criar ID único pra o elemento filho associado ao botão
                                                        const parentChildren = button.children[0];
                                                        parentChildren.id = generateChildrenId();
                                                        parentChildren.children = [];
            
                                                        newElement.buttons.push({id: `button-${index.toString().padStart(2,"0")}`, type: button.type, title: button.title, payload: button.payload, children: [parentChildren]});
                                                    }
                                                }
                                            }

                                            // Adicionar elemento
                                            children.content.elements.push(newElement);
                                            if(!updateKeys.includes('children.content')) updateKeys.push("children.content");

                                            
                                        }
                                    }       

                                    if(children.content.elements.length){
                                        hasChanged = true;
                                    }
                                }

                                // Alterar elemento
                                if(body.flowchart.change.editElement && isObject(body.flowchart.change.editElement) && body.flowchart.change.editElement.search && typeof body.flowchart.change.editElement.search === "string" && body.flowchart.change.editElement.change && isObject(body.flowchart.change.editElement.change)){
                                    const search = body.flowchart.change.editElement.search;

                                    // procurar elemento
                                    const element = children.content.elements.find(element=> element.id === search);
                                    if(element){ // elemento encontrado
                                        let elementChanged = false;

                                        // extriar campos do elemento para mudança
                                        const { title, subtitle, image_url, buttons, addButtons, removeButtons, editButton } = body.flowchart.change.editElement.change;

                                        // Alterar titulo 
                                        if(title && typeof title === "string" && title.length){
                                            element.title = title;
                                            elementChanged = true;

                                            updateKeys.push("children.content.element.title");
                                        }

                                        // Alterar subtitulo
                                        if(subtitle && typeof subtitle === "string" && subtitle.length){
                                            element.subtitle = subtitle;
                                            elementChanged = true;

                                            updateKeys.push("children.content.element.subtitle");
                                        }

                                        // Alterar image
                                        if(image_url && typeof image_url === "string" && image_url.length){
                                            element.image_url = image_url;
                                            elementChanged = true

                                            updateKeys.push("children.content.element.image_url");
                                        }

                                        // Limpar lista de botões
                                        if(buttons && Array.isArray(buttons) && !buttons.length){
                                            element.buttons = [];
                                            elementChanged = true;
                                            updateKeys.push('children.content.element.buttons');
                                        }


                                        // Substituir buttons
                                        if(buttons && Array.isArray(buttons) && buttons.length){
                                            if(!element.buttons) element.buttons = [];
                                            const buttonsFound = [];
                                            for(const [index, button] of buttons.entries()){
                                                if(button.type === "web_url" && button.title && button.url){
                                                    buttonsFound.push({id:`button-${index.toString().padStart(2,"0")}` ,type: button.type, title: button.title, url: button.url});
                                                }
        
                                                if(button.type === "postback" && button.title && button.children?.length > 0){
                                                    button.payload = `${`button-${index.toString().padStart(2,"0")}`}-${Date.now().toString(32)}-${Math.random().toString(32).slice(2)}-${Math.random().toString(32).slice(2)}`;
        
                                                    // criar ID único pra o elemento filho associado ao botão
                                                    const parentChildren = button.children[0];
                                                    parentChildren.id = generateChildrenId();
                                                    parentChildren.children = [];
        
                                                    buttonsFound.push({id: `button-${index.toString().padStart(2,"0")}`, type: button.type, title: button.title, payload: button.payload, children: [parentChildren]});
                                                }
                                            }

                                            if(buttonsFound.length){
                                                elementChanged = true;
                                                updateKeys.push('children.content.element.buttons');

                                                element.buttons = buttonsFound;
                                            }
                                        }

                                        // Adicionar buttons
                                        if(addButtons && Array.isArray(addButtons)){
                                            if(!element.buttons) element.buttons = [];
                                            const buttonsFound = [];
                                            for(const [index, button] of addButtons.entries()){
                                                if(button.type === "web_url" && button.title && button.url){
                                                    button.id = generateButtonId({buttons: element.buttons})
                                                    buttonsFound.push({id: button.id, type: button.type, title: button.title, url: button.url});
                                                }
        
                                                if(button.type === "postback" && button.title && button.children?.length > 0){
                                                    button.id = generateButtonId({buttons: element.buttons})
                                                    button.payload = `${`button-${index.toString().padStart(2,"0")}`}-${Date.now().toString(32)}-${Math.random().toString(32).slice(2)}-${Math.random().toString(32).slice(2)}`;
        
                                                    // criar ID único pra o elemento filho associado ao botão
                                                    const parentChildren = button.children[0];
                                                    parentChildren.id = generateChildrenId();
                                                    parentChildren.children = [];
        
                                                    buttonsFound.push({id: button.id, type: button.type, title: button.title, payload: button.payload, children: [parentChildren]});
                                                }
                                            }

                                            if(buttonsFound.length){
                                                elementChanged = true;
                                                updateKeys.push("children.content.element.buttons");
                                                element.buttons.push(...buttonsFound);
                                            }
                                        }

                                        // Remover botões
                                        if(removeButtons && Array.isArray(removeButtons) && removeButtons.length && element.buttons && element.buttons.length){
                                            const removedButtons = element.buttons.filter(button=> removeButtons.some(buttonRemove=> buttonRemove.id === button.id));
                                            element.buttons = element.buttons.filter(button=> !removedButtons.some(buttonRemove=> buttonRemove.id === button.id));
                                            if(removedButtons.length){
                                                elementChanged = true;
                                                updateKeys.push('children.content.element.buttons');
                                            }
                                        }

                                        // Editar botão  
                                        if(editButton && isObject(editButton) && editButton.search && typeof editButton.search === "string" && editButton.change && isObject(editButton.change)){
                                            const buttonFound = element.buttons.find(button => button.id === editButton.search);
                                            
                                            if(buttonFound){
                                                let buttonChanged = false;
                                                const change = editButton.change;

                                                if(buttonFound.type === "web_url"){
                                                    const {url, title } = change;
                                                  
                                                    if(url && typeof url === "string"){
                                                        buttonChanged = true;

                                                        buttonFound.url = title;
                                                    }

                                                    if(title && typeof title === "string"){
                                                        buttonChanged = true;

                                                        buttonFound.title = title;
                                                    }   

                                                }

                                                if(buttonFound.type === "postback"){
                                                    const { title, children } = change;

                                                    if(title && typeof title === "string"){
                                                        buttonChanged = true;

                                                        buttonFound.title = title;
                                                    }

                                                    if(children && Array.isArray(children) && children.length && isObject(children[0]) && buttonFound.children[0].id){
                                                        buttonChanged = true;

                                                        children[0].id = buttonFound.children[0].id;
                                                        buttonFound.children = children;
                                                    }
                                                }

                                                if(buttonChanged){
                                                    
                                                    elementChanged = true;
                                                    updateKeys.push(`children.content.element.buttons`);
                                                }
                                            }
                                        }

                                        if(elementChanged){
                                            hasChanged = true;
                                            updateKeys.push('children.content');
                                        }
                                        
                                    }
                                }

                                // Adicionar elementos
                                if(body.flowchart.change.addElements && Array.isArray(body.flowchart.change.addElements) && body.flowchart.change.addElements.length){
                                    const elementsFounds = [];
                                    for(const element of body.flowchart.change.addElements){
                                        // element.title
                                        // element.subtitle
                                        // element.image_url
                                        // element.buttons

                                        if(element.title && element.subtitle && element.image_url){
                                            
                                            // Criar novo elemento
                                            const newElement = {
                                                id: generateElementId({elements: children.content.elements}),
                                                title: element.title, 
                                                subtitle: element.subtitle,
                                                image_url: element.image_url,
                                                buttons:[]
                                            }

                                            // Adicionar botões
                                            if(element.buttons?.length){ // Percorrer botões
                                                for(const [index, button] of element.buttons.entries()){
                                                    // button.type
                                                    // button.title
                                                    // button.url

                                                    if(button.type === "web_url" && button.title && button.url){
                                                        newElement.buttons.push({id:`button-${index.toString().padStart(2,"0")}` ,type: button.type, title: button.title, url: button.url});
                                                    }
            
                                                    if(button.type === "postback" && button.title && button.children?.length){
                                                        button.payload = `${`button-${index.toString().padStart(2,"0")}`}-${Date.now().toString(32)}-${Math.random().toString(32).slice(2)}-${Math.random().toString(32).slice(2)}`;
            
                                                        // criar ID único pra o elemento filho associado ao botão
                                                        const parentChildren = button.children[0];
                                                        parentChildren.id = generateChildrenId();
                                                        parentChildren.children = [];
            
                                                        newElement.buttons.push({id: `button-${index.toString().padStart(2,"0")}`, type: button.type, title: button.title, payload: button.payload, children: [parentChildren]});
                                                    }
                                                }
                                            }

                                            elementsFounds.push(newElement);
                                            
                                        }
                                        
                                    }

                                    if(elementsFounds.length){
                                        hasChanged = true;

                                        // Adicionar elemento
                                        children.content.elements.push(...elementsFounds);
                                        updateKeys.push("children.content");

                                    }
                                }

                                // Remover elementos
                                if(body.flowchart.change.removeElements && Array.isArray(body.flowchart.change.removeElements) && body.flowchart.change.removeElements.length){
                                 
                                    const removedButtons = children.content.elements.filter(element=> body.flowchart.change.removeElements.some(elementToRemove=> elementToRemove.id === element.id));
                                    console.log('valor de removedButtons:',removedButtons);
                                    children.content.elements = children.content.elements.filter(element=> !removedButtons.some(elementToRemove=> elementToRemove.id === element.id));
                                    console.log('valor de children.content.elements:',children.content.elements);
                                    if(removedButtons.length){
                                        updateKeys.push('children.content.elements')
                                        hasChanged = true;
                                    }
                                
                                }

                                // Alterar children
                                if(body.flowchart.change.children && Array.isArray(body.flowchart.change.children) && body.flowchart.change.children.length && isObject(body.flowchart.change.children[0])){
                                    if(!hasChanged) hasChanged = true;

                                    const {status, children: childrenStructured} = structureChildren({children: body.flowchart.change.children[0]});
                                    if(status){
                                        children.children = [];
                                        children.children.push(childrenStructured);
                                        updateKeys.push('children.children');
                                    }
                                    
                                }



                                if(hasChanged){
                                    updateObject.flowchart = chatbot.flowchart;
                                }


                            }

                            // Editar audio
                            if(body.flowchart.change.type === "audio"){
                                let hasChanged = false;

                                // delay
                                if(body.flowchart.change.delay && isObject(body.flowchart.change.delay) && body.flowchart.change.delay.seconds && parseInt(body.flowchart.change.delay.seconds)){
                                    children.delay = {seconds: body.flowchart.change.delay.seconds};
                                    updateKeys.push('children.delay');
                                    hasChanged = true;
                                }

                                // remover delay
                                if(children.delay && body.flowchart.change.removeDelay && typeof body.flowchart.change.removeDelay === "boolean" && body.flowchart.change.removeDelay){
                                    delete children.delay;
                                    updateKeys.push('@delayRemoved children.delay');
                                    hasChanged = true;
                                }
                            
                                // Alterar audio
                                if(body.flowchart.change.audio && isObject(body.flowchart.change.audio) && body.flowchart.change.audio.audio_url && typeof body.flowchart.change.audio.audio_url === "string"){
                                    children.audio = {audio_url:body.flowchart.change.audio.audio_url};
                                    updateKeys.push(`@audioChanged children.audio`);
                                    hasChanged = true;
                                }
                                

                                // Alterar children
                                if(body.flowchart.change.children && Array.isArray(body.flowchart.change.children) && body.flowchart.change.children.length && isObject(body.flowchart.change.children[0])){
                                    

                                    const {status, children: childrenStructured} = structureChildren({children: body.flowchart.change.children[0]});
                                    if(status){
                                        children.children = [];
                                        children.children.push(childrenStructured);
                                        updateKeys.push('@childrenChanged children.children');
                                        hasChanged = true;
                                    }
                                    
                                }
                                
                                if(hasChanged){
                                    updateObject.flowchart = chatbot.flowchart;
                                }
                                
                            }

                            // Editar video
                            if(body.flowchart.change.type === "video"){
                                let hasChanged = false;

                                // delay
                                if(body.flowchart.change.delay && isObject(body.flowchart.change.delay) && body.flowchart.change.delay.seconds && parseInt(body.flowchart.change.delay.seconds)){
                                    children.delay = {seconds: body.flowchart.change.delay.seconds};
                                    updateKeys.push('children.delay');
                                    hasChanged = true;
                                }

                                // remover delay
                                if(children.delay && body.flowchart.change.removeDelay && typeof body.flowchart.change.removeDelay === "boolean" && body.flowchart.change.removeDelay){
                                    delete children.delay;
                                    updateKeys.push('@delayRemoved children.delay');
                                    hasChanged = true;
                                }
                                
                                // Alterar video
                                if(body.flowchart.change.video && isObject(body.flowchart.change.video) && body.flowchart.change.video.video_url && typeof body.flowchart.change.video.video_url === "string"){
                                    children.video = {video_url:body.flowchart.change.video.video_url};
                                    updateKeys.push(`@videoChanged children.video`);
                                    hasChanged = true;
                                }
                            

                                // Alterar children
                                if(body.flowchart.change.children && Array.isArray(body.flowchart.change.children) && body.flowchart.change.children.length && isObject(body.flowchart.change.children[0])){
                                    

                                    const {status, children: childrenStructured} = structureChildren({children: body.flowchart.change.children[0]});
                                    if(status){
                                        children.children = [];
                                        children.children.push(childrenStructured);
                                        updateKeys.push('@childrenChanged children.children');
                                        hasChanged = true;
                                    }
                                    
                                }

                                if(hasChanged){
                                    updateObject.flowchart = chatbot.flowchart;
                                }
                                
                            }

                            // Editar imagem
                            if(body.flowchart.change.type === "image"){
                                let hasChanged = false;

                                // delay
                                if(body.flowchart.change.delay && isObject(body.flowchart.change.delay) && body.flowchart.change.delay.seconds && parseInt(body.flowchart.change.delay.seconds)){
                                    children.delay = {seconds: body.flowchart.change.delay.seconds};
                                    updateKeys.push('children.delay');
                                    hasChanged = true;
                                }

                                // remover delay
                                if(children.delay && body.flowchart.change.removeDelay && typeof body.flowchart.change.removeDelay === "boolean" && body.flowchart.change.removeDelay){
                                    delete children.delay;
                                    updateKeys.push('children.delay');
                                    hasChanged = true;
                                }

                                // Alterar children
                                if(body.flowchart.change.children && Array.isArray(body.flowchart.change.children) && body.flowchart.change.children.length && isObject(body.flowchart.change.children[0])){
                                    

                                    const {status, children: childrenStructured} = structureChildren({children: body.flowchart.change.children[0]});
                                    if(status){
                                        children.children = [];
                                        children.children.push(childrenStructured);
                                        updateKeys.push('children.children');
                                        hasChanged = true;
                                    }
                                    
                                }

                                if(body.flowchart.change.image && isObject(body.flowchart.change.image) && body.flowchart.change.image.image_url && typeof body.flowchart.change.image.image_url === "string"){
                                    children.image = {image_url:body.flowchart.change.image.image_url};
                                    updateKeys.push(`@imageChanged children.image`);
                                    hasChanged = true;
                                }
                                
                                if(hasChanged){
                                    updateObject.flowchart = chatbot.flowchart;
                                }
                                
                            }

                            // Editar file
                            if(body.flowchart.change.type === "file" && body.flowchart.change.file && isObject(body.flowchart.change.file) && body.flowchart.change.file.file_url && typeof body.flowchart.change.file.file_url === "string"){
                                // delay
                                if(body.flowchart.change.delay && isObject(body.flowchart.change.delay) && body.flowchart.change.delay.seconds && parseInt(body.flowchart.change.delay.seconds)){
                                    children.delay = {seconds: body.flowchart.change.delay.seconds};
                                    updateKeys.push('children.delay');
                                    hasChanged = true;
                                }

                                // remover delay
                                if(children.delay && body.flowchart.change.removeDelay && typeof body.flowchart.change.removeDelay === "boolean" && body.flowchart.change.removeDelay){
                                    delete children.delay;
                                    updateKeys.push('children.delay');
                                    hasChanged = true;
                                }

                                // Alterar children
                                if(body.flowchart.change.children && Array.isArray(body.flowchart.change.children) && body.flowchart.change.children.length && isObject(body.flowchart.change.children[0])){
                                    

                                    const {status, children: childrenStructured} = structureChildren({children: body.flowchart.change.children[0]});
                                    if(status){
                                        children.children = [];
                                        children.children.push(childrenStructured);
                                        updateKeys.push('children.children');
                                    }
                                    
                                }

                                children.file = {file_url:body.flowchart.change.file.file_url};
                                updateKeys.push(`children.file`);
                                updateObject.flowchart = chatbot.flowchart;
                            }
                        }
                    }
                }
            }
        }
        
        
        if(Object.keys(updateObject).length > 0){ // alterações encontradas
            const chatbot = await Chatbot.findByIdAndUpdate(mongoose.Types.ObjectId(chatbotId),updateObject,{new: true});
            return res.status(200).json({chatbot: chatbot, updateKeys: [...Object.keys(updateObject), ...updateKeys]});
        }
        return res.status(200).json({updateKeys:[]});
    }catch(error){
        console.log('error:', error);
        return res.status(500).json({error: `${error}`});
    }
});

// deletar chatbot
router.delete('/:id',auth, async (req, res, next)=>{
    try{
        const chatbotId = req.params.id;
        if(!mongoose.Types.ObjectId.isValid(chatbotId)){ // id do chatbot inválido
            return res.status(400).json({ error: 'ID fornecido é inválido.' });
        }

        const chatbot = await Chatbot.findById(chatbotId); 
        if(!chatbot){ // chatbot não encontrado
            return res.status(404).json({error:`Nenhuma automação encontrada com o ID fornecido.`});
        } 

        await Chatbot.findByIdAndDelete(chatbotId); // Deletar o chatbot
        return res.status(200).json({ message: 'Automação excluída com sucesso.', deletedChatbot: chatbot });
    }catch(error){
        console.error('Erro ao excluir chatbot:', error);
        return res.status(500).json({ error: 'Ocorreu um erro ao excluir a automação. Por favor, tente novamente mais tarde.' });
    }
});

// pegar chatbot
router.get('/:id', auth, async (req,res, next)=>{
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({error:`id do chatbot inválido`});
    const chatbot = await Chatbot.findById(mongoose.Types.ObjectId(id));
    if(!chatbot) return res.status(404).json({error:`chatbot não encontrado`});
    return res.status(200).json({chatbot});
});

// pegar lista de posts da pagina
router.get('/page/:idPage/posts',auth, async (req, res,next)=>{
    try{
        const {idPage} = req.params;
        const pageFound = req.user.pages.find(page=>page.idPage === idPage);
        if(!pageFound) return res.status(404).json({error:`página não encontrada`});

        const url = `https://graph.facebook.com/${idPage}/posts?fields=id,message,created_time,full_picture&access_token=${pageFound.accessToken}`;
        const request = await fetch(url, {method: "GET"});
        if(request.ok){
            const posts = await request.json();
            return res.status(200).json({posts:posts.data});
        }else{
            const responseError = await request.json();
            return res.status(404).json({error: `${responseError}`});
        }
      
    }catch(error){
        return res.status(500).json({error: `${error}`});
    }
});

// pegar post da pagina pelo "postId"
router.get('/page/:idPage/post/:postId',auth,async (req, res, next)=>{
    try{
        const {idPage, postId} = req.params;
        if(!idPage) return res.status(400).json({error:`idPage não informado`});
        if(!postId) return res.status(400).json({error:`postId não informado`});

        const pageFound = req.user.pages.find(page=>page.idPage === idPage);
        if(!pageFound) return res.status(404).json({error:`página não encontrada`});

        const url = `https://graph.facebook.com/${postId}?fields=id,message,created_time,full_picture&access_token=${pageFound.accessToken}`;
        const request = await fetch(url, {method: "GET"});
        if(request.ok){
            const response = await request.json();
            return res.status(200).json({post: response});
        }else{  
            const response = await request.json();
            return res.status(400).json({error: response});
        }
    }catch(error){
        return res.status(400).json({error: `${error}`})
    }
});



module.exports = router;