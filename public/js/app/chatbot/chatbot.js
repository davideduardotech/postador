
class CriarAutomacao{
    constructor(){
        this.listaDeChatbotsElement = document.getElementById('lista-de-chatbots');
        this.listaDeChatbotsCarregandoElement = document.getElementById('lista-de-chatbots-carregando');
        this.nenhumChatbotEncontradoElement = document.getElementById('nenhum-chatbot-encontrado');

        this.construtorDeFluxogramaElement = document.getElementById('construtor-de-fluxograma');

        this.detalhesDoChatBotContainer = document.getElementById('detalhes-do-chatbot-container');
        this.detalhesDoChatBotNome = document.getElementById('detalhes-do-chatbot-nome');
        this.detalhesDoChatBotPagina = document.getElementById('detalhes-do-chatbot-pagina');
        this.detalhesDoChatBotStatus = document.getElementById('detalhes-do-chatbot-status');
        this.detalhesDoChatBotModificado = document.getElementById('detalhes-do-chatbot-modificado');


        this.botaoCriarAutomacaoElement = document.getElementById('botao-criar-automacao');
        this.botaoVoltarElement = document.getElementById('construtor-de-fluxograma-botao-de-voltar');
        this.botaoOpcoesEllipsesElement = document.getElementById('botao-de-opcoes-ellipsis');
        this.tituloDoFluxograma = document.getElementById('construtor-de-fluxograma-title');
        this.nomeDaAutomacaoParagraph = document.getElementById('nome-da-automacao-paragraph');
        this.construtorDeFluxogramaElement = document.getElementById('construtor-de-fluxograma');

        // CODDDING: Tipos de trigger
        this.facebookCommentTrigger = "comentários do facebook";
        this.messageWithKeywordTrigger = "palavra-chave do messenger";

        this.chatbotId = '';
        this.chatbots = [
           
        ];

        /*
         {
                name:"meu primeiro chatbot",
                updateAt: new Date(Date.now()),
                status:{
                    type:"danger",
                    message:"desligado"
                },
                page:{
                    pageId: "",
                    name:""
                },
                chatbot:{
                    trigger:{
                        element: document.getElementById(''),
                        type:this.facebookCommentTrigger,
                        pages:[],
                        keyword_all:false,
                        keyword:[]
                    }
                    nodes:[

                    ]
                }
            }
        */
    }
    async checkIfUserHasPermissionToCreateAutomation(){
        // CODDING: Verificar se usuario tem permissão e limite pra criar automação
        console.log(`usuario com permissão e liberado para criar o chatbot`);
    }
    async loadChatbosFromDatabase(){  
        // CODDING: Carregar chatbots do usuario do banco de dados
        await new Promise(resolve=> setTimeout(resolve, 5000));
    }
    async loadFoundChatbots(){
        this.listaDeChatbotsElement.classList.add('hidden');

        this.listaDeChatbotsCarregandoElement.classList.remove('hidden');
        

        await this.loadChatbosFromDatabase();

        this.listaDeChatbotsCarregandoElement.classList.add('hidden');


        if(this.chatbots.length === 0){
            this.nenhumChatbotEncontradoElement.classList.remove('hidden');
        }else{
            this.listaDeChatbotsElement.classList.remove('hidden');
            this.chatbots.forEach(item=>{
                const chatbotElement = document.createElement('div');
                chatbotElement.className = "w-full bg-white rounded-[10px] shadow-[0_8px_24px_rgba(149,157,165,0.2)] flex flex-col md:flex-row items-center space-x-[0px] md:space-x-[24px] relative md:p-0 md:pl-[100px]";
                chatbotElement.innerHTML = `
                <!-- CODDING: Imagem -->
                <div class="w-full md:w-[100px] h-[100px] md:h-auto md:flex-grow md:flex-shrink-0 rounded-tl-[10px] rounded-bl-[0px] rounded-tr-[10px] rounded-br-[0px] md:rounded-bl-[10px] md:rounded-tr-[0px] md:rounded-br-[0px] bg-purple flex justify-center items-center relative md:absolute md:top-0 md:bottom-0 md:left-0">
                <i class="fa-brands fa-facebook-messenger text-4xl text-white"></i>
                </div>
    
                
    
                <!-- CODDING: Detalhes -->
                <div class="w-full py-[32px] px-[16px] md:px-0 md:py-[24px] grid grid-cols-2 md:grid-cols-4 gap-4">
                
                <div class="flex flex-col items-start">
                    <p class="text-base text-purple font-bold">ChatBot</p>
                    <p class="text-base/none text-[#40404]">${item.name}</p>
                    
                </div>
                <div class="flex flex-col items-start">
                    <p class="text-base text-purple font-bold">Página</p>
                    <p class="text-base/none text-[#40404]">${item.page.name.trim().length > 0?item.page.name:`Nenhuma pagina vinculada`}</p>
                </div>
    
                
                
                <div class="flex flex-col items-start">
                    <p class="text-base text-purple font-bold">Status</p>
                    <div class="flex flex-row justify-start items-center space-x-[5px]">
                    <div class="w-[8px] h-[8px] rounded-full bg-red-500"></div>
                    <p class="text-base/none text-red-500 font-medium">Desligado</p>
                    </div>
                </div>
                <div class="flex flex-col items-start">
                    <p class="text-base text-purple font-bold">Modificado</p>  
                    <p class="text-base/none text-[#404040]">${item.updateAt.getDate() < 9 ? `0${item.updateAt.getDate()}`:item.updateAt.getDate()}/${item.updateAt.getMonth()+1 < 9 ? `0${item.updateAt.getMonth()+1}`:item.updateAt.getMonth()+1}/${item.updateAt.getFullYear()} ${item.updateAt.getHours()}:${item.updateAt.getMinutes()}:${item.updateAt.getSeconds()}</p>
                
                </div>
    
                
                </div>
    
                <!-- CODDING: Botões -->
                <div class="w-full md:w-auto flex flex-row justify-end md:justify-start items-center space-x-[5px] pr-[24px] mb-[16px] md:mb-[0px]">
                <button class="w-[120px] px-[16px] h-[50px] text-sm text-white rounded-[10px] bg-purple flex justify-center items-center space-x-[10px]">
                    <i class="fa-solid fa-pen"></i>
                    <span>Editar</span>
                </button>
                <button class="px-[16px] h-[50px] rounded-[10px]  flex justify-center items-center space-x-[10px] bg-purple">
                    <i class="fa-solid fa-ellipsis-vertical text-base text-white"></i>
                </button>
                </div>
                `;
    
                this.listaDeChatbotsElement.appendChild(chatbotElement);
            });
        }
        
    }
    botaoVoltar(){
        this.botaoVoltarElement.addEventListener('click',()=>{
            // CODDING: Esconder botão de voltar, botão de opções ellipses e alterar titulo
            this.botaoVoltarElement.classList.add('hidden');
            this.botaoOpcoesEllipsesElement.classList.add('hidden');
            this.tituloDoFluxograma.textContent = "Minhas Automações";
            
            // CODDING: Mostrar botão de criar automação
            this.botaoCriarAutomacaoElement.classList.remove('hidden');

            // CODDING: Esconder detalhes do chatbot
            this.detalhesDoChatBotContainer.classList.add('hidden')
           
            // codding: Esconder fluxograma
            this.construtorDeFluxogramaElement.classList.add("hidden");

            this.loadFoundChatbots();
        });
    }
    loadMessageFlowChart(flowData){
        // CODDING: Esconder lista de chatbots
        this.listaDeChatbotsElement.classList.add('hidden');
        this.listaDeChatbotsCarregandoElement.classList.add('hidden');

        // CODDING: Esconder nenhum chatbot encontrado
        this.nenhumChatbotEncontradoElement.classList.add('hidden');

        // CODDING: Esconder botão de criar automação
        this.botaoCriarAutomacaoElement.classList.add('hidden');

        // CODDING: Mostrar botão de opções(Ellipses)
        this.botaoOpcoesEllipsesElement.classList.remove('hidden');

        // CODDING: Mostrar botão de voltar e alterar titulo
        this.botaoVoltarElement.classList.remove('hidden');
        this.tituloDoFluxograma.textContent = "ChatBot";

        // CODDING: Mostrar detalhes do chatbot
        this.detalhesDoChatBotNome.textContent = flowData.name;
        this.detalhesDoChatBotPagina.textContent = flowData.page.name.trim() !== "" ? flowData.page.name.trim():"Nenhum página vinculada";
        this.detalhesDoChatBotModificado.textContent = `${flowData.updateAt.getDate() < 9?`0${flowData.updateAt.getDate()}`:flowData.updateAt.getDate()}/${flowData.updateAt.getMonth() < 9 ? `0${flowData.updateAt.getMonth()}`:flowData.updateAt.getMonth()}/${flowData.updateAt.getFullYear()} ${flowData.updateAt.getHours()}:${flowData.updateAt.getMinutes()}:${flowData.updateAt.getSeconds()}`;
        this.detalhesDoChatBotContainer.classList.remove('hidden');

        // CODDING: Mostar fluxograma
        this.construtorDeFluxogramaElement.classList.remove('hidden');


        
        // CODDING: 1° etapa, escolher pagina do facebook
        console.log('flowData:',flowData);
        if(typeof(flowData.chatbot.trigger.type)!=="undefined"){

        }else{
            // CODDING: gatilho indefinido
            const gatilhoElement = document.createElement('div');
            gatilhoElement.className = "min-w-[300px] max-w-[300px] relative rounded-[10px] bg-white shadow-[0_8px_24px_rgba(149,157,165,0.2)] flex flex-col justify-between items-center space-y-[16px]";
            gatilhoElement.innerHTML = `<!-- CODDING: Content -->
            <div class="flex flex-col justify-start space-y-[16px]">
              
              <!-- CODDING:  Titulo do gatilho -->
              <div class="flex justify-start items-center space-x-[10px] px-[16px] pt-[16px] text-[#404040]">
                <i class="fa-solid fa-bolt text-xl"></i>
                <div class="flex flex-col justify-center items-start">
                  <p class="text-base/none">Quando...</p>
                </div>
              </div>

              <!-- CODDING: Sobre -->
              <div class="px-[16px] py-[16px] space-y-[16px]">
              
                
                  <p class="text-base text-[#404040]">O gatilho é responsavel por acionar a automação</p>
               
                
               
                  <p>click em <span class="text-purple font-bold">"Adicionar Gatilho"</span></p>
                
              </div>

             
            <!-- CODDING: Botão -->
            <button class="w-full py-[8px] bg-purple text-white rounded-bl-[10px] rounded-br-[10px] space-x-1 ">
              <i class="fa-solid fa-plus"></i>
              <span>Adicionar Gatilho</span>
            </button>`;

            this.construtorDeFluxogramaElement.appendChild(gatilhoElement);
        }
        
    }

    addNode(){

    }
    removeNode(){

    }
    botaoCriarAutomacao(){
        this.botaoCriarAutomacaoElement.addEventListener('click',()=>{
            

            // CODDING: Verificar se o usuario tem permissão e limite para criar automação
            this.checkIfUserHasPermissionToCreateAutomation();

            // CODDING: Gerar dados do chatbot
            const timestamp = Date.now().toString(36); // Convertendo o timestamp atual para base 36
            const randomStr = Math.random().toString(36).substr(2); // Gerando uma string aleatória e removendo o "0."
            const uniqueId = timestamp + randomStr;
            const dicionario = {
                id: uniqueId,
                name:"Meu Primeiro ChatBot",
                updateAt: new Date(Date.now()),
                status:{
                    type: "danger",
                    message: "desligado"
                },
                page:{
                    pageId:"",
                    name:""
                },
                chatbot:{
                    trigger:{
                    
                    },
                    nodes:[
                        
                    ]
                }
            };
            
            
            this.chatbots.push(dicionario);
            
            
            // CODDING: Mostrar flowchart
            this.loadMessageFlowChart(dicionario);

            console.log('clicou no botão criar automação');
            console.log('VALOR DO CHATBOT:',this.chatbots);
            
        });
    }
}

const criarAutomacao = new CriarAutomacao();

//criarAutomacao.loadFoundChatbots();

function addLine(){
    const button01 = document.getElementById('button-01');
    const button02 = document.getElementById('button-02');

    const rect01 = button01.getBoundingClientRect();
    const rect02 = button02.getBoundingClientRect();

    const adicionarMensagem = document.getElementById('adicionar-mensagem-card');
    const rectAdicionarMensagem = adicionarMensagem.getBoundingClientRect();

    const sizeLine02Vertical = Math.abs(rect02.bottom - rectAdicionarMensagem.bottom) + (rect02.height/2);
    const sizeLine01Vertical = Math.abs(rect01.bottom - rectAdicionarMensagem.bottom) + (rect01.height/2);

    const line02 = document.createElement('div');
    line02.className = `absolute h-[3px] w-[72px] bg-purple left-[100%] top-[${parseInt(rect02.height/2)}px]`;
    line02.innerHTML = `<div class="w-full h-full relative">
        <!-- CODDING: Circulo -->
        <div class="absolute left-[-7px] top-[-6px] h-[15px] w-[15px] bg-purple rounded-full "></div>

        <!-- CODDING: Line vertical -->
        <div class="absolute right-[-3px] top-0 h-[${sizeLine02Vertical}px] w-[3px] bg-purple">
        
        </div>
    </div>`;
    button02.appendChild(line02);

    const line01 = document.createElement('div');
    line01.className = `absolute h-[3px] w-[104px] bg-purple left-[100%] top-[${parseInt(rect01.height/2)}px]`;
    line01.innerHTML = `<div class="w-full h-full relative">
        <!-- CODDING: Circulo -->
        <div class="absolute left-[-7px] top-[-6px] h-[15px] w-[15px] rounded-full bg-purple"></div>

        <!-- CODDING: Linen vertical -->
        <div class="absolute right-[-3px] w-[3px] h-[${sizeLine01Vertical}px] bg-purple"></div>
    </div>`;
    button01.appendChild(line01)


    
    
}

function addLineToButton({cardWithButtonElement,buttonElement, childElement,widthLine,heightLine,spaceY, parent,space=16}){
    const rectCardWithButton = cardWithButtonElement.getBoundingClientRect();
    const rectButton = buttonElement.getBoundingClientRect();
    
    const rectChildElement = childElement.getBoundingClientRect();
    
    // CODDING: Calculando distancia horizontal da linha do meio
    const distanciaHorizontal = Math.abs(rectChildElement.left - rectCardWithButton.left) + (parseInt(widthLine.replace('px','').trim()) - Math.abs(rectButton.left - rectCardWithButton.left)) + parseInt(rectChildElement.width/2);

    // CODDING: Calculando altura da linha horizontal
    const alturarLinhaVertical = Math.abs(rectButton.bottom - rectCardWithButton.bottom) + (rectButton.height/2) + parseInt(spaceY.replace('px','').trim());

    
    // CODDING: Calculando altura da linha final
    const alturaLinhaFinal = Math.abs(rectCardWithButton.bottom - rectChildElement.bottom) - parseInt(spaceY.replace('px','')) - rectChildElement.height;

    // CODDING: Linha na horizontal com circulo
    const lineWithCircle = document.createElement('div');
    lineWithCircle.className = `z-10 absolute left-[100%] top-[${parseInt(rectButton.height/2)}px] w-[${widthLine}] h-[${heightLine}] bg-purple`;
    lineWithCircle.innerHTML = `<div class="w-full h-full relative">
        <!-- CODDING: Circulo -->
        <div class="absolute left-[-6px] top-[-6px] h-[15px] w-[15px] rounded-full bg-purple"></div>

        <!-- CODDING: Linha vertical -->
        <div class="w-full h-full relative">
            <div class="absolute right-[-3px] w-[3px] h-[${alturarLinhaVertical}px] bg-purple">
                    <!-- CODDING: Linha horizontal -->
                    <div class="w-full h-full relative">
                        <div class="absolute right-[100%]  bottom-0 w-[${distanciaHorizontal}px] h-[3px] bg-purple">
                            <!-- CODDING: Linha final -->
                            <div class="w-full h-full relative bg-purple">
                                <div class="absolute left-0 top-[100%] w-[3px] h-[${alturaLinhaFinal}px] bg-purple">
                                    <!-- CODDING: Circle -->
                                    <div class="w-full h-full relative">
                                        <div class="absolute bottom-[-7px] left-[-6px] w-[15px] h-[15px] rounded-full bg-purple"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    </div>`;
    buttonElement.appendChild(lineWithCircle);

    const lineVertical = '';

    const lineHorizontal = '';

    const lineDeLigamento = '';

}

addLineToButton({
    cardWithButtonElement: document.getElementById('adicionar-mensagem-card'),
    buttonElement: document.getElementById('button-01'),
    childElement: document.getElementById('card-filho-02'),
    widthLine: "100px", 
    heightLine: "3px",
    spaceY: "32px"});

addLineToButton({
    cardWithButtonElement: document.getElementById('adicionar-mensagem-card'),
    buttonElement: document.getElementById('button-02'),
    childElement: document.getElementById('card-filho'),
    widthLine: "84px", 
    heightLine: "3px",
    spaceY: "16px"});



const construtorDeFluxograma = document.getElementById('construtor-de-fluxograma');
const construtorDeFluxogramaBounds = construtorDeFluxograma.getBoundingClientRect();
const gatilhoElement = document.getElementById('gatilho-fluxograma');
const gatilhoElementBounds = gatilhoElement.getBoundingClientRect();

// Calcular a posição do elemento em relação ao contêiner Panzoom
const elementoX = gatilhoElementBounds.left - construtorDeFluxogramaBounds.left;
const elementoY = gatilhoElementBounds.top - construtorDeFluxogramaBounds.top;


// CODDING: Importando e configurando(Mover/Zoom)
const panzoom = Panzoom(construtorDeFluxograma, {
    canvas:true,
    maxScale: 5, // Define o zoom máximo
    contain: 'outside', // Mantém o conteúdo dentro da área de visualização
    minScale: 0, // Define o zoom mínimo
    bounds: true // Limita o movimento para dentro dos limites do elemento pai
})



construtorDeFluxograma.addEventListener('wheel', panzoom.zoomWithWheel);
construtorDeFluxograma.addEventListener('mousedown', panzoom.panWithMouse);
construtorDeFluxograma.addEventListener('touchstart', panzoom.panWithTouch); 
    
setTimeout(()=>{
    panzoom.pan(0, 0);
    panzoom.zoom(0, { animate: true, duration: 500 });
}, 500);

setTimeout(()=>{

},5000);


class CardElement{
    constructor({children}){
        this.children = children;

        this.cardSelected = 0;
        
        this.arrowLeftId = this.generateId('arrow-left');
        this.arrowRightId = this.generateId('arrow-right');

        this.element = this.createElement();
    
        
        this.addEvents();
    }

    generateId(nameElement){
        return nameElement+"-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2);
    }

    addEvents(){
        this.arrowLeftEvent();
        this.arrowRightEvent();
    }

   
    
    createElement(){
        const element = document.createElement('div');
        element.className = `w-full`;

        // criar botões 
        let buttonsElement = ``;
        if(this.children.content.elements[0].buttons.length>0){
            
            this.children.content.elements[0].buttons.forEach(button=>{
                buttonsElement += `
                <a href="${button.url}" target="_blank" class="w-full h-[40px] w-full rounded-[10px] px-[16px] space-x-[10px] shadow-[0_3px_8px_rgba(0,0,0,0.24)] text-sm text-[#404040] bg-white hover:bg-[#FDFDFD] flex flex-row justify-between items-center">
                    <i class="fa-solid fa-link text-purple"></i>
                    <div class="flex-grow flex justify-start items-center">
                        <p>${button.title.slice(0,20)}</p>
                    </div>
                </a>`
            })
            console.log('valor de buttonsElement:',buttonsElement);
        }

        // criar paginação
        let paginationElements = ``;
        this.children.content.elements.forEach((element, index)=>{
            if(index == this.cardSelected){
                paginationElements+=`<div class="w-[24px] h-[24px] shadow-[1.95px_1.95px_2.6px_rgba(0,0,0,0.15)] rounded flex justify-center items-center bg-purple">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" class="m-r-xxs _icon_7gwsq_18 _active_7gwsq_23 text-white"><path d="M2 4V20H22V4H2ZM20.5366 5.45455V14.0848H3.46341V5.45455H20.5366ZM3.46341 18.5455V15.5394H20.5366V18.5455H3.46341Z" fill="currentColor"></path></svg>
                </div>`;
            }else{
                paginationElements+=`<div class="w-[8px] h-[8px] rounded-[2px] bg-gray-300"></div>`;
            }
        });


        element.innerHTML = `
        <div class="px-[16px] py-[16px] relative">
            <!-- CODDING: Card -->
            <div class="w-full bg-white flex flex-col items-center items-start shadow-[0_3px_8px_rgba(0,0,0,0.24)] rounded-[10px] relative">
                <!-- CODDING: Paginação -->
                <div id="pagination" class="z-[50] absolute right-[10px] top-[-15px] bg-white h-[35px] px-[16px] rounded-full flex flex-row justify-end items-center space-x-[5px] shadow-[0_3px_8px_rgba(0,0,0,0.24)]">
                    ${paginationElements}
                </div>

                <!-- CODDING: Imagem -->
                <div class="px-[16px] pt-[32px] pb-[16px] w-full bg-white relative rounded-tr-[10px] rounded-tl-[10px] ">
                    <img id="image" src="${this.children.content.elements[0].image_url}" class="w-full h-[150px] rounded">
                </div>
                
                <div class="w-full px-[16px] py-[16px] bg-white rounded-[10px] flex flex-col justify-start items-start shadow-[1.95px_1.95px_2.6px_rgba(0,0,0,0.15)]">
                    <!-- CODDING: Titulo e Legenda -->
                    <p id="title" class="text-sm text-[#404040] font-black">${this.children.content.elements[0].title.slice(0,80)}</p>
                    <p id="subtitle" class="pt-[5px] text-sm font-normal text-gray-500">${this.children.content.elements[0].subtitle.slice(0,80)}</p>

                    <!-- CODDING: Botões -->
                    <div id="buttons-container" class="py-[16px] w-full flex flex-col items-center justify-start space-y-[10px]">
                        ${buttonsElement}
                    </div>
                </div>
            </div>

            <!-- CODDING: Arrow Left -->
            <div id="${this.arrowLeftId}" class="hidden absolute top-[40%] left-[-15px] min-h-[40px] min-w-[40px] rounded-[10px] bg-purple hover:bg-[#823f87] flex justify-center items-center shadow-[0_3px_8px_rgba(0,0,0,0.24)] hover:shadow-[0_5px_15px_rgba(0,0,0,0.35)] cursor-pointer">
                <i class="fa-solid fa-chevron-left text-white"></i>
            </div>
            <!-- CODDING: Arrow Right -->
            <div id="${this.arrowRightId}" class="${this.children.content.elements.length > 0 ? "":"hidden"} absolute top-[40%] right-[-15px] min-h-[40px] min-w-[40px] rounded-[10px] bg-purple hover:bg-[#823f87] flex justify-center items-center shadow-[0_3px_8px_rgba(0,0,0,0.24)] hover:shadow-[0_5px_15px_rgba(0,0,0,0.35)] cursor-pointer">
                <i class="fa-solid fa-chevron-right text-white"></i>
            </div>
        </div>
        `;

        return element;
    }

    

    arrowLeftEvent(){
        const arrowLeft = (buttonElement) => {
            this.cardSelected -= 1; // descrementar

            if(this.cardSelected === 0){ // primeiro card
                // esconder arrow left
                buttonElement.classList.add('hidden');
            }

            // mostrar arrow right
            const arrowRightElement = this.element.querySelector(`#${this.arrowRightId}`);
            arrowRightElement.classList.remove('hidden');

            // alterar paginação
            let paginationElements = ``;
            this.children.content.elements.forEach((element, index)=>{
                if(index == this.cardSelected){
                    paginationElements+=`<div class="w-[24px] h-[24px] shadow-[1.95px_1.95px_2.6px_rgba(0,0,0,0.15)] rounded flex justify-center items-center bg-purple">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" class="m-r-xxs _icon_7gwsq_18 _active_7gwsq_23 text-white"><path d="M2 4V20H22V4H2ZM20.5366 5.45455V14.0848H3.46341V5.45455H20.5366ZM3.46341 18.5455V15.5394H20.5366V18.5455H3.46341Z" fill="currentColor"></path></svg>
                    </div>`;
                }else{
                    paginationElements+=`<div class="w-[8px] h-[8px] rounded-[2px] bg-gray-300"></div>`;
                }
            });
            const paginationElement = this.element.querySelector('#pagination');
            paginationElement.innerHTML = paginationElements;


            // alterar imagem 
            const imageElement = this.element.querySelector('#image');
            imageElement.src = this.children.content.elements[this.cardSelected].image_url;

            // alterar titulo
            const titleElement = this.element.querySelector('#title');
            titleElement.innerHTML = this.children.content.elements[this.cardSelected].title.slice(0,80);

            // alterar subtitulo
            const subtitleElement = this.element.querySelector('#subtitle');
            subtitleElement.innerHTML = this.children.content.elements[this.cardSelected].subtitle.slice(0,80);

            // alterar botões
            let buttons = ``;
            if(this.children.content.elements[this.cardSelected].buttons.length>0){
                
                this.children.content.elements[this.cardSelected].buttons.forEach(button=>{
                    buttons += `<a href="${button.url}" target="_blank" class="w-full h-[40px] w-full rounded-[10px] px-[16px] space-x-[10px] shadow-[0_3px_8px_rgba(0,0,0,0.24)] text-sm text-[#404040] bg-white hover:bg-[#FDFDFD] flex flex-row justify-between items-center">
                    <i class="fa-solid fa-link text-purple"></i>
                    <div class="flex-grow flex justify-start items-center">
                        <p>${button.title.slice(0,20)}</p>
                    </div>
                </a>`
                })
            }
            const buttonsElement = this.element.querySelector('#buttons-container');
            buttonsElement.innerHTML = buttons;

        };

        const buttonElement = this.element.querySelector(`#${this.arrowLeftId}`);
        buttonElement.addEventListener('click',()=>{
            console.log('você clicou no arrowLeft com o id:', this.arrowLeftId);
            arrowLeft(buttonElement)
        });
    }

    arrowRightEvent(){
        const arrowRight = (buttonElement) => {
            
            if(this.children.content.elements.length > this.cardSelected){
                this.cardSelected += 1; // incrementar

                if(this.cardSelected === (this.children.content.elements.length-1)){ // ultimo card
                    // esconder arrow right
                    buttonElement.classList.add('hidden');
                }

                // mostrar arrow left
                const arrowLeftElement = this.element.querySelector(`#${this.arrowLeftId}`);
                arrowLeftElement.classList.remove('hidden');

                // alterar paginação
                let paginationElements = ``;
                this.children.content.elements.forEach((element, index)=>{
                    if(index == this.cardSelected){
                        paginationElements+=`<div class="w-[24px] h-[24px] shadow-[1.95px_1.95px_2.6px_rgba(0,0,0,0.15)] rounded flex justify-center items-center bg-purple">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" class="m-r-xxs _icon_7gwsq_18 _active_7gwsq_23 text-white"><path d="M2 4V20H22V4H2ZM20.5366 5.45455V14.0848H3.46341V5.45455H20.5366ZM3.46341 18.5455V15.5394H20.5366V18.5455H3.46341Z" fill="currentColor"></path></svg>
                        </div>`;
                    }else{
                        paginationElements+=`<div class="w-[8px] h-[8px] rounded-[2px] bg-gray-300"></div>`;
                    }
                });
                const paginationElement = this.element.querySelector('#pagination');
                paginationElement.innerHTML = paginationElements;


                // alterar imagem 
                const imageElement = this.element.querySelector('#image');
                imageElement.src = this.children.content.elements[this.cardSelected].image_url;

                // alterar titulo
                const titleElement = this.element.querySelector('#title');
                titleElement.innerHTML = this.children.content.elements[this.cardSelected].title.slice(0,80);

                // alterar subtitulo
                const subtitleElement = this.element.querySelector('#subtitle');
                subtitleElement.innerHTML = this.children.content.elements[this.cardSelected].subtitle.slice(0,80);

                // alterar botões
                let buttons = ``;
                if(this.children.content.elements[this.cardSelected].buttons.length>0){
                    
                    this.children.content.elements[this.cardSelected].buttons.forEach(button=>{
                        buttons += `<a href="${button.url}" target="_blank" class="w-full h-[40px] w-full rounded-[10px] px-[16px] space-x-[10px] shadow-[0_3px_8px_rgba(0,0,0,0.24)] text-sm text-[#404040] bg-white hover:bg-[#FDFDFD] flex flex-row justify-between items-center">
                        <i class="fa-solid fa-link text-purple"></i>
                        <div class="flex-grow flex justify-start items-center">
                            <p>${button.title.slice(0,20)}</p>
                        </div>
                    </a>`
                    })
                }
                const buttonsElement = this.element.querySelector('#buttons-container');
                buttonsElement.innerHTML = buttons;
            }
        }

        const buttonElement = this.element.querySelector(`#${this.arrowRightId}`);
        console.log('button arrowRight encontrado:', buttonElement);
        buttonElement.addEventListener('click',()=>{
            console.log(`você clocou no arrowRight com o id:`, this.arrowRightId);
            arrowRight(buttonElement);
        });
    }
}

class DelayElement{
    constructor({children}){
        this.children = children;
        this.seconds = this.children.delay.seconds;
        this.element = this.createElement();
    }
    createElement(){
        const element = document.createElement("div");
        element.className = `mx-[16px] px-[16px] py-[16px] shadow-[0_3px_8px_rgba(0,0,0,0.24)] bg-white rounded-[10px] flex flex-row justify-start items-center space-x-[10px]`;
        element.innerHTML = `<i class="fa-regular fa-clock min-w-[40px] min-h-[40px] rounded-[10px] bg-purple text-white flex justify-center items-center"></i>
        <p class="text-sm text-[#404040]">Esperar ${this.seconds === 1 ? `1 segundo` : `${this.seconds} segundos`}</p>`;
        return element;
    }
}

class AudioElement{
    constructor({children}){
        this.children = children;
        this.element = this.createElement();
    }
    
    createElement(){
        const element = document.createElement('div');  // criar elemento
        element.className = `mx-[16px] flex flex-col items-start justify-center rounded-[10px] bg-white shadow-[0_3px_8px_rgba(0,0,0,0.24)]`;
        
        // mostrar audio carregando
        element.innerHTML = `
        <div class="w-full pt-[16px] px-[16px]">
            <div class="w-full rounded-[10px] h-[50px] bg-gray-200 animate-pulse"></div>
        </div>

        <div class="px-[16px] py-[16px] flex flex-row justify-start items-center space-x-[10px]">
            <i class="h-[40px] w-[40px] rounded-[10px] bg-gray-200 animate-pulse"></i>
            <div class="flex flex-col items-start justify-center space-y-[5px]">
                <p class="text-sm font-bold h-[15px] rounded-full w-[100px] bg-gray-200"></p>
                <p class="text-sm font-normal h-[15px] rounded-full w-[150px] bg-gray-200"></p>
            </div>
        </div>`;

        // carregar audio em um elemento de "Audio()" do HTML para ter acesso a duração
        const url = this.children.audio.audio_url;
        const audio = new Audio(url);
        
        audio.addEventListener('loadedmetadata', async () => { // metadados do audio carregado
            const minutos = Math.floor(audio.duration / 60);
            const segundos = Math.floor(audio.duration % 60);
            const duracao = `${minutos.toString().padStart(2,"0")}:${segundos.toString().padStart(2, "0")}`; // Formatar duração no formato 'MM:SS'
        
            // pegar tamanho do audio
            const request = await fetch(url);
            const blob = await request.blob();
            const size = ((blob.size / 1024)/1024).toFixed(2); 
        

            // Mostrar Audio
            element.innerHTML = `
            <div class="px-[16px] pt-[16px] w-full">
                <audio controls class="w-full bg-[#F1F3F4] rounded-[10px]">
                <source src="${url}">
                Seu navegador não suporta o elemento de áudio.
                </audio>
            </div>
            <div class="px-[16px] py-[16px] flex flex-row justify-start items-center space-x-[10px]">
                <i class="fa-solid fa-microphone h-[40px] w-[40px] text-white bg-purple rounded-[10px] flex justify-center items-center"></i>
                <div class="flex flex-col items-start justify-center">
                    <p class="text-sm font-bold">audio.mp3</p>
                    <p class="text-sm font-normal">00:00 / ${duracao} <span class="text-gray-500">(${size}MB)</span></p>
                </div>
            </div>`;
            
            
        });

        return element;
    }
}

class VideoElement{
    constructor({children}){
        this.children = children;
        this.url = this.children.video.video_url;

        this.element = this.createElement();

    }
    createElement(){
        const element = document.createElement('div');
        element.className = `mx-[16px] flex flex-col items-center justify-center bg-white shadow-[0_3px_8px_rgba(0,0,0,0.24)] rounded-[10px]`;
        
        // adicionar video carregando
        element.innerHTML = `<div class="px-[16px] pt-[16px] w-full h-auto max-h-[150px]">
        <div class="w-full h-full rounded-[10px] h-[100px] bg-gray-200 animate-pulse">

        </div>
      </div>
      <div class="w-full px-[16px] py-[16px] flex justify-start items-center space-x-[10px] ">
        <i class="h-[40px] w-[40px] rounded-[10px] bg-gray-200 animate-pulse"></i>
        <div class="flex flex-col items-start justify-center space-y-[5px]">
          <p class="text-sm font-bold h-[15px] rounded-full w-[100px] bg-gray-200"></p>
          <p class="text-sm font-normal h-[15px] rounded-full w-[150px] bg-gray-200"></p>
        </div>
      </div>`;

        // criando elemento de Video();
        const video = document.createElement('video')
        video.src = this.url;
        video.addEventListener('loadedmetadata',async ()=>{
            const minutos = Math.floor(video.duration / 60);
            const segundos = Math.floor(video.duration % 60)
            const duracao = `${minutos.toString().padStart(2,'0')}:${segundos.toString().padStart(2,'0')}`;
            
            // pegar tamanho do video do video
            const request = await fetch(this.url);
            if(request.ok){
                const blob = await request.blob();
                const size = ((blob.size / 1024)/1024).toFixed(2);
                
                // alterar 
                element.innerHTML = `<div class="px-[16px] pt-[16px] w-full h-auto max-h-[150px]">
                <video controls class="rounded-[10px]">
                  <source src="${this.url}">
                  Seu navegador não oferece suporte ao elemento de vídeo. Atualize-o para a versão mais recente.
                </video>
              </div>
              <div class="w-full px-[16px] py-[16px] flex justify-start items-center space-x-[10px] ">
                <i class="fa-solid fa-video h-[40px] w-[40px] rounded-[10px] text-white bg-purple flex justify-center items-center"></i>
                <div class="flex flex-col items-start justify-center">
                  <p class="text-sm font-bold">video.mp4</p>
                  <p class="text-sm font-normal">00:00 / ${duracao} <span class="text-gray-500">(${size}MB)<span></p>
                </div>
              </div>`;
            }else{
                // alterar 
                element.innerHTML = `<div class="px-[16px] pt-[16px] w-full h-auto max-h-[150px]">
                <video controls class="rounded-[10px]">
                  <source src="${this.url}">
                  Seu navegador não oferece suporte ao elemento de vídeo. Atualize-o para a versão mais recente.
                </video>
              </div>
              <div class="w-full px-[16px] py-[16px] flex justify-start items-center space-x-[10px] ">
                <i class="fa-solid fa-video h-[40px] w-[40px] rounded-[10px] text-white bg-purple flex justify-center items-center"></i>
                <div class="flex flex-col items-start justify-center">
                  <p class="text-sm font-bold">video.mp4</p>
                  <p class="text-sm font-normal">00:00 / 00:00 <span class="text-gray-500">(0MB)<span></p>
                </div>
              </div>`;
            }
        });

        return element;
    }
}

class ImageElement{
    constructor({children}){
        this.children = children;
        this.url = this.children.image.image_url;

        this.element = this.createElement();

    }
    createElement(){
        const element = document.createElement('div');
        
        element.className = `mx-[16px] bg-white shadow-[0_3px_8px_rgba(0,0,0,0.24)] rounded-[10px] flex flex-col items-center justify-center`;
        
        // Mostrar imagem carregando
        element.innerHTML = `<div class="px-[16px] pt-[16px] w-full h-auto max-h-[150px]">
        <div class="w-full h-full rounded-[10px] h-[100px] bg-gray-200 animate-pulse">

        </div>
      </div>
      <div class="w-full px-[16px] py-[16px] flex justify-start items-center space-x-[10px] ">
        <i class="h-[40px] w-[40px] rounded-[10px] bg-gray-200 animate-pulse"></i>
        <div class="flex flex-col items-start justify-center space-y-[5px]">
          <p class="text-sm font-bold h-[15px] rounded-full w-[100px] bg-gray-200"></p>
          <p class="text-sm font-normal h-[15px] rounded-full w-[150px] bg-gray-200"></p>
        </div>
      </div>`;

        // Carregar dados da imagem
        const image = new Image();
        image.onload = function() {
            (async () => {
                const dimensoes = `${this.width}x${this.height}`;
                try {
                    const response = await fetch(image.src, { method: 'HEAD' });
                    if (response.ok) {
                        const sizeInBytes = parseInt(response.headers.get('content-length'));
                        const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);

                        // Mostrando a imagem 
                        element.innerHTML = `<div class="px-[16px] pt-[16px] w-full">
                        <img src="${image.src}" alt="" class="rounded-[10px] w-full h-[150px]">
                      </div>
                      <div class="w-full px-[16px] py-[16px] flex flex-row justify-start items-center space-x-[10px]">
                        <i class="fa-regular fa-image w-[40px] h-[40px] rounded-[10px] bg-purple text-white text-sm flex justify-center items-center"></i>
                        <div class="flex flex-col items-start justify-center">
                          <p class="text-sm font-bold">imagem.png</p>
                          <p class="text-sm font-normal">${dimensoes} <span class="text-gray-500">(${sizeInMB}MB)</span></p>
                          <p></p>
                        </div>
                      </div>`;
                    } else {
                        
                        element.innerHTML = `<div class="px-[16px] pt-[16px] w-full">
                        <p class="text-red-400">não foi possivel carregar a imagem, recarregue a página</p>
                      </div>
                      <div class="w-full px-[16px] py-[16px] flex flex-row justify-start items-center space-x-[10px]">
                        <i class="fa-regular fa-image w-[40px] h-[40px] rounded-[10px] bg-purple text-white text-sm flex justify-center items-center"></i>
                        <div class="flex flex-col items-start justify-center">
                          <p class="text-sm font-bold">imagem.png</p>
                          <p class="text-sm font-normal">0x0 <span class="text-gray-500">(0MB)</span></p>
                          <p></p>
                        </div>
                      </div>`;
                    }
                } catch (error) {
                    console.error('Error fetching image size:', error);
                    element.innerHTML = `<div class="px-[16px] pt-[16px] w-full space-y-[10px]">
                        <p class="text-sm text-red-400">não foi possivel carregar a imagem</p>
                        <p class="text-sm text-red-400"><span class="font-bold">Error:</span> ${error}</p>
                      </div>
                      <div class="w-full px-[16px] py-[16px] flex flex-row justify-start items-center space-x-[10px]">
                        <i class="fa-regular fa-image w-[40px] h-[40px] rounded-[10px] bg-purple text-white text-sm flex justify-center items-center"></i>
                        <div class="flex flex-col items-start justify-center">
                          <p class="text-sm font-bold">imagem.png</p>
                          <p class="text-sm font-normal">0x0 <span class="text-gray-500">(0MB)</span></p>
                          <p></p>
                        </div>
                      </div>`;
                }
            })();
        };
        image.src = this.url;

        return element;
    }
}

class FileElement{
    constructor({children}){
        this.children = children;
        this.url = this.children.file.file_url;

        this.element = this.createElement();
    }
    createElement(){
        let element = document.createElement('div');
        element.className = `mx-[16px] bg-white shadow-[0_3px_8px_rgba(0,0,0,0.24)] rounded-[10px] flex flex-col items-center justify-center`;

        // mostrar arquivo carregando
        element.innerHTML = `<div class="w-full px-[16px] py-[16px] flex flex-row justify-start items-center space-x-[10px]">
            <i class="min-w-[40px] max-w-[40px] min-h-[40px] max-h-[40px] rounded-[10px] bg-gray-200 animate-pulse"></i>
            <div class="w-full flex flex-col items-start justify-center space-y-[5px]">
            <p class="min-h-[15px] w-full rounded-full bg-gray-200 animate-pulse"></p>
            <p class="min-h-[15px] w-[30%] rounded-full bg-gray-200 animate-pulse"></p>
            
            </div>
        </div>`;

        // carregar informações do arquivo
        async function showFileLoaded(fileUrl){
            async function pegarDetalhesDoArquivo(fileUrl) {
                try {
                    const response = await fetch(fileUrl);
                    if (!response.ok) {
                        throw new Error('Failed to fetch file');
                    }
            
                    const headers = response.headers;
                    const contentDisposition = headers.get('content-disposition');
                    let fileName = '';
            
                    // Extrai o nome do arquivo do cabeçalho Content-Disposition, se presente
                    if (contentDisposition && contentDisposition.includes('attachment')) {
                        fileName = contentDisposition.split('filename=')[1].split(';')[0].trim();
                    } else {
                        // Se não estiver presente, usa a última parte do URL como o nome do arquivo
                        fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
                    }
            
                    // Obtém o tamanho do arquivo em bytes
                    const fileSizeBytes = parseInt(headers.get('content-length'), 10);
            
                    // Converte o tamanho do arquivo para MB
                    const fileSizeMB = (fileSizeBytes / (1024 * 1024)).toFixed(2);
            
                    return { nome:fileName, tamanho:fileSizeMB };
                } catch (error) {
                    console.error('Error fetching file details:', error);
                    return null;
                }
            }
          
            const detalhesDoArquivo = await pegarDetalhesDoArquivo(fileUrl);
            // detalhesDoArquivo.nome
            // detalhesDoArquivo.tamanho
            if(detalhesDoArquivo){
                // mostrar arquivo carregado
                element.innerHTML = `<div class="w-full px-[16px] py-[16px] flex flex-row justify-start items-center space-x-[10px]">
                    <i class="fa-solid fa-paperclip min-w-[40px] max-w-[40px] w-[40px] min-h-[40px] max-h-[40px] h-[40px] rounded-[10px] bg-purple text-white text-sm flex justify-center items-center"></i>
                    <div class="w-[150px] flex flex-col items-start justify-center">
                        <p class="text-sm font-bold w-[150px] text-wrap truncate">${detalhesDoArquivo.nome}</p>
                        <p class="text-sm font-normal"><span class="text-gray-500">${detalhesDoArquivo.tamanho}MB</span></p>
                    </div>
                </div>`;
            }else{
                // mostrar arquivo carregado
                element.innerHTML = `<div class=" w-full px-[16px] py-[16px] flex flex-row justify-start items-center space-x-[10px]">
                    <i class="fa-solid fa-paperclip min-w-[40px] max-w-[40px] w-[40px] min-h-[40px] max-h-[40px] h-[40px] rounded-[10px] bg-purple text-white text-sm flex justify-center items-center"></i>
                    <div class="w-[150px] flex flex-col items-start justify-center">
                        <p class="text-sm w-[150px] text-red-500">Não foi possivel carregar o <span class="font-bold">arquivo</span>, ocorreu um erro</p>
           
                    </div>
                </div>`;
            }
            
        }
        showFileLoaded(this.url);
        return element;
        

        
    }
}

class ChildrenElement{
    constructor({child, fluxogramaInstance, type="message"}){
        this.child = child;
        
        // tipos de mensagens
        this.type = this.child.type;
        this.delay = this.child.delay;
        this.audio = this.child.audio;
        this.video = this.child.video;
        this.image = this.child.image;
        this.file = this.child.file;
    
        this.fluxogramaInstance = fluxogramaInstance;


        // criar botões
        this.buttonsInnerHTML = ``;
        if(this.type === "message" && this.child.buttons?.length > 0 && this.child.buttons.every(button=> typeof button === "object")){
            this.child.buttons.forEach(button=>{
                this.buttonsInnerHTML += `<button id="${button.id}" class="w-full rounded-[10px] h-[40px] bg-white text-sm text-[#404040] hover:border-[1px] shadow-[1.95px_1.95px_2.6px_rgba(0,0,0,0.15)] relative flex justify-center items-center">
                
                    <p class="flex-1">${button.title}</p>
                    <div class="w-[40px] h-[40px] rounded-[10px] bg-purple flex justify-center items-center">
                        <i class="fa-solid fa-${button.children?.length>0?'minus':'plus'} text-sm text-white"></i>
                    </div>
                </button>`;
            });
        }

        

    

        this.element = document.createElement('div');
        this.element.className = `min-w-[300px] max-w-[300px] rounded-[10px] bg-white shadow-[0_8px_24px_rgba(149,157,165,0.2)] flex flex-col justify-between items-center relative`;
        this.element.innerHTML = `
        <div class="w-full flex flex-col justify-start space-y-[16px]">
                    
        <!-- CODDING: Titulo -->
        <div class="flex flex-row justify-start items-center py-[16px] px-[16px] space-x-[10px]">
          <i class="fa-brands fa-facebook-messenger text-[#08A4F6] text-xl"></i>
          <div class="flex flex-col justify-center items-start">
            <p class="text-sm text-gray-400">Facebook</p>
            <p class="text-base/none text-[#404040]">Enviar Mensagem</p>
          </div>
        </div>

        <div class="bg-[#EEF1F4] rounded-[10px] mx-[16px] py-[16px] space-y-[15px]">
          <p class="px-[16px] w-full text-sm text-[#404040]">${this.type === "message" ? this.child.content : ""}</p>
            <div id="elements" class="w-full flex-col items-center justify-start space-y-[15px]"></div>

            <!-- CODDING: Botões -->
            <div class="px-[16px] w-full flex flex-col space-y-[5px]">
                ${this.buttonsInnerHTML}
            </div>
        </div>
      </div>

      <div class="w-full py-[16px] flex flex-row justify-center items-center space-x-[5px] px-[16px]">
            <!-- CODDING: Botão de editar -->
            <div id="${child.id}-edit" class="cursor-pointer flex-1 h-[40px] bg-purple rounded-[10px] flex flex-row justify-center items-center text-sm text-white space-x-[10px]">
                <i class="fa-solid fa-pen"></i>
                <p>Editar</p>
            </div>
            <!-- CODDING: Botão de deletar -->
            <div class="cursor-pointer flex-1 h-[40px] bg-purple rounded-[10px] flex flex-row justify-center items-center text-sm text-white space-x-[10px]">
                <i class="fa-solid fa-trash"></i>
                <p>Deletar</p>
            </div>
      </div>
      
        <div id="${child.id}-button-adicionar-ou-remover" class="cursor-pointer w-full h-[40px] bg-purple rounded-br-[10px] text-sm text-white rounded-bl-[10px] flex flex-row justify-center items-center space-x-[10px]">
            <i class="fa-solid fa-${child.children?.length>0?'minus':'plus'}"></i>
            <p>${child.children?.length>0?'Remover':'Adicionar'}</p>
        </div>`;


        // criar e adicionar elemento de card
        if(this.type === "card"){
            this.cardElement = new CardElement({children: this.child});
            const elements = this.element.querySelector(`#elements`);
            console.log('ELEMENTS:', elements);
            elements.appendChild(this.cardElement.element);
        }

        // criar elemento de video
        if(this.type === "video" && this.video && this.video.video_url){
            this.videoElement = new VideoElement({children: this.child});
            const elements = this.element.querySelector('#elements');
            elements.appendChild(this.videoElement.element);
        }

        // criar elemento de audio
        if(this.type === "audio" && this.audio && this.audio.audio_url){
            this.audioElement = new AudioElement({children: this.child});
            const elements = this.element.querySelector('#elements');
            elements.appendChild(this.audioElement.element);
        }

        // criar elemento de imagem 
        if(this.type === "image" && this.image && this.image.image_url){
            this.imageElement = new ImageElement({children: this.child});
            const elements = this.element.querySelector('#elements');
            elements.appendChild(this.imageElement.element);
        }

        // criar elemento de file
        if(this.type === "file" && this.file && this.file.file_url){
            this.fileElement = new FileElement({children: this.child});
            const elements = this.element.querySelector('#elements');
            elements.appendChild(this.fileElement.element);
        }   

        // criar e adicionar elemento de atraso
        if(this.delay && this.delay.seconds && this.delay.seconds > 0){
            this.delayElement = new DelayElement({children: this.child});
            const elements = this.element.querySelector('#elements');
            elements.appendChild(this.delayElement.element);
        }

        
    }

    addEvents(){
        this.editEvent(); // editar
        this.addAndRemoveChildrenEvent(); // adicionar ou remover children
    }

    editEvent(){
        const button = document.getElementById(`${this.child.id}-edit`);
        button.addEventListener('click',()=>{
            this.fluxogramaInstance.popupEditar.show(this.child);
        });
    }

    addAndRemoveChildrenEvent(){
        const button = document.getElementById(`${this.child.id}-button-adicionar-ou-remover`);
        button.addEventListener('click',()=>{
            if(this.child.children.length>0){ // remover children
                console.log('remover children:', this.child);
            }else{ // adicionar children
                this.fluxogramaInstance.showPopupAddChildren({childrenElement: this}); // mostrar popup
            }
        });
    }
}

class PopupEditar{
    constructor({fluxogramaInstance}){
        this.fluxogramaInstance = fluxogramaInstance;
        this.children = undefined;
        this.file = {
            type:"",
            name:"",
            size:0,
            lastModified: 0,
            lastModifiedDate: Date()
        }

        // CODDING: Adicionar eventos
        this.closeEvent();
        this.onChangeEvent();

        this.addImage();
        this.addAudio();
        this.addVideo();
        this.addArquivo();
        

    }
    show(children){
        this.children = children;
        const popupBackground = document.getElementById('popup-background-full');
        const popupEditar = document.getElementById('popup-editar');

        // alterar texto
        const childrenContentElement = document.getElementById('popup-editar-children-content');
        childrenContentElement.textContent = children.content;

        // adicionar botões
        const buttonsElement = document.getElementById('popup-editar-botoes');
        buttonsElement.innerHTML = ``;
        children.buttons.forEach(button=>{
            const buttonElement = document.createElement('button');
            buttonElement.className = `bg-white rounded-[10px] h-[40px] w-full text-sm text-[#404040]`;
            buttonElement.innerHTML = `${button.title}`;
            buttonsElement.appendChild(buttonElement);
        });

        
        popupBackground.classList.remove('hidden');
        popupEditar.classList.remove('hidden');
    }
    hidden(children){
        const popupBackground = document.getElementById('popup-background-full');
        const popupEditar = document.getElementById('popup-editar');
        popupBackground.classList.add('hidden');
        popupEditar.classList.add('hidden');
    }

    showUpload({type}){
        const pushUploadElement = document.getElementById('popup-editar-push-upload');
        const viewFileElement = document.getElementById('popup-editar-view-file');
        viewFileElement.classList.add('hiiden');
        pushUploadElement.classList.add('hidden');

        const inputFileElement = document.getElementById('popup-editar-inputfile');
        inputFileElement.classList.remove('hidden');

        if(type==="video"){
            const inputFileElement = document.getElementById('popup-editar-input-file');
            inputFileElement.setAttribute('accept','video/*');
            const inputFileText = document.getElementById('popup-editar-inputfile-text');
            inputFileText.innerHTML = `click para <span class="font-black">enviar video</span>`;
            const inputFileAccept = document.getElementById('popup-editar-inputfile-accept');
            inputFileAccept.innerHTML = `MP4, MOV, AVI ou MKV (MAX. 25MB)`;
        }
        if(type === "imagem"){
            const inputFileElement = document.getElementById('popup-editar-input-file');
            inputFileElement.setAttribute('accept','image/*');
            const inputFileText = document.getElementById('popup-editar-inputfile-text');
            inputFileText.innerHTML = `click para <span class="font-black">enviar imagem</span>`;
            const inputFileAccept = document.getElementById('popup-editar-inputfile-accept');
            inputFileAccept.innerHTML = `PNG, JPEG, WEBP ou SVG (MAX. 25MB)`;
        }
        if(type === "audio"){
            const inputFileElement = document.getElementById('popup-editar-input-file');
            inputFileElement.setAttribute('accept','audio/*');
            const inputFileText = document.getElementById('popup-editar-inputfile-text');
            inputFileText.innerHTML = `click para <span class="font-black">enviar audio</span>`;
            const inputFileAccept = document.getElementById('popup-editar-inputfile-accept');
            inputFileAccept.innerHTML = `MP3, OGG, WAV ou AAC (MAX. 25MB)`;
        }
        if(type === "arquivo"){
            const inputFileElement = document.getElementById('popup-editar-input-file');
            inputFileElement.removeAttribute('accept');
            const inputFileText = document.getElementById('popup-editar-inputfile-text');
            inputFileText.innerHTML = `click para <span class="font-black">enviar arquivo</span>`;
            const inputFileAccept = document.getElementById('popup-editar-inputfile-accept');
            inputFileAccept.innerHTML = `PDF, DOC, XLS (MAX. 25MB)`;
        }
    }

    showPushFile(type){
        const inputFileElement = document.getElementById('popup-editar-inputfile');
        const viewFileElement = document.getElementById('popup-editar-view-file');
        viewFileElement.classList.add('hidden');
        inputFileElement.classList.add('hidden');

        const pushFileElement = document.getElementById('');
    }

    
    

    addImage(){
        const buttonAddImageElement = document.getElementById('popup-editar-button-add-image');
        
        buttonAddImageElement.addEventListener('click',()=>{
            
            this.showUpload({type:"imagem"});
        });
        console.log('FUNÇÃO addImage() EXECUTADA');
    }
    addAudio(){
        const buttonAddAudioElement = document.getElementById('popup-editar-button-add-audio');
        buttonAddAudioElement.addEventListener('click',()=>{
            this.showUpload({type: "audio"});
        });
    }
    addVideo(){
        const buttonAddVideoElement = document.getElementById('popup-editar-button-add-video');
        buttonAddVideoElement.addEventListener('click',()=>{
            this.showUpload({type: "video"})
        });
    }
    addArquivo(){
        const buttonAddArquivoElement = document.getElementById('popup-editar-button-add-arquivo');
        buttonAddArquivoElement.addEventListener('click',()=>{
            this.showUpload({type: "arquivo"});
        })
    }
    addAtraso(){
        
    }

    closeEvent(){
        const button = document.getElementById('popup-editar-button-close');
        button.addEventListener('click',()=>{
            this.hidden(); // fechar popup
        });
    }

    onChangeEvent(){
        const inputFileElement = document.getElementById('popup-editar-input-file');
        inputFileElement.addEventListener('change',(event)=>{
            this.file.type = event.target.files[0].type;
            this.file.name = event.target.files[0].name;
            this.file.size = event.target.files[0].size;
            this.file.lastModified = event.target.files[0].lastModified;
            this.file.lastModifiedDate = event.target.files[0].lastModifiedDate;


        });
    }

}

class UserAPI{
    constructor({fluxogramaInstance}){
        this.fluxogramaInstance = fluxogramaInstance;
        this.token = document.cookie.split('; ').find(cookie=>cookie.startsWith('token'))?.split('=')[1];

        // Obter o domínio atual
        this.currentDomain = window.location.origin;

        // CODDING: Rotas
        this.getAccountsFbUrl = `${this.currentDomain}/api/user/accounts?token=${this.token}`;
        this.getPagesFbWithIdUrl = `${this.currentDomain}/api/user/pages?token=${this.token}`;
    }
    
    async getAccountsFb(){
        try{
            const response = await fetch(`${this.getAccountsFbUrl}`,{method: "GET"});
            if(response.ok){
                const accounts = await response.json();
                accounts.accounts.push({name: "João Santos", idAccount: "348472384243453245", photo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6EC79Lum2s_YP1XHuO6VjqtAdVF3UW4yTPqFqoHeuuQ&s"});
                return accounts.accounts;
            
            }
            return [];
        }catch(error){
            return [];
        }
    }

    async getPagesFb(idAccountFb){
        try{    
            const url = this.getPagesFbWithIdUrl+`&idAccountFb=${idAccountFb}`;
            const response = await fetch(url,{method: "GET"});
            
            if(response.ok){
                const pages = await response.json();
                return pages; 
            }
            return [];
        }catch(error){
            return [];
        }
    }
}   

class ChatbotAPI{
    constructor({fluxogramaInstance}){
        this.fluxogramaInstance = fluxogramaInstance;
        this.token = document.cookie.split('; ').find(cookie=>cookie.startsWith('token'))?.split('=')[1];

        // Obter o domínio atual
        this.currentDomain = window.location.origin;

        // CODDING: Rotas
        this.getChatbotsUrl = `${this.currentDomain}/api/chatbot?token=${this.token}`;
      
        this.getChatbotUrl = `${this.currentDomain}/api/chatbot`;
    }

    async getPosts({idPage}){
        try{
            const url = `${this.currentDomain}/api/chatbot/page/${idPage}/posts?token=${this.token}`
            const request = await fetch(url, {method: "GET"});
            if(request.ok){
                const response = await request.json();
                return { status: true, posts:response.posts };
            }else{
                const response = await request.json();
                return { status: false, posts: [], response: response }; 
            }
        }catch(error){
            return { status: false, posts: [], error: `${error}` };
        }
    }

    async addFirstChildren({chatbotId, children}){
        try{
            const url = `${this.currentDomain}/api/chatbot/${chatbotId}?token=${this.token}`; 
            const body = {
                flowchart:{
                    addFirstChildren:children
                }
            };

            const request = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            if(request.ok){
                const response = await request.json();
                if(response.updateKeys.includes("@addFirstChildren children.children")){
                    return {status: true, response: response};
                }
                return {status: false, response: response};
            }else{
                const response = await request.json();
                return {status: false, response: response};
            }
        }catch(error){
            return {status: false, response: {}, error: `${error}`};
        }
    }

    async getPostWithId({chatbot, postId}){
        try{
            console.log('chatbot:', chatbot);
            console.log('chatbot.page:',chatbot.page);
            console.log('chatbot.page.page:', chatbot.page.page);
            console.log('chatbot.page.page.idPage:', chatbot.page.page.idPage);
            const idPage = chatbot.page.page.idPage;
            const url = `${this.currentDomain}/api/chatbot/page/${idPage}/post/${postId}?token=${this.token}`;
            const requestPost = await fetch(url,{method: "GET"});
            if(requestPost.ok){
                const response = await requestPost.json();
                return {status:true, response:response};
            }else{
                const response = await requestPost.json();
                return {status: false, response: response};
            }
        }catch(error){
            return {status: false, response:{}, error:`${error}`};
        }
    }

    async alterarNomeDoChatbot({chatbot, name}){
        try{
            console.log('valor de chatbot:', chatbot);
            console.log('valor de name:', name);
            const url = `${this.currentDomain}/api/chatbot/${chatbot._id}?token=${this.token}`;
            const request = await fetch(url, {method: "PUT", headers: {"Content-Type": "application/json"},body:JSON.stringify({name:name})});
            if(request.ok){
                const response = await request.json();
                
                if(response.updateKeys.includes('name')){
                    return {status: true, chatbot: response.chatbot};
                }else{
                    return {status: false, chatbot: {}, response: response};
                }
            }else{

            }
        }catch(error){  
            return { status: false, chatbot: {}, error: error};
        }
    }
    
    async desligarChatbot(chatbot){
        try{
            const url = `${this.currentDomain}/api/chatbot/${chatbot._id}?token=${this.token}`;
            const request = await fetch(url, {method: "PUT",headers: {"Content-Type": "application/json"},body:JSON.stringify({status:"desligado"})});
            if(request.ok){
                const response = await request.json();
                if(response.updateKeys.includes('status')){
                    return {status: true, chatbot: response.chatbot};
                }else{
                    return {status: false, chatbot:{},response:response};
                }
            }else{
                const response = await request.json();
                return {status: false, chatbot:{},response:response};
            }
            
        }catch(error){
            return {status: false, chatbot:{}, error:`${error}`};
        }
    }

    async ligarChatbot(chatbot){
        try{
            const url = `${this.currentDomain}/api/chatbot/${chatbot._id}?token=${this.token}`;
            const request = await fetch(url, {method: "PUT",headers: {"Content-Type": "application/json"},body:JSON.stringify({status:"ligado"})});
            if(request.ok){
                const response = await request.json();
                if(response.updateKeys.includes('status')){
                    return {status: true, chatbot: response.chatbot};
                }else{
                    return {status: false, chatbot:{}};
                }
            }else{
                const response = await request.json();
                return {status: false, chatbot:{},response:response};
            }
            
        }catch(error){

        }
    }  

    async updateChatbot(chatbot, update){
        try{
            

            const url = `${this.currentDomain}/api/chatbot/${chatbot._id}?token=${this.token}`;
            const request = await fetch(url, {method: "PUT", headers: {
                "Content-Type": "application/json" // Indica que o corpo da requisição é JSON
            },
            body: JSON.stringify(update)});
           
            if(request.ok){
                const update = await request.json();
                return update;
            }else{
                
                const updadeError = await request.json()
                return updadeError
            }
            
        }catch(error){
            return {error: `${error}`};
        }
    }

    async getChatbots(){
        try{
            const response = await fetch(this.getChatbotsUrl,{method: "GET"});
           
            if(response.ok){
                const chatbots = await response.json();
                return chatbots.chatbots;
            }else{
                return [];
            }
        }catch(error){
            return [];
        }
    }

    async getChatbot(chatbotId){
        try{
            const url = `${this.getChatbotUrl}/${chatbotId}?token=${this.token}`;
            const request = await fetch(url, {method: "GET"});
            if(request.ok){
                const chatbot = await request.json();
                return chatbot;
            }
            return {};
        }catch(error){
            return {};
        }
    }
}

class PopupEditarTrigger{
    constructor({fluxogramaInstance, chatbot, triggerChanged}){
        this.fluxogramaInstance = fluxogramaInstance;

        this.id = "popup-editar-trigger";
        this.idBackground = "popup-background-full";

        // selects
        const selectTrigger = '';
        const selectTriggerPost = '';

        // dados do elemento
        this.chatbot = chatbot;
        this.trigger = {...this.chatbot.flowchart.trigger};
        if(triggerChanged){
            this.triggerChanged = triggerChanged;
        }else{
            this.triggerChanged = {...this.chatbot.flowchart.trigger};
        }

        // criar elemento
        this.element = this.createElement();

        if(this.triggerChanged.type === "comment" && this.triggerChanged.postId){  
            this.selectTrigger = "comment";
            this.selectTriggerPost = "specific-post";

            this.showPostElement(); // carregar post

            this.verifyChanged();
        }



        //
        this.addEvents();
    }

    addEvents(){
        this.closeEvent();
        this.selectTriggerEvent();
        this.addKeywordEvent();
        this.addNegativeKeywordEvent();
        this.typingInInputAddKeywordEvent();
        this.typingInInputAddNegativeKeywordEvent();
        this.buttonSelectPostEvent();
        this.buttonChangePostEvent();
        this.buttonSalvarAlteracoes();
    }

    show(){
        const popupBackgroundElement = document.getElementById(this.idBackground);
        if(popupBackgroundElement){
            popupBackgroundElement.classList.remove('hidden');
        }

        const popupEditarTrigger = document.getElementById(this.id);
        if(popupEditarTrigger){
            popupEditarTrigger.remove();
        }

        popupBackgroundElement.insertAdjacentElement('afterend', this.element);

    }

    verifyChanged(){

        console.log(`verifyChanged() | this.triggerChanged:`,this.triggerChanged);
        console.log(`verifyChanged() | this.trigger:`, this.trigger);

        const showButton = () => { // mostrar botão de salvamento
            const buttonContainer = this.element.querySelector(`#popup-editar-trigger-salvar`);
            buttonContainer.classList.remove('hidden');
        } 
        const hiddenButton = () => { // esconder botão de salvamento
            const buttonContainer = this.element.querySelector(`#popup-editar-trigger-salvar`);
            buttonContainer.classList.add('hidden');
        }

        const changesFound = []; 

        // verificar alteração no type
        if(this.triggerChanged.type !== this.trigger.type){
            if(this.triggerChanged.type === "comment" && this.triggerChanged.postId){
                changesFound.push(`trigger.type`);
            }else{
                changesFound.push(`trigger.type`);
            }
        }

        // verificar alteração no keyword
        const keywordTriggerChanged = this.triggerChanged.keyword.split(',').map(keyword=> keyword.trim());
        const keywordTrigger = this.trigger.keyword.split(',').map(keyword=> keyword.trim());
        if(keywordTriggerChanged.length !== keywordTrigger.length){ // "this.triggerChanged.keyword" alterado
            changesFound.push(`trigger.keyword`);
        }else{
            keywordTriggerChanged.forEach(keyword=>{
                if(!keywordTrigger.includes(keyword)){ // palavra-chave diferente
                    if(!changesFound.includes('trigger.keyword')) changesFound.push(`trigger.keyword`);
                    return
                }
            })
        }

        // verificar alteração no negativeKeyword
        const negativeKeywordTriggerChanged = this.triggerChanged.negativeKeyword.split(',').map(keyword=> keyword.trim());
        const negativeKeywordTrigger = this.trigger.negativeKeyword.split(',').map(keyword=> keyword.trim());
        if(negativeKeywordTriggerChanged.length !== negativeKeywordTrigger.length){ // "this.triggerChanged.keyword" alterado
            changesFound.push(`trigger.keyword`);
        }else{
            negativeKeywordTriggerChanged.forEach(keyword=>{
                if(!negativeKeywordTrigger.includes(keyword)){ // palavra-chave diferente
                    if(!changesFound.includes('trigger.keyword')) changesFound.push(`trigger.keyword`);
                    return
                }
            })
        }
        

        // verificar alteração no postId
        // if(this.selectTrigger === "comment" && this.selectTriggerPost === "any-post")
        if(this.triggerChanged.postId !== this.trigger.postId && this.triggerChanged.type === "comment"){
            
            if(this.selectTrigger === "comment" && this.selectTriggerPost === "any-post"){
                changesFound.push(`trigger.postId`);
            }
            if(this.selectTrigger === "comment" && this.selectTriggerPost === "specific-post"){
                if(this.triggerChanged.postId.length > 0){
                    changesFound.push(`trigger.postId`);
                }
            }
            
        }

        if(changesFound.length > 0){ // alterações encontradas
            showButton();
        }else{ // nenhuma alteração encontrada
            hiddenButton();
        }


    }

    

    async showPostElement(){ // mostrar postagem
        const trigger = this.triggerChanged;
        
        // CODDING: Carregar publicação
        if(trigger.type === "comment" && trigger.postId){
            // mostrar select-trigger-post
            const selectTriggerPostElement = this.element.querySelector('#select-trigger-post');
            selectTriggerPostElement.classList.remove('hidden');

            selectTriggerPostElement.options[0].selected = true;
            

            // mostrar postId carregando
            const postLoadingElement = this.element.querySelector('#post-loading');
            postLoadingElement.classList.remove('hidden');

            // fazer requisição pra pegar informações do post pelo postId
            const postRequest = await this.fluxogramaInstance.chatbotApi.getPostWithId({chatbot: this.chatbot, postId: trigger.postId});
            console.log('resposta da requisição:', postRequest);
            if(postRequest.status === true){ // post encontrado
                // esconder post carregando
                postLoadingElement.classList.add('hidden');

            
                const postElement = this.element.querySelector('#post');

                // alterar logo da pagina na publicação
                const postLogoElement = postElement.querySelector('#post-logo');
                postLogoElement.src = this.chatbot.page.page.photo;

                // alterar titulo da pagina na publicação
                const postTitleElement = postElement.querySelector('#post-title');
                postTitleElement.textContent = this.chatbot.page.page.name;

                // alterar data de criação do publicação
                const dataDeCriacao = new Date(postRequest.response.post.created_time);
                const dia = dataDeCriacao.getDate().toString().padStart(2,'0');
                const mes = (dataDeCriacao.getMonth()+1).toString().padStart(2,'0');
                const ano = dataDeCriacao.getFullYear();
                const hora = dataDeCriacao.getHours().toString().padStart(2,'0');
                const minutos = dataDeCriacao.getMinutes().toString().padStart(2,'0');
                const segundos = dataDeCriacao.getSeconds().toString().padStart(2,'0');
                const dataDeCriacaoFormatada = `${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos}`;
                const postDateElement = postElement.querySelector("#post-date");
                postDateElement.textContent = dataDeCriacaoFormatada;

                // alterar conteúdo da publicação
                const postContentElement = postElement.querySelector('#post-content');
                postContentElement.textContent = postRequest.response.post.message;
                
                // alterar imagem da publicação
                const postImageElement = postElement.querySelector('#post-image');
                postImageElement.src = postRequest.response.post.full_picture;

                // alterar link pra visualizar publicação no facebook
                const postLinkElement = postElement.querySelector('#post-link');
                postLinkElement.href = `https://facebook.com/${trigger.postId}`;

                // mostrar post
                postElement.classList.remove('hidden');

                // mostrar botão de alterar post
                const buttonChangePostElement = this.element.querySelector('#button-change-post');
                buttonChangePostElement.classList.remove('hidden');

            }else{ // post não encontrado
                // esconder post carregando
                postLoadingElement.classList.add('hidden');

                // mostrar mensagem de erro
                const postErrorElement = this.element.querySelector('#post-error-container');
                const postErrorParagraph = postErrorElement.querySelector('p');
                postErrorParagraph.textContent = `Nenhum post encontrado com esse ID(${trigger.postId}) especifico`;
                postErrorElement.classList.remove('hidden');

                // e mostrar botão de selecionar publicação


            }


            
        }

        if(trigger.type === "comment" && !trigger.postId){
           

            // mostrar select-trigger-post
            const selectTriggerPostElement = this.element.querySelector('#select-trigger-post');
            selectTriggerPostElement.classList.remove('hidden');

            selectTriggerPostElement.options[0].selected = true;
            

            // remover post carregando
            const postLoadingElement = this.element.querySelector('#post-loading');
            postLoadingElement.classList.add('hidden');

            // remover post
            const postElement = this.element.querySelector('#post');
            postElement.classList.add('hidden');

            // remover botão de alterar post
            const buttonSelectedPostElement = this.element.querySelector('#button-select-post');
            buttonSelectedPostElement.classList.remove('hidden');

            // mostrar botão de escolher post
            const buttonChangePostElement = this.element.querySelector('#button-change-post');
            buttonChangePostElement.classList.add('hidden');

            console.log('FOI ATÉ O FINAL DA CONDIÇÃO: trigger.type === "comment" && !trigger.postId');


        }
    }
   
    createElement(){
        const element = document.createElement('div');

        element.id = "popup-editar-trigger";
        element.className = `fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[450px] h-[500px] bg-white rounded-[10px] z-[51] flex flex-col items-start justify-start`;

        let trigger = this.triggerChanged;

        
        element.innerHTML = `<!-- CODDING: Titulo -->
        <div class="w-full flex flex-row justify-start items-center py-[32px] px-[32px] space-x-[10px] bg-purple rounded-tl-[10px] rounded-tr-[10px] relative">
          <!-- CODDING: Botão Fechar -->
          <div id="popup-editar-trigger-button-close" class="absolute top-[32px] right-[32px] h-[40px] w-[40px] hover:bg-[#823f87] rounded-full flex justify-center items-center text-sm text-white cursor-pointer">
            <i class="fa-solid fa-xmark"></i>
          </div>
    

          <i class="fa-brands fa-facebook-messenger text-white text-xl"></i>
          <div class="flex flex-col justify-center items-start">
            <p class="text-sm text-white">Facebook</p>
            <p class="text-base/none text-white">Editar Gatilho</p>
          </div>
        </div>
    
        <div class="w-full h-[500px] overflow-y-auto">
    
          <div class="w-full h-full flex flex-col items-start justify-start py-[32px]">
            <div class="w-full flex flex-col justify-center items-start">
    
              <div class="px-[32px] flex flex-col justify-center items-start ">
                <!-- CODDING: Texto -->
                <p class="text-base pb-[16px]">Uma <span class="font-semibold">mensagem de resposta</span> será enviada quando um usuario:</p>
    
                <div class="flex flex-row justify-start items-center space-x-[10px] w-full">
                  <i class="fa-solid fa-bolt min-w-[40px] min-h-[40px] rounded-[10px] bg-purple text-white flex justify-center items-center text-sm shadow-[0_3px_8px_rgba(0,0,0,0.24)]"></i>
    
                  <!-- CODDING: Selecionar o tipo de gatilho -->
                  <select id="select-trigger" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#752A7A] focus:border-[#752A7A] block w-full p-2.5">
                    ${!trigger.type?`<option value="chooseTrigger" disabled selected>Escolha um gatilho</option>`:``}
                    <option value="comment" ${trigger.type ==="comment" ? 'selected':''}>fazer um comentário na página</option>
                    <option value="message" ${trigger.type ==="message" ? 'selected':''}>enviar mensagem na página</option>
                  </select>
                </div>

                <div class="w-full flex flex-col justify-center items-center pl-[50px]">
                    <!-- CODDING: Selecionar publicação ou qualquer publicação -->
                    <select id="select-trigger-post" class="${trigger.type === "comment"?"":"hidden"} bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#752A7A] focus:border-[#752A7A] block w-full p-2.5">
                        <option value="specific-post" ${(trigger.type === "comment" && trigger.postId) ? 'selected':''}>em uma publicação específica</option>
                        <option value="any-post" ${(trigger.type === "comment" && !trigger.postId) ? 'selected':''}>em qualquer publicação</option>
                    </select>

                    <!-- CODDING: Postagem do Facebook -->
                    <div id="post" class="border-[1px] border-gray-200 hidden flex flex-col justify-center items-center bg-white rounded-[10px] mt-[16px] shadow-[0_3px_8px_rgba(0,0,0,0.24)] relative">

                        <!-- CODDING: Logo, nome e data de criação da pagina -->
                        <div class="pt-[16px] px-[16px] w-full flex flex-row justify-start items-center space-x-[10px]">
                            <!-- CODDING: Logo -->
                            <div class="min-h-[40px] min-w-[40px] max-h-[40px] max-w-[40px] bg-purple rounded-full shadow-[0_3px_8px_rgba(0,0,0,0.24)] relative">
                                <img id="post-logo" src="" alt="logo do post" class="w-full h-full rounded-full">

                                <img class="absolute bottom-[-5px] right-0 min-w-[20px] max-w-[20px] rounded-full bg-white" src="https://www.gov.br/mre/pt-br/delbrasupa/facebook-logo-blue-circle-large-transparent-png.png/@@images/image.png" alt="logo do facebook">
                            </div>
                            <div class="flex-grow flex flex-col justify-center items-start">
                            <!-- CODDING: Nome da pagina -->
                            <p id="post-title" class="text-sm font-bold">Titulo da pagina</p>
                            <!-- CODDING: Data de criação da postagem-->
                            <p id="post-date" class="text-xs font-normal text-gray-400">20/04/2024 14:37:00 PM</p>
                            </div>
                        </div>

                        <!-- CODDING: Conteudo da postagem -->
                        <div class="w-full px-[16px] py-[16px]">
                            <p id="post-content" class="text-sm">"Planeje, economize, invista: o caminho para a estabilidade financeira começa com pequenos passos." 💼💰 #FinançasPessoais</p>
                        </div>
                    
                        <!-- CODDING: Imagem da postagem -->
                        <div  class="w-full h-[150px] flex px-[16px] pb-[16px]">
                            <img id="post-image" class="w-full h-full rounded-[10px] shadow-[0_3px_8px_rgba(0,0,0,0.24)]" src="https://scontent.fcau2-1.fna.fbcdn.net/v/t39.30808-6/437950440_827236152778123_868638692935331847_n.jpg?stp=dst-jpg_s640x640&_nc_cat=1&ccb=1-7&_nc_sid=5f2048&_nc_ohc=f2fm47OZAhcAb4hZZnr&_nc_ht=scontent.fcau2-1.fna&oh=00_AfDDNtf57wjFj4wH-AvlaUJTGkcMsOrK-XZPEOSs-ahtAw&oe=6629E1E9" alt="">
                        </div>

                        <!-- CODDING: Botão pra ver publicação no facebook -->
                        <div class="w-full flex flex-row justify-end items-center space-x-[5px] text-sm pb-[16px] px-[16px]">
                            <a id="post-link" href="" target="_blank" class="flex flex-row text-center items-center space-x-[5px] hover:text-[#0863F7]">
                            <i class="fa-solid fa-link"></i>
                            <p>visualizar publicação no facebook</p>
                            </a>
                        </div>

                        <!-- CODDING: Icone de selecionado -->
                        <div class="hidden absolute right-[-20px] top-[-20px] min-w-[40px] min-h-[40px] rounded-full bg-white  flex justify-center items-center shadow-[0_3px_8px_rgba(0,0,0,0.24)]">
                        <i class="fa-solid fa-check text-xl text-purple"></i>
                        </div>
                    </div>

                    <!-- CODDING: Postagem do Facebook carregando -->
                    <div id="post-loading" class="hidden w-full flex flex-col justify-center items-center bg-white rounded-[10px] my-[16px] shadow-[0_3px_8px_rgba(0,0,0,0.24)]">

                        <!-- CODDING: Logo, nome e data de criação da pagina -->
                        <div class="pt-[16px] px-[16px] w-full flex flex-row justify-start items-center space-x-[10px]">
                            <!-- CODDING: Logo -->
                            <div class="min-h-[40px] min-w-[40px] bg-gray-200 rounded-full animate-pulse"></div>
                            <div class="flex-grow flex flex-col justify-center items-start space-y-[5px]">
                            <!-- CODDING: Nome da pagina -->
                            <p class="min-h-[20px] rounded-full w-[160px] bg-gray-200 animate-pulse"></p>
                            <!-- CODDING: Data de criação da postagem-->
                            <p class="min-h-[20px] rounded-full w-[100px] bg-gray-200 animate-pulse"></p>
                            </div>
                        </div>

                        <!-- CODDING: Conteudo da postagem -->
                        <div class="w-full px-[16px] py-[16px] space-y-[5px]">
                            <p class="w-full min-h-[20px] rounded-full w-[100px] bg-gray-200 animate-pulse"></p>
                            <p class="w-[50%] min-h-[20px] rounded-full w-[100px] bg-gray-200 animate-pulse"></p>
                        </div>
                        
                        <!-- CODDING: Imagem da postagem -->
                        <div  class="w-full h-[250px] flex px-[16px] pb-[16px]">
                            <div class="w-full h-full rounded-[10px] bg-gray-200 animate-pulse" alt=""></div>
                        </div>
                    </div>

                    <div id="post-error-container" class="hidden w-full my-[16px]">
                        <p class="text-sm text-red-500">Nenhum post encontrado com esse ID especifico</p>
                    </div>
              </div>

              

              <!-- CODDING: Botão de escolher publicação e alterar publicação-->
              <div class="w-full flex flex-col justify-center items-center">
                
                <!-- CODDINH: Botão escolher publicação -->
                <div class="pl-[50px] pt-[10px] space-y-[5px] w-full flex flex-col justify-center items-center">
                    <!-- CODDING: Botão de selecionar publicação -->
                    <button id="button-select-post" class="hidden min-h-[40px] rounded-lg shadow-[0_3px_8px_rgba(0,0,0,0.24)] bg-purple text-sm text-white hover:bg-[#823f87] w-full">Selecionar Publicação</button>
                    <!-- CODDING: Botão de alterar publicação -->
                    <button id="button-change-post" class="hidden min-h-[40px] rounded-lg shadow-[0_3px_8px_rgba(0,0,0,0.24)] bg-purple text-sm text-white hover:bg-[#823f87] w-full">Alterar Publicação</button>
                </div>

                
              </div>

              
              </div>
    
              <!-- CODDING: Palavras chaves -->
              <div class="px-[32px] py-[16px] flex flex-col justify-center items-start space-y-[16px]">
                <!-- CODDING: Texto -->
                <p id="keyword-paragraph" class="text-base">e o comentário <span class="font-semibold">contém</span> alguma destas palarvas-chaves:</p>
    
                <!-- CODDING: Palavras chaves-->
                <div id="keyword-list" class="flex flex-row flex-wrap justify-start items-center space-x-[5px] space-y-[5px]">
                    
                </div>
    
                <!-- CODDING: Adicionar palavra-chave -->
                <div class="flex flex-row justify-start items-center w-full space-x-[16px]">
                  <input id="input-add-keyword" type="text" class="flex-grow min-h-[40px] border-t-none border-l-none border-r-none border-b border-gray-300 text-sm outline-none focus:border-[#752A7A]" placeholder="adicionar palavra-chave">
                  <i id="button-add-keyword" class="fa-solid fa-plus min-h-[40px] min-w-[40px] rounded-[10px] bg-purple text-white flex justify-center items-center cursor-pointer shadow-[0_3px_8px_rgba(0,0,0,0.24)] hover:bg-[#823f87]"></i>
                </div>
    
                
              </div>
    
              <!-- CODDING: Palavras chaves negativas -->
              <div class="px-[32px] pt-[16px] pb-[32px] flex flex-col justify-center items-start space-y-[16px]">
                <!-- CODDING: Texto -->
                <p id="negativeKeyword-paragraph" class="text-base">e o comentário <span class="font-semibold">não contém</span> nenhuma destas palarvas-chaves:</p>
    
                <!-- CODDING: Visualizar palavras chaves negativas -->
                <div id="negativeKeyword-list" class="flex flex-row flex-wrap justify-start items-center space-x-[5px] space-y-[5px]">
                
                </div>
    
                <!-- CODDING: Adicionar palavra-chave negativas -->
                <div class="flex flex-row justify-start items-center w-full space-x-[16px]">
                  <input id="input-add-negativeKeyword" type="text" class="flex-grow min-h-[40px] border-t-none border-l-none border-r-none border-b border-gray-300 text-sm outline-none focus:border-[#752A7A]" placeholder="adicionar palavra-chave negativa">
                  <i id="button-add-negativeKeyword" class="fa-solid fa-plus min-h-[40px] min-w-[40px] rounded-[10px] bg-purple text-white flex justify-center items-center cursor-pointer shadow-[0_3px_8px_rgba(0,0,0,0.24)] hover:bg-[#823f87]"></i>
                </div>
              </div>
    
            </div>
    
           
          </div>
        </div>

        <!-- CODDING: Salvar alterações -->
        <div id="popup-editar-trigger-salvar" class="hidden shadow-[0_5px_15px_rgba(0,0,0,0.35)] py-[16px] px-[32px] bg-white border-t-[1px] border-gray-200 rounded-bl-[10px] rounded-br-[10px] w-full flex flex-row justify-center items-center space-x-[5px]">
          <button id="button-salvar-alteracoes" class="w-full h-[40px] text-sm text-white bg-purple flex justify-center items-center space-x-[10px] rounded-[10px] transform shadow-[0_3px_8px_rgba(0,0,0,0.24)] hover:bg-[#823f87]">
            
            <p>Salvar Alterações</p>
    
            <!-- CODDING: Loading -->
            <svg aria-hidden="true" class="hidden inline w-6 h-6 text-transparent animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
          </button>
        
        </div>`;

        // CODDING: Palavras-chaves
        if(trigger.keyword){ 
            const keywordElements = trigger.keyword.split(',').map(keyword=>this.createKeywordElement({keyword:keyword,type:"keyword"}));
            const keywordContainer = element.querySelector('#keyword-list');
            keywordElements.forEach(keywordElement=>{
                keywordContainer.appendChild(keywordElement);
                this.closeKeywordEvent(keywordElement);
            })
        }

        // CODDING: Palavras-chaves negativas
        if(trigger.negativeKeyword){ 
            const negativekeywordElements = trigger.negativeKeyword.split(',').map(keyword=>this.createKeywordElement({keyword:keyword,type:"negativeKeyword"}));
            const negativeKeywordContainer = element.querySelector('#negativeKeyword-list');
            negativekeywordElements.forEach(negativeKeywordElement=>{
                negativeKeywordContainer.appendChild(negativeKeywordElement);
                this.closeKeywordEvent(negativeKeywordElement);
            })
        }
        


        return element;
    }

    
    // salvar alterações
    buttonSalvarAlteracoes(){
        const button = this.element.querySelector('#button-salvar-alteracoes');
        button.addEventListener('click',async ()=>{
            console.log('this.trigger:', this.trigger);
            console.log('this.triggerChanged:', this.triggerChanged);

            const request = await this.fluxogramaInstance.chatbotApi.chatbotUpdated(this.chatbot, this.triggerChanged);
            console.log('VALOR DO REQUEST:', request);
            if(request.ok){
                if(request.updateKeys.length > 0){
                    this.chatbot = request.chatbot;
                }
            }
        });
    }

    // CODDING: Fechar
    closeEvent(){
        const button = this.element.querySelector('#popup-editar-trigger-button-close');
        button.addEventListener('click',()=>{
            // remover background 
            const popupBackgroundElement = document.getElementById('popup-background-full');
            popupBackgroundElement.classList.add('hidden');


            // remover
            this.element.remove();
        })
    }

    buttonSelectPostEvent(){
        const button = this.element.querySelector(`#button-select-post`);
        button.addEventListener('click',()=>{
            // esconder popup de editar trigger
            this.element.remove();

            // mostrar popup de escolher publicação
            const popupChoosePost = new PopupChoosePost({fluxogramaInstance: this.fluxogramaInstance, chatbot: this.chatbot,triggerChanged: this.triggerChanged});
            popupChoosePost.show();
        });
    }
    buttonChangePostEvent(){
        const button = this.element.querySelector('#button-change-post');
        button.addEventListener('click',()=>{
            // esconder popup de editar trigger
            this.element.remove();

            // mostrar popup de escolher publicação
            const popupChoosePost = new PopupChoosePost({fluxogramaInstance: this.fluxogramaInstance, chatbot: this.chatbot, triggerChanged: this.triggerChanged});
            popupChoosePost.show();
        });

    }

    // CODDING: Keyword Methods
    closeKeywordEvent(keywordElement){
        const iconClose = keywordElement.querySelector('i');
        iconClose.addEventListener('click',()=>{
            const type = keywordElement.getAttribute('type');
            
            if(type === "keyword"){
                // remover palavra-chave do "this.triggerChanged.keyword"
                const keywordText = keywordElement.querySelector('p').textContent;
                const updateKeywords = this.triggerChanged.keyword.split(',').map(keyword=>keyword.trim()).filter(keyword=>keyword!==keywordText.trim());
                this.triggerChanged.keyword = updateKeywords.join(', ');

                console.log('[*] valor de this.trigger.keyword:',this.trigger.keyword);
                console.log('[*] closeKeywordEvent() --> valor de this.triggerChanged.keyword:', this.triggerChanged.keyword);
            }else if(type === "negativeKeyword"){
                // remover palavra-chave do "this.triggerChanged.negativeKeyword"
                const keywordText = keywordElement.querySelector('p').textContent;
                const updateKeywords = this.triggerChanged.negativeKeyword.split(',').map(keyword=>keyword.trim()).filter(keyword=>keyword!==keywordText.trim());
                this.triggerChanged.negativeKeyword = updateKeywords.join(', ');

                console.log('[*] valor de this.trigger.negativeKeyword:',this.trigger.negativeKeyword);
                console.log('[*] closeKeywordEvent() --> valor de this.triggerChanged.negativeKeyword:', this.triggerChanged.negativeKeyword);
            }else{
                // "keywordElement" sem referencia de tipo(keyword/negativeKeyword)
                return
            }
            

            // remover elemento do html
            keywordElement.remove();

            // verificar alterações e ativar botão de salvamento
            this.verifyChanged();

            

        });
    }
    createKeywordElement({keyword, type}){
        const keywordElement = document.createElement('div');
        keywordElement.setAttribute('type',`${type}`);
        keywordElement.className = `px-[16px] py-[8px] rounded-full bg-transparent border-gray-300 shadow-[0_3px_8px_rgba(0,0,0,0.24)] flex flex-row justify-center items-center space-x-[10px]`;
        keywordElement.innerHTML = `<p class="text-sm text-[#404040]">${keyword}</p><i class="fa-solid fa-xmark text-sm text-[#404040] cursor-pointer hover:text-[#752A7A]"></i>`;
        return keywordElement;
    }
    selectTriggerEvent(){


        const selectTriggerElement = this.element.querySelector('#select-trigger');
        const selectTriggerPostElement = this.element.querySelector('#select-trigger-post');
        
        selectTriggerElement.addEventListener('change',(event)=>{
            const isChooseTrigger = selectTriggerElement.querySelector(`option[value="chooseTrigger"]`);
            if(isChooseTrigger){
                isChooseTrigger.remove();
            }

            if(event.target.value === "message"){
                this.selectTrigger = "message";
                this.selectTriggerPost = "";
                
                this.triggerChanged.type = "message";
                this.triggerChanged.postId = "";

                // esconder "select" de trigger-post
                const selectTriggerPostElement = this.element.querySelector('#select-trigger-post');
                selectTriggerPostElement.classList.add('hidden');

                // esconder post
                const postElement = this.element.querySelector('#post');
                postElement.classList.add('hidden');

                // esconder botões de alterar/escolher publicação
                const buttonChangePostElement = this.element.querySelector('#button-change-post');
                const buttonSelectPostElement = this.element.querySelector('#button-select-post');
                buttonChangePostElement.classList.add('hidden');
                buttonSelectPostElement.classList.add('hidden');

                // alterar textos 
                const keywordParagraphElement = this.element.querySelector('#keyword-paragraph');
                keywordParagraphElement.innerHTML = `e a mensagem <span class="font-semibold">contém</span> alguma destas palavras-chaves:`;

                const negativeKeywordParagraphElement = this.element.querySelector('#negativeKeyword-paragraph');
                negativeKeywordParagraphElement.innerHTML = `e a mensagem <span class="font-semibold">não contém</span> nenhuma destas palavras-chaves:`;
                
            }

            if(event.target.value === "comment"){
                this.selectTrigger = "comment";
    
                this.triggerChanged.type = "comment";
                this.triggerChanged.postId = "";

                if(this.triggerChanged.type === "comment" && !this.triggerChanged.postId){
                    // mostrar select-trigger-post
                    const selectTriggerPostElement = this.element.querySelector('#select-trigger-post');
                    selectTriggerPostElement.classList.remove('hidden');

                    selectTriggerPostElement.options[1].selected = true;

                    this.selectTriggerPost = "any-post";

                    // esconder post carregando
                    const postLoadingElement = this.element.querySelector('#post-loading');
                    postLoadingElement.classList.add('hidden');

                    // esconder post
                    const postElement = this.element.querySelector('#post');
                    postElement.classList.add('hidden');

                    // esconder botões
                    const buttonChangePostElement = this.element.querySelector('#button-change-post');
                    const buttonSelectedPostElement = this.element.querySelector('#button-select-post');
                    buttonSelectedPostElement.classList.add('hidden');
                    buttonChangePostElement.classList.add('hidden');
                }

                // alterar textos 
                const keywordParagraphElement = this.element.querySelector('#keyword-paragraph');
                keywordParagraphElement.innerHTML = `e o comentário <span class="font-semibold">contém</span> alguma destas palavras-chaves:`;

                const negativeKeywordParagraphElement = this.element.querySelector('#negativeKeyword-paragraph');
                negativeKeywordParagraphElement.innerHTML = `e o comentário <span class="font-semibold">não contém</span> nenhuma destas palavras-chaves:`;
                
            }

            
            // verificar alterações e ativar botão de salvamento
            this.verifyChanged();

        });

        selectTriggerPostElement.addEventListener('change', (event)=>{
            console.log('event.target.value:', event.target.value);

            if(event.target.value === "specific-post"){
                this.selectTrigger = "comment";
                this.selectTriggerPost = "specific-post";

                this.triggerChanged.type = "comment";

                this.showPostElement(); // carregar post especifico
            }

            if(event.target.value === "any-post"){
                this.selectTrigger = "comment";
                this.selectTriggerPost = "any-post";

                this.triggerChanged.type = "comment";
                this.triggerChanged.postId = "";

                // esconder publicação carregando
                const postLoadingElement = this.element.querySelector('#post-loading');
                postLoadingElement.classList.add('hidden');

                // esconder publicação
                const postElement = this.element.querySelector('#post');
                postElement.classList.add('hidden');


                // esconder botões de alterar e escolher postagem
                const buttonSelectPostElement = this.element.querySelector(`#button-select-post`);
                const buttonChangePostElement = this.element.querySelector(`#button-change-post`);
                buttonSelectPostElement.classList.add('hidden');
                buttonChangePostElement.classList.add('hidden');


            }

            this.verifyChanged();
        });
    }
    typingInInputAddKeywordEvent(){
        const inputAddKeyword = this.element.querySelector('#input-add-keyword');
        inputAddKeyword.addEventListener('input',(event)=>{
            const character = event.data;
            if(character === ","){
                inputAddKeyword.value = inputAddKeyword.value.replace(',','');
            }
        });
    }
    typingInInputAddNegativeKeywordEvent(){
        const inputAddNegativeKeyword = this.element.querySelector('#input-add-negativeKeyword');
        inputAddNegativeKeyword.addEventListener('input',(event)=>{
            const character = event.data;
            if(character === ","){
                inputAddNegativeKeyword.value = inputAddNegativeKeyword.value.replace(',','');
            }
        });
    }
    addKeywordEvent(){
        const buttonAddKeyword = this.element.querySelector('#button-add-keyword');
        buttonAddKeyword.addEventListener('click',()=>{
            const inputAddKeyword = this.element.querySelector('#input-add-keyword');
            if(!inputAddKeyword.value) return 

            const keywordValue = inputAddKeyword.value;

            // palavras-chaves encontrada em "this.triggerChanged.keyword"
            console.log('this.triggerChanged.keyword:',this.triggerChanged.keyword);
            const equalsKeywords = this.triggerChanged.keyword?.split(',').filter(keyword=>keyword.trim()===keywordValue.trim());
            console.log('valor de equalsKeywords:',equalsKeywords);
            if(equalsKeywords.length > 0){
                console.log('palavras-chaves iqual encontrada:', equalsKeywords);
                return
            } 

            // adicionar palavra-chave no trigger
            this.triggerChanged.keyword += `, ${keywordValue}`;

            // adicionar palavra-chave no HTML
            const keywordElement = this.createKeywordElement({keyword: keywordValue, type:"keyword"}); // criar elemento de palavra-chave
            this.closeKeywordEvent(keywordElement); // adicionar evento de remover no "X" do elemento da palavra-chave
            
            const keywordListElement = this.element.querySelector('#keyword-list');
            keywordListElement.appendChild(keywordElement);

            // limpar input de adicionar keyword
            inputAddKeyword.value = '';

            // verificar alterações e ativar botão de salvar
            this.verifyChanged();

            console.log('valor de this.trigger:',this.trigger);
            console.log('addKeywordEvent() --> valor de this.triggerChanged.keyword:', this.triggerChanged.keyword);
        });
    }
    addNegativeKeywordEvent(){
        const buttonAddNegativeKeyword = this.element.querySelector('#button-add-negativeKeyword');
        buttonAddNegativeKeyword.addEventListener('click',()=>{
            const inputAddNegativeKeyword = this.element.querySelector('#input-add-negativeKeyword');
            if(!inputAddNegativeKeyword.value) return

            const keywordValue = inputAddNegativeKeyword.value;

            // palavras-chaves iguais
            const equalsKeywords = this.triggerChanged.negativeKeyword?.split(',').filter(keyword=>keyword.trim()===keywordValue.trim());
            if(equalsKeywords.length > 0){
                console.log('palavras-chaves iqual encontrada:', equalsKeywords);
                return
            } 

            // adicionar palavra-chave no trigger
            this.triggerChanged.negativeKeyword += `, ${keywordValue}`;

            // adicionar palavra-chave no HTML
            const negativeKeywordElement = this.createKeywordElement({keyword: keywordValue, type:"negativeKeyword"}); // criar elemento de palavra-chave
            this.closeKeywordEvent(negativeKeywordElement); // adicionar evento de remover no "X" do elemento da palavra-chave
            
            const negativeKeywordListElement = this.element.querySelector('#negativeKeyword-list');
            negativeKeywordListElement.appendChild(negativeKeywordElement);

            // limpar input de adicionar keyword
            inputAddNegativeKeyword.value = '';

            // verificar alterações e ativar botão de salvar
            this.verifyChanged();
        });
    }

}

class PopupChoosePost{
    constructor({fluxogramaInstance, chatbot, triggerChanged=undefined}){
        this.id = `popup-escolher-publicacao`;
        this.idBackground = `popup-background-full`;

        this.fluxogramaInstance = fluxogramaInstance;
        this.chatbot = chatbot;
        this.trigger = {...this.chatbot.flowchart.trigger};
    
        if(triggerChanged){
            this.triggerChanged = triggerChanged;
        }else{
            this.triggerChanged = {...this.chatbot.flowchart.trigger};
        }

        this.logo = this.chatbot.page.page.photo;
        this.name = this.chatbot.page.page.name;
        this.idPage = this.chatbot.page.page.idPage;

        this.element = this.createElement();

        this.showPostsFound();
        
    }

    show(){
        const backgroundElement = document.getElementById(this.idBackground);
        if(backgroundElement){
            backgroundElement.classList.remove('hidden');
        }

        const popupChoosePost = document.getElementById(this.id);
        if(popupChoosePost){
            popupChoosePost.remove();
        }

        backgroundElement.insertAdjacentElement('afterend',this.element);        
    }

    createPostElement({postData}){
        console.log('VALOR DE postData:',postData);
        // CODDING: Horario da publicação
        const horario = new Date(postData.created_time);
        const dia = horario.getDate().toString().padStart(2,'0');
        const mes = horario.getMonth().toString().padStart(2,'0');
        const ano = horario.getFullYear().toString();
        const hora = horario.getHours().toString().padStart(2,'0');
        const minuto = horario.getMinutes().toString().padStart(2,'0');
        const segundos = horario.getSeconds().toString().padStart(2,'0');
        const horarioFormatado = `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundos}`;

        const isSelected = postData.id === this.triggerChanged.postId;

        const element = document.createElement('div');
        element.className = `${isSelected ? `border-[1px] border-purple`:``} relative min-w-[250px] rounded-[10px] bg-white hover:bg-[#f2f2f2] cursor-pointer shadow-[0_3px_8px_rgba(0,0,0,0.24)] flex flex-col items-center justify-start space-y-[16px]`;
        element.innerHTML = `<!-- CODDING: Logo, nome e horario da postagem -->
        <div class="w-full px-[16px] pt-[16px] flex flex-row justify-start items-center space-x-[10px]">
          <!-- CODDING: Logo -->
          <div class="min-h-[40px] max-h-[40px] min-w-[40px] max-w-[40px] rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.24)] relative">
              <!-- CODDING: Logo -->
              <img class="w-full h-full rounded-full" src="${this.logo}" alt="Logo da página">

              <!-- CODDING: Icone do facebook -->
              <img class="absolute bottom-[-5px] right-[-5px] min-w-[20px] max-w-[20px] min-h-[20px] max-h-[20px] rounded-full " src="https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg">
          </div>
          <!-- CODDING: Nome da pagina, horario da postagem -->
          <div class="flex flex-col justify-center items-start">
            <p class="text-sm text-[#404040] font-bold">${this.name}</p>
            <p class="text-xs text-gray-400 font-normal">${horarioFormatado}</p>
          </div>
        </div>

        <!-- CODDING: Conteúdo -->
        <div class="w-full px-[16px]">
          <p class="text-sm text-[#404040]">${postData.message.slice(0,40)}</p>
        </div>

        <!-- CODDING: Imagem da postagem -->
        <div class="w-full px-[16px] ">
          <img class="w-full h-[150px] rounded-[10px] shadow-[0_3px_8px_rgba(0,0,0,0.24)]" src="${postData.full_picture}" alt="">
        </div>

        <!-- CODDING: Ver no facebook -->
        <div class="w-full flex justify-end items-center">
            <a href="https://www.facebook.com/${postData.id}" target="_blank">
                <div class="w-full px-[16px] pb-[16px] flex flex-row justify-end items-center space-x-[10px] text-[#40404] text-sm hover:text-[#0866FF] cursor-pointer ">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    <p class="">Ver no facebook</p>
                </div>
            </a>
        </div>

        <!-- CODDING: Icone de selecionado -->
        <div class="${isSelected?``:`hidden`} absolute right-[-20px] top-[-36px] min-w-[40px] min-h-[40px] rounded-full bg-white  flex justify-center items-center shadow-[0_3px_8px_rgba(0,0,0,0.24)]">
          <i class="fa-solid fa-check text-xl text-purple"></i>
        </div>`;


        element.addEventListener('click',()=>{
            console.log('clicou pra selecionar o post:', postData);
            
            const triggerChanged = {
                type: "comment",
                keyword: this.chatbot.flowchart.trigger.keyword||"",
                negativeKeyword: this.chatbot.flowchart.trigger.negativeKeyword||"",
                postId:postData.id
            }
            this.element.remove();
            const popupEditarTrigger = new PopupEditarTrigger({fluxogramaInstance: this.fluxogramaInstance, chatbot: this.chatbot, triggerChanged: triggerChanged});
            popupEditarTrigger.show();
        });

        return element;
    }

    async showPostsFound(){
        
        const posts = await this.fluxogramaInstance.chatbotApi.getPosts({ idPage: this.idPage });
        if(posts.status=== true){ // posts encontrados
            // CODDING: Subtitle, quantidade de postagens encontradas
            const quantidadeDePostsEncontradosElement = this.element.querySelector('#quantidade-de-posts-encontrados');
            quantidadeDePostsEncontradosElement.innerHTML = `${posts.posts.length === 1 ? `1 publicação encontrada`:`${posts.posts.length} publicações encontradas`}`;

            console.log('QUANTIDADE DE POSTS ENCONTRADOS:', posts.posts.length);
            console.log('POSTS:',posts);

            // CODDING: esconder posts carregando
            const postsLoadingElement = this.element.querySelector('#posts-loading');
            postsLoadingElement.classList.add('hidden');

            // CODDING: mostrar posts encontrados
            const postsElement = this.element.querySelector('#posts');
            postsElement.innerHTML = '';
            posts.posts.forEach(post=>{
                console.log('post:',post);
                const postElement = this.createPostElement({postData:post});
                postsElement.appendChild(postElement);
            });
            postsElement.classList.remove('hidden');
        }else{

        }
    }

    createElement(){
        const element = document.createElement('div');
        element.id = `popup-escolher-publicacao`;
        element.className = `fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[450px] h-[500px] md:h-[600px] bg-white rounded-[10px] z-[51] flex flex-col items-start justify-start`;

        element.innerHTML = `<!-- CODDING: Titulo -->
        <div class="w-full flex flex-row justify-start items-center py-[32px] px-[32px] space-x-[10px] bg-purple rounded-tl-[10px] rounded-tr-[10px] relative">
          <!-- CODDING: Botão Fechar -->
          <div id="popup-vincular-pagina-button-close" class="absolute top-[32px] right-[32px] h-[40px] w-[40px] hover:bg-[#823f87] rounded-full flex justify-center items-center text-sm text-white cursor-pointer">
            <i class="fa-solid fa-xmark"></i>
          </div>
    
          <i class="fa-brands fa-facebook-messenger text-white text-xl"></i>
          <div class="flex flex-col justify-center items-start">
            <p class="text-sm text-white">Facebook</p>
            <p class="text-base/none text-white">Escolher Publicação</p>
          </div>
        </div>
    
        <!-- CODDING: Conteúdo -->
        <div class="w-full h-[500px] overflow-y-auto py-[32px]">
    
          
            <!-- CODDING: Title -->
            <div class="px-[32px] w-full flex flex-row justify-start items-center space-x-[10px]">
              -<i class="fa-solid fa-layer-group w-[40px] h-[40px] rounded-[10px] bg-purple text-white flex justify-center items-center shadow-[0_3px_8px_rgba(0,0,0,0.24)]"></i>
              <div class="flex flex-col justify-center items-start">
                <p class="text-base/none text-[#404040] font-bold">Selecione uma das publicações abaixo</p>
                <p id="quantidade-de-posts-encontrados" class="text-sm text-gray-400 font-normal">0 publicações encontradas</p>
              </div>
            </div>
    
            <!-- CODDING: Lista horizontal das publicações -->
            <div id="posts" class="hidden w-full overflow-x-auto py-[24px] px-[32px] flex flex-row justify-start items-center space-x-[24px]">
              

                <!-- CODDING: Publicação -->
                <div class="border-[1px] border-red-900 relative min-w-[250px] rounded-[10px] bg-white shadow-[0_3px_8px_rgba(0,0,0,0.24)] flex flex-col items-center justify-start space-y-[16px]">
                  <!-- CODDING: Logo, nome e horario da postagem -->
                  <div class="w-full px-[16px] pt-[16px] flex flex-row justify-start items-center space-x-[10px]">
                    <!-- CODDING: Logo -->
                    <div class="min-h-[40px] max-h-[40px] min-w-[40px] max-w-[40px] rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.24)] relative">
                        <!-- CODDING: Logo -->
                        <img class="w-full h-full rounded-full" src="https://scontent.fcau2-1.fna.fbcdn.net/v/t39.30808-1/406212234_122106008474123683_8295910229202053732_n.png?stp=cp0_dst-png_p50x50&_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_ohc=evxZPEObpqgAb6LG3Le&_nc_ht=scontent.fcau2-1.fna&edm=AJdBtusEAAAA&oh=00_AfBrzW-AV9iZoncEXYTJRLzxX7f4M34rGoVsPQguQ9g6fA&oe=662C74F7" alt="Logo da página">

                        <!-- CODDING: Icone do facebook -->
                        <img class="absolute bottom-[-5px] right-[-5px] min-w-[20px] max-w-[20px] min-h-[20px] max-h-[20px] rounded-full " src="https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg">
                    </div>
                    <!-- CODDING: Nome da pagina, horario da postagem -->
                    <div class="flex flex-col justify-center items-start">
                      <p class="text-sm text-[#404040] font-bold">Titulo da pagina</p>
                      <p class="text-xs text-gray-400 font-normal">22/04/2024 00:32:00 AM</p>
                    </div>
                  </div>
    
                  <!-- CODDING: Conteúdo -->
                  <div class="w-full px-[16px]">
                    <p class="text-sm text-[#404040]">Desvendando o mundo do UI Design: onde cada pixel conta uma...</p>
                  </div>
    
                  <!-- CODDING: Imagem da postagem -->
                  <div class="w-full px-[16px] ">
                    <img class="w-full h-[150px] rounded-[10px] shadow-[0_3px_8px_rgba(0,0,0,0.24)]" src="https://miro.medium.com/v2/resize:fit:1200/1*tFaTB_49m4OSU8rbU_5ciw.png" alt="">
                  </div>

                  <!-- CODDING: Ver no facebook -->
                  <div class="w-full px-[16px] pb-[16px] flex flex-row justify-end items-center space-x-[10px] text-[#40404] text-sm hover:text-[#0866FF] cursor-pointer ">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    <p class="">Ver no facebook</p>
                  </div>
    
                  <!-- CODDING: Icone de selecionado -->
                  <div class="absolute right-[-20px] top-[-36px] min-w-[40px] min-h-[40px] rounded-full bg-white  flex justify-center items-center shadow-[0_3px_8px_rgba(0,0,0,0.24)]">
                    <i class="fa-solid fa-check text-xl text-purple"></i>
                  </div>

                  
                </div>
    
    
                <!-- CODDING: Publicação -->
                <div class="hover:bg-[#f2f2f2] cursor-pointer min-w-[250px] border-[1px] border-gray-200 rounded-[10px] bg-white shadow-[0_3px_8px_rgba(0,0,0,0.24)] flex flex-col items-center justify-start space-y-[16px]">
                  <!-- CODDING: Logo, nome e horario da postagem -->
                  <div class="w-full px-[16px] pt-[16px] flex flex-row justify-start items-center space-x-[10px]">
                    <!-- CODDING: Logo -->
                    <div class="min-h-[40px] max-h-[40px] min-w-[40px] max-w-[40px] rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.24)] relative">
                        <!-- CODDING: Logo -->
                        <img class="w-full h-full rounded-full" src="https://scontent.fcau2-1.fna.fbcdn.net/v/t39.30808-1/406212234_122106008474123683_8295910229202053732_n.png?stp=cp0_dst-png_p50x50&_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_ohc=evxZPEObpqgAb6LG3Le&_nc_ht=scontent.fcau2-1.fna&edm=AJdBtusEAAAA&oh=00_AfBrzW-AV9iZoncEXYTJRLzxX7f4M34rGoVsPQguQ9g6fA&oe=662C74F7" alt="Logo da página">

                        <!-- CODDING: Icone do facebook -->
                        <img class="absolute bottom-[-5px] right-[-5px] min-w-[20px] max-w-[20px] min-h-[20px] max-h-[20px] rounded-full " src="https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg">
                    </div>
                    <!-- CODDING: Nome da pagina, horario da postagem -->
                    <div class="flex flex-col justify-center items-start">
                      <p class="text-sm text-[#404040] font-bold">Titulo da pagina</p>
                      <p class="text-xs text-gray-400 font-normal">22/04/2024 00:32:00 AM</p>
                    </div>
                  </div>
    
                  <!-- CODDING: Conteúdo -->
                  <div class="w-full px-[16px]">
                    <p class="text-sm text-[#404040]">Desvendando o mundo do UI Design: onde cada pixel conta uma...</p>
                  </div>
    
                  <!-- CODDING: Imagem da postagem -->
                  <div class="w-full px-[16px]">
                    <img class="w-full h-[150px] rounded-[10px] shadow-[0_3px_8px_rgba(0,0,0,0.24)]" src="https://miro.medium.com/v2/resize:fit:1200/1*tFaTB_49m4OSU8rbU_5ciw.png" alt="">
                  </div>

                  <!-- CODDING: Ver no facebook -->
                  <div class="text-sm text-[#404040] hover:text-[#0866FF] w-full px-[16px] pb-[16px] flex flex-row justify-end items-center space-x-[10px]">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    <p class="">Ver no facebook</p>
                  </div>
                </div>
    
    
                <!-- CODDING: Publicação -->
                <div class="hover:bg-[#f2f2f2] cursor-pointer min-w-[250px] border-[1px] border-gray-200 rounded-[10px] bg-white shadow-[0_3px_8px_rgba(0,0,0,0.24)] flex flex-col items-center justify-start space-y-[16px]">
                  <!-- CODDING: Logo, nome e horario da postagem -->
                  <div class="w-full px-[16px] pt-[16px] flex flex-row justify-start items-center space-x-[10px]">
                    <!-- CODDING: Logo -->
                    <div class="min-h-[40px] max-h-[40px] min-w-[40px] max-w-[40px] rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.24)] relative">
                        <!-- CODDING: Logo -->
                        <img class="w-full h-full rounded-full" src="https://scontent.fcau2-1.fna.fbcdn.net/v/t39.30808-1/406212234_122106008474123683_8295910229202053732_n.png?stp=cp0_dst-png_p50x50&_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_ohc=evxZPEObpqgAb6LG3Le&_nc_ht=scontent.fcau2-1.fna&edm=AJdBtusEAAAA&oh=00_AfBrzW-AV9iZoncEXYTJRLzxX7f4M34rGoVsPQguQ9g6fA&oe=662C74F7" alt="Logo da página">

                        <!-- CODDING: Icone do facebook -->
                        <img class="absolute bottom-[-5px] right-[-5px] min-w-[20px] max-w-[20px] min-h-[20px] max-h-[20px] rounded-full " src="https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg">
                    </div>
                    <!-- CODDING: Nome da pagina, horario da postagem -->
                    <div class="flex flex-col justify-center items-start">
                      <p class="text-sm text-[#404040] font-bold">Titulo da pagina</p>
                      <p class="text-xs text-gray-400 font-normal">22/04/2024 00:32:00 AM</p>
                    </div>
                  </div>
    
                  <!-- CODDING: Conteúdo -->
                  <div class="w-full px-[16px]">
                    <p class="text-sm text-[#404040]">Desvendando o mundo do UI Design: onde cada pixel conta uma...</p>
                  </div>
    
                  <!-- CODDING: Imagem da postagem -->
                  <div class="w-full px-[16px]">
                    <img class="w-full h-[150px] rounded-[10px] shadow-[0_3px_8px_rgba(0,0,0,0.24)]" src="https://miro.medium.com/v2/resize:fit:1200/1*tFaTB_49m4OSU8rbU_5ciw.png" alt="">
                  </div>
                  
                  <!-- CODDING: Ver no facebook -->
                  <div class="text-sm text-[#404040] hover:text-[#0866FF] w-full px-[16px] pb-[16px] flex flex-row justify-end items-center space-x-[10px]">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    <p class="">Ver no facebook</p>
                  </div>
                </div>
    
    
                <!-- CODDING: Publicação -->
                <div class="hover:bg-[#f2f2f2] cursor-pointer border-[1px] border-gray-200 min-w-[250px] rounded-[10px] bg-white shadow-[0_3px_8px_rgba(0,0,0,0.24)] flex flex-col items-center justify-start space-y-[16px]">
                  <!-- CODDING: Logo, nome e horario da postagem -->
                  <div class="w-full px-[16px] pt-[16px] flex flex-row justify-start items-center space-x-[10px]">
                    <!-- CODDING: Logo -->
                    <div class="min-h-[40px] max-h-[40px] min-w-[40px] max-w-[40px] rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.24)] relative">
                        <!-- CODDING: Logo -->
                        <img class="w-full h-full rounded-full" src="https://scontent.fcau2-1.fna.fbcdn.net/v/t39.30808-1/406212234_122106008474123683_8295910229202053732_n.png?stp=cp0_dst-png_p50x50&_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_ohc=evxZPEObpqgAb6LG3Le&_nc_ht=scontent.fcau2-1.fna&edm=AJdBtusEAAAA&oh=00_AfBrzW-AV9iZoncEXYTJRLzxX7f4M34rGoVsPQguQ9g6fA&oe=662C74F7" alt="Logo da página">

                        <!-- CODDING: Icone do facebook -->
                        <img class="absolute bottom-[-5px] right-[-5px] min-w-[20px] max-w-[20px] min-h-[20px] max-h-[20px] rounded-full " src="https://upload.wikimedia.org/wikipedia/commons/b/b9/2023_Facebook_icon.svg">
                    </div>
                    <!-- CODDING: Nome da pagina, horario da postagem -->
                    <div class="flex flex-col justify-center items-start">
                      <p class="text-sm text-[#404040] font-bold">Titulo da pagina</p>
                      <p class="text-xs text-gray-400 font-normal">22/04/2024 00:32:00 AM</p>
                    </div>
                  </div>
    
                  <!-- CODDING: Conteúdo -->
                  <div class="w-full px-[16px]">
                    <p class="text-sm text-[#404040]">Desvendando o mundo do UI Design: onde cada pixel conta uma...</p>
                  </div>
    
                  <!-- CODDING: Imagem da postagem -->
                  <div class="w-full px-[16px]">
                    <img class="w-full h-[150px] rounded-[10px] shadow-[0_3px_8px_rgba(0,0,0,0.24)]" src="https://miro.medium.com/v2/resize:fit:1200/1*tFaTB_49m4OSU8rbU_5ciw.png" alt="">
                  </div>

                  <!-- CODDING: Ver no facebook -->
                  <div class="text-sm text-[#404040] hover:text-[#0866FF] w-full px-[16px] pb-[16px] flex flex-row justify-end items-center space-x-[10px]">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    <p class="">Ver no facebook</p>
                  </div>
                </div>
    
              
    
            </div>

            <!-- CODDING: Lista horizontal das publicações carrregando -->
            <div id="posts-loading" class="w-full overflow-x-auto py-[24px]">
                <div class="px-[32px] flex flex-row justify-start items-center space-x-[24px]">
                    <!-- CODDING: Publicação -->
                    <div class="border-[1px] border-gray-200 min-w-[250px] max-w-[250px] rounded-[10px] shadow-[0_3px_8px_rgba(0,0,0,0.24)] bg-white flex flex-col items-center justify-start space-y-[16px]">
                        <!-- CODDING: Logo, nome e horario da postagem -->
                        <div class="w-full px-[16px] pt-[16px] flex flex-row justify-start items-center space-x-[10px]">
                            <!-- CODDING: Logo -->
                            <div class="min-h-[40px] max-h-[40px] min-w-[40px] max-w-[40px] rounded-full bg-gray-200 animate-pulse">
                                
                            </div>
                            <!-- CODDING: Nome da pagina, horario da postagem -->
                            <div class="flex flex-col justify-center items-start space-y-[5px]">
                                <p class="h-[15px] w-[150px] rounded-full bg-gray-200 animate-pulse"></p>
                                <p class="h-[15px] w-[90px] rounded-full bg-gray-200 animate-pulse"></p>
                            </div>
                        </div>
        
                        <!-- CODDING: Conteúdo -->
                        <div class="w-full px-[16px] space-y-[5px]">
                            <p class="w-full h-[15px] rounded-full bg-gray-200 animate-pulse"></p>
                            <p class="w-[50%] h-[15px] rounded-full bg-gray-200 animate-pulse"></p>
                        </div>
        
                        <!-- CODDING: Imagem da postagem -->
                        <div class="w-full px-[16px]">
                            <div class="w-full h-[150px] rounded-[10px] bg-gray-200 animate-pulse"></div>
                        </div>

                        <!-- CODDING: Ver no facebook -->
                        <div class="text-sm text-[#404040] hover:text-[#0866FF] w-full px-[16px] pb-[16px] flex flex-row justify-end items-center space-x-[10px]">
                            <p class="h-[15px] w-[20px] rounded-full bg-gray-200 animate-pulse"></p>
                            <p class="h-[15px] w-[80px] rounded-full bg-gray-200 animate-pulse"></p>
                        </div>
                    </div>


                    <!-- CODDING: Publicação -->
                    <div class="border-[1px] border-gray-200 min-w-[250px] max-w-[250px] rounded-[10px] shadow-[0_3px_8px_rgba(0,0,0,0.24)] bg-white flex flex-col items-center justify-start space-y-[16px]">
                        <!-- CODDING: Logo, nome e horario da postagem -->
                        <div class="w-full px-[16px] pt-[16px] flex flex-row justify-start items-center space-x-[10px]">
                            <!-- CODDING: Logo -->
                            <div class="min-h-[40px] max-h-[40px] min-w-[40px] max-w-[40px] rounded-full bg-gray-200 animate-pulse">
                                
                            </div>
                            <!-- CODDING: Nome da pagina, horario da postagem -->
                            <div class="flex flex-col justify-center items-start space-y-[5px]">
                                <p class="h-[15px] w-[150px] rounded-full bg-gray-200 animate-pulse"></p>
                                <p class="h-[15px] w-[90px] rounded-full bg-gray-200 animate-pulse"></p>
                            </div>
                        </div>
        
                        <!-- CODDING: Conteúdo -->
                        <div class="w-full px-[16px] space-y-[5px]">
                            <p class="w-full h-[15px] rounded-full bg-gray-200 animate-pulse"></p>
                            <p class="w-[50%] h-[15px] rounded-full bg-gray-200 animate-pulse"></p>
                        </div>
        
                        <!-- CODDING: Imagem da postagem -->
                        <div class="w-full px-[16px]">
                            <div class="w-full h-[150px] rounded-[10px] bg-gray-200 animate-pulse"></div>
                        </div>

                        <!-- CODDING: Ver no facebook -->
                        <div class="text-sm text-[#404040] hover:text-[#0866FF] w-full px-[16px] pb-[16px] flex flex-row justify-end items-center space-x-[10px]">
                            <p class="h-[15px] w-[20px] rounded-full bg-gray-200 animate-pulse"></p>
                            <p class="h-[15px] w-[80px] rounded-full bg-gray-200 animate-pulse"></p>
                        </div>
                    </div>


                    <!-- CODDING: Publicação -->
                    <div class="border-[1px] border-gray-200 min-w-[250px] max-w-[250px] rounded-[10px] shadow-[0_3px_8px_rgba(0,0,0,0.24)] bg-white flex flex-col items-center justify-start space-y-[16px]">
                        <!-- CODDING: Logo, nome e horario da postagem -->
                        <div class="w-full px-[16px] pt-[16px] flex flex-row justify-start items-center space-x-[10px]">
                            <!-- CODDING: Logo -->
                            <div class="min-h-[40px] max-h-[40px] min-w-[40px] max-w-[40px] rounded-full bg-gray-200 animate-pulse">
                                
                            </div>
                            <!-- CODDING: Nome da pagina, horario da postagem -->
                            <div class="flex flex-col justify-center items-start space-y-[5px]">
                                <p class="h-[15px] w-[150px] rounded-full bg-gray-200 animate-pulse"></p>
                                <p class="h-[15px] w-[90px] rounded-full bg-gray-200 animate-pulse"></p>
                            </div>
                        </div>
        
                        <!-- CODDING: Conteúdo -->
                        <div class="w-full px-[16px] space-y-[5px]">
                            <p class="w-full h-[15px] rounded-full bg-gray-200 animate-pulse"></p>
                            <p class="w-[50%] h-[15px] rounded-full bg-gray-200 animate-pulse"></p>
                        </div>
        
                        <!-- CODDING: Imagem da postagem -->
                        <div class="w-full px-[16px]">
                            <div class="w-full h-[150px] rounded-[10px] bg-gray-200 animate-pulse"></div>
                        </div>

                        <!-- CODDING: Ver no facebook -->
                        <div class="text-sm text-[#404040] hover:text-[#0866FF] w-full px-[16px] pb-[16px] flex flex-row justify-end items-center space-x-[10px]">
                            <p class="h-[15px] w-[20px] rounded-full bg-gray-200 animate-pulse"></p>
                            <p class="h-[15px] w-[80px] rounded-full bg-gray-200 animate-pulse"></p>
                        </div>
                    </div>
                </div>
            </div>
    
           
         
        </div>
    
        <!-- CODDING: Botão de Salvar -->
        <div class="hidden w-full px-[32px] py-[16px] shadow-[0_5px_15px_rgba(0,0,0,0.35)] border-t-[1px] border-gray-200">
          <button class="w-full h-[40px] bg-purple rounded-[10px] text-white text-sm hover:bg-[#823f87] shadow-[0_3px_8px_rgba(0,0,0,0.24)]">Salvar</button>
        </div>`;

        return element;
    }
}

class PopupVincularPagina{
    constructor({fluxogramaInstance}){
        this.fluxogramaInstance = fluxogramaInstance;
        
        this.page = {account:{}, page:{}};
        this.accounts = [];
        this.pages = [];
        this.chatbot = {};

        // adicionar eventos
        this.addEvents();
    }

    init(){
        // adicionar eventos
        this.addEvents();
    }

    // esconder popup
    hiddenPopup(){ 
        const popupBackgroundElement = document.getElementById('popup-background-full');
        const popupVincularPaginaElement = document.getElementById('popup-vincular-pagina');
        popupVincularPaginaElement.removeAttribute('chatbotid');
        popupBackgroundElement.classList.add('hidden');
        popupVincularPaginaElement.classList.add('hidden'); 
    }

    // mostrar popup
    async showPopup(chatbot){
        // esconder contas do facebook
        const escolherContaDoFacebookElement = document.getElementById('popup-vincular-pagina-escolher-conta-do-facebook');
        escolherContaDoFacebookElement.classList.add('hidden');

        // mostrar carregamento das contas do facebook
        const escolherContaDoFacebookLoadingElement = document.getElementById('popup-vincular-pagina-escolher-conta-do-facebook-loading');
        escolherContaDoFacebookLoadingElement.classList.remove('hidden');

        // esconder páginas do facebook
        const escolherPaginaDoFacebookElement = document.getElementById('popup-vincular-pagina-escolher-pagina-do-facebook');
        escolherPaginaDoFacebookElement.classList.add('hidden')

        // mostrar carregamento das paginas do facebook
        const escolherPaginaDoFacebookLoadingElement = document.getElementById('popup-vincular-pagina-escolher-pagina-do-facebook-loading');
        escolherPaginaDoFacebookLoadingElement.classList.remove('hidden');

        // esconder contas do facebook não encontradas
        const nenhumaPaginaDoFacebookEncontrada = document.getElementById('popup-vincular-pagina-nenhuma-conta-do-facebook-encontrada');
        nenhumaPaginaDoFacebookEncontrada.classList.add('hidden');

        // esconder botão de desvincular página 
        const desvincularPaginaElement = document.getElementById('popup-vincular-pagina-botao-desvincular-pagina');
        desvincularPaginaElement.classList.add('hidden');

        // mostar background com baixa opacidade
        const popupBackgroundElement = document.getElementById('popup-background-full');
        popupBackgroundElement.classList.remove('hidden');

        // mostrar popup de vincular pagina
        const popupVincularPaginaElement = document.getElementById('popup-vincular-pagina');
        popupVincularPaginaElement.setAttribute('chatbotid',chatbot._id);
        popupVincularPaginaElement.classList.remove('hidden');
        
        // procurar chatbot 
        const chatbotFound = await this.fluxogramaInstance.chatbotApi.getChatbot(chatbot._id);
        if(chatbotFound.chatbot){ // chatbot encontrado
            this.chatbot = chatbotFound.chatbot;
            chatbot = chatbotFound.chatbot;
        }else{ // chatbot não encontrado
            this.chatbot = chatbot;
        }
        
        if(chatbot.page && chatbot.page?.page !== undefined && chatbot.page?.account !== undefined  && Object.keys(chatbot.page?.page).length > 0 && Object.keys(chatbot.page?.account).length > 0){
            this.page = chatbot.page;
        }else{
            this.page = {page:{}, account: {}};
        }
        

        // carregar contas do facebook 
        this.accounts = await this.fluxogramaInstance.userApi.getAccountsFb();

       
        if(this.accounts.length>0){ // contas encontradas
        
            if(Object.keys(this.page.page).length === 0 && Object.keys(this.page.account).length === 0){ // nenhum página vinculada 
                // mostrar mensagem de escolher conta do facebook
                const mensagemEscolherContaDoFacebookElement = document.getElementById('popup-vincular-pagina-mensagem-escolher-conta-do-facebook');
                mensagemEscolherContaDoFacebookElement.classList.remove('hidden');

                // esconder carregamento de paginas do facebook
                escolherPaginaDoFacebookLoadingElement.classList.add('hidden');
            }

            // mostrar contas do facebook encontradas
            const subtitle = document.getElementById('popup-vincular-pagina-escolher-conta-do-facebook-subtitle');
            subtitle.innerHTML = `${this.accounts.length > 1 ? `${this.accounts.length} contas encontradas`:`${this.accounts.length} conta encontrada`}`;
            const listaDeContasElement = document.getElementById('popup-vincular-pagina-escolher-conta-do-facebook-lista-de-contas-do-facebook');
            listaDeContasElement.innerHTML = ``;
            this.accounts.forEach(account=>{
                const accountFacebookElement = this.createAccountFacebookElement(account);
                listaDeContasElement.appendChild(accountFacebookElement); 
                this.selectedAccountEvent(account);          
            });

            // esconder escolher conta loading
            const escolherContaDoFacebookLoadingElement = document.getElementById('popup-vincular-pagina-escolher-conta-do-facebook-loading');
            escolherContaDoFacebookLoadingElement.classList.add('hidden');

            // mostrar escolher conta
            const escolherContaDoFacebookElement = document.getElementById('popup-vincular-pagina-escolher-conta-do-facebook');
            escolherContaDoFacebookElement.classList.remove('hidden');


            if(Object.keys(this.page.page).length > 0 && Object.keys(this.page.account).length > 0){ // pagina e conta preenchidos
                // simular um clique 
                const accountElement = document.getElementById(`accountid-${this.page.account.idAccount}`);
                accountElement.click();

            }


        }else{ // nenhuma conta encontrada

            // esconder carregamento de contas do facebook
            escolherContaDoFacebookLoadingElement.classList.add('hidden');

            // mostrar carregamento das paginas do facebook
            escolherPaginaDoFacebookLoadingElement.classList.add('hidden');
            
            // mostrar nenhuma pagina do facebook encontrada
            nenhumaPaginaDoFacebookEncontrada.classList.remove('hidden');
            
        }
    }

    // criar elemento de conta do facebook
    createAccountFacebookElement(account){
        const element = document.createElement('div');
        element.id = `accountid-${account.idAccount}`;
        element.setAttribute('accountid',`${account.idAccount}`);
        element.className = `px-[24px] py-[16px] rounded-[10px] bg-${(this.page.account.idAccount !== undefined && account.idAccount === this.page.account.idAccount) ? "purple" : "white"} flex flex-row justify-start items-center space-x-[10px] shadow-[0_3px_8px_rgba(0,0,0,0.24)] relative cursor-pointer`;

        element.innerHTML = `
            <!-- CODDING: Foto de Perfil -->
            <div class="w-[40px] h-[40px] rounded-full bg-gray-500 relative shadow-[0_3px_8px_rgba(0,0,0,0.24)]">
                <img src="${account.photo}" class="rounded-full w-full h-full" alt="">
                <div class="absolute top-[60%] left-[60%] w-[22px] h-[22px] rounded-full bg-[#207BF3] flex justify-center items-center border-2 border-white">
                <i class="fa-brands fa-facebook-f text-xs text-white"></i>
                </div>
            </div>

            <!-- CODDING: Detalhes da conta -->
            <div class="flex flex-col justify-center items-start">
                <p class="text-sm/none text-${(this.page.account.idAccount !== undefined && account.idAccount === this.page.account.idAccount) ? "white" : "[#404040]"} font-black">${account.name}</p>
                <p class="text-sm text-${(this.page.account.idAccount !== undefined && account.idAccount === this.page.account.idAccount) ? "white" : "gray-400"} font-normal">${account.idAccount}</p>
            </div>

            <!-- CODDING: icone selecioando-->
            <i class="${(this.page.account.idAccount !== undefined && account.idAccount === this.page.account.idAccount) ? "" : "hidden"} fa-solid fa-circle-check absolute bottom-[-15px] right-[-15px] w-[40px] h-[40px] bg-white rounded-full flex justify-center items-center text-base text-purple"></i>
        `;
        return element;

    }

    // criar elemento de pagina do facebook
    createPageElement(page){
        const element = document.createElement('div');
        element.id = `pageid-${page.idPage}`;
        element.setAttribute('pageid',`${page.idPage}`);

        element.className = `w-full p-[16px] bg-${(this.page.page.idPage !== undefined && page.idPage === this.page.page.idPage) ? "purple":"white"} rounded-[10px] shadow-[0_3px_8px_rgba(0,0,0,0.24)] flex flex-row justify-start items-center space-x-[10px] relative cursor-pointer`;
        element.innerHTML = `<!-- CODDING: Logo-->
        <div class="w-[40px] h-[40px] rounded-full bg-gray-500 relative shadow-[0_3px_8px_rgba(0,0,0,0.24)]">
          <img src="${page.photo}" class="rounded-full w-full h-full" alt="">
          <div class="absolute top-[60%] left-[60%] w-[22px] h-[22px] rounded-full bg-[#207BF3] flex justify-center items-center border-2 border-white">
            <i class="fa-brands fa-facebook-f text-xs text-white"></i>
          </div>
        </div>
        <!-- CODDING: Detalhes da pagina -->
        <div class="flex flex-col justify-center items-start">
          <p class="text-sm/none text-${(this.page.page.idPage !== undefined && page.idPage === this.page.page.idPage) ? "white" : "[#404040]"} font-black">${page.name}</p>
          <p class="text-sm text-${(this.page.page.idPage !== undefined && page.idPage === this.page.page.idPage) ? "white" : "gray-400"} font-normal">${page.idPage}</p>
        </div>

        <!-- CODDING: loading -->
        <div id="page-${page.idPage}-loading" class="hidden absolute bottom-[-15px] right-[-15px] w-[40px] h-[40px] bg-white rounded-full flex justify-center items-center shadow-[0_3px_8px_rgba(0,0,0,0.24)]">
            <svg aria-hidden="true" class="w-[20px] h-[20px] text-transparent animate-spin fill-[#752A7A]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
        </div>

        <!-- CODDING: icone selecioando-->
        <i class="${(this.page.page.idPage !== undefined && page.idPage === this.page.page.idPage) ? "" : "hidden"} fa-solid fa-circle-check absolute bottom-[-15px] right-[-15px] w-[40px] h-[40px] bg-white rounded-full flex justify-center items-center text-base text-purple"></i>`;
      return element;
    }

    // selecionou conta do facebook
    selectedAccountEvent(account){
        function resetButtons(){
            // esconder lista de paginas carregando 
            const escolherListaDePaginasCarregandoElement = document.getElementById('popup-vincular-pagina-escolher-pagina-do-facebook-loading');
            escolherListaDePaginasCarregandoElement.classList.add('hidden');

            // esconder lista de paginas
            const escolherListaDePaginasElement = document.getElementById('popup-vincular-pagina-escolher-pagina-do-facebook');
            escolherListaDePaginasElement.classList.add('hidden');

            // resetar elemento de conta do facebook
            const listaDeContasElement = document.getElementById('popup-vincular-pagina-escolher-conta-do-facebook-lista-de-contas-do-facebook');
            Array.from(listaDeContasElement.children).forEach(accountElement => {
                accountElement.classList.replace('bg-purple','bg-white');
                
                const paragraphs = accountElement.querySelectorAll('p');
                paragraphs[0].classList.replace('text-white','text-[#404040]');
                paragraphs[1].classList.replace('text-white','text-gray-400');

                const icons = accountElement.querySelectorAll('i');
                icons[icons.length-1].classList.add('hidden');
            });
        }

        function disableButtons(){
            const listaDeContasElement = document.getElementById('popup-vincular-pagina-escolher-conta-do-facebook-lista-de-contas-do-facebook');
            Array.from(listaDeContasElement.children).forEach(accountElement=>{
                listaDeContasElement.style.pointerEvents = 'none';
            });
        }
        
        function enableButtons(){
            const listaDeContasElement = document.getElementById('popup-vincular-pagina-escolher-conta-do-facebook-lista-de-contas-do-facebook');
            Array.from(listaDeContasElement.children).forEach(accountElement=>{
                listaDeContasElement.style.pointerEvents = 'auto';
            });
        }

        const accountFacebookElement = document.getElementById(`accountid-${account.idAccount}`);
        accountFacebookElement.addEventListener('click',async ()=>{
            
            resetButtons(); // resetar
            disableButtons();

            // esconder mensagem de escolher conta do facebook
            const mensagemEsconderContaDoFacebookElement = document.getElementById('popup-vincular-pagina-mensagem-escolher-conta-do-facebook');
            mensagemEsconderContaDoFacebookElement.classList.add('hidden');

            // alterar background da conta selecionada
            accountFacebookElement.classList.replace('bg-white','bg-purple');

            // alterar cores dos paragrafos da conta selecionada
            const paragrafosList = accountFacebookElement.querySelectorAll('p');
            paragrafosList[0].classList.replace('text-[#404040]','text-white');

            paragrafosList[1].classList.replace('text-gray-400','text-white');

            // mostrar icone de selecionado na conta selecionada
            accountFacebookElement.querySelectorAll('i').forEach(icon=>{
                icon.classList.remove('hidden');
            });

            this.page.account = account;

            // mostrar paginas do facebook carregando
            const escolherPaginaDoFacebookCarregandoElement = document.getElementById('popup-vincular-pagina-escolher-pagina-do-facebook-loading');
            escolherPaginaDoFacebookCarregandoElement.classList.remove('hidden');
            

            // pegar paginas
            const pages = await this.fluxogramaInstance.userApi.getPagesFb(account.idAccount);

            if(pages.pages.length>0){ // paginas encontradas
                // alterar subtitulo da lista de paginas 
                const listaDePaginasSubtitleElement = document.getElementById('popup-vincular-pagina-escolher-pagina-do-facebook-subtitle');
                listaDePaginasSubtitleElement.innerHTML = `${pages.pages.length === 1 ? `1 página encontrada`:`${pages.pages.length} páginas encontradas`}`;

                
                if(Object.keys(this.page.page).length === 0 ){
                    // mostrar mensagem de escolher pagina do facebook
                    const mensagemEscolherPaginaDoFacebookElement = document.getElementById('popup-vincular-pagina-escolher-pagina-do-facebook-mensagem');
                    mensagemEscolherPaginaDoFacebookElement.children[0].innerHTML = `Selecione a página do facebook`;
                    mensagemEscolherPaginaDoFacebookElement.classList.remove('hidden');
                }else{
                    // esconder mensagem de pagina do facebook
                    const mensagemEscolherPaginaDoFacebookElement = document.getElementById('popup-vincular-pagina-escolher-pagina-do-facebook-mensagem');
                    mensagemEscolherPaginaDoFacebookElement.classList.add('hidden');
                }

                // mostrar lista de paginas do facebooks
                const listaDePaginasElement = document.getElementById('popup-vincular-pagina-escolher-pagina-do-facebook-lista-de-paginas');
                listaDePaginasElement.innerHTML = '';
                pages.pages.forEach(page=>{
                    const pageElement = this.createPageElement(page);
                    listaDePaginasElement.appendChild(pageElement);
                    this.selectedPageEvent(page);
                });
                listaDePaginasElement.classList.remove('hidden');

                // esconder pagina do facebook carregando
                escolherPaginaDoFacebookCarregandoElement.classList.add('hidden');

                // mostrar lista de pagina do facebook
                const escolherPaginaDoFacebookElement = document.getElementById('popup-vincular-pagina-escolher-pagina-do-facebook');
                escolherPaginaDoFacebookElement.classList.remove('hidden');

                if(Object.keys(this.page.page).length > 0 && Object.keys(this.page.account).length > 0){
                    // mostrar botão de desvincular pagina 
                    const desvincularPaginaElement = document.getElementById("popup-vincular-pagina-botao-desvincular-pagina");
                    desvincularPaginaElement.classList.remove("hidden");
                }
            }else{ // nenhuma pagina vinculada a conta

                // esconder carregamento de paginas
                escolherPaginaDoFacebookCarregandoElement.classList.add('hidden');

                // mostrar paginas do facebook 
                const escolherPaginaDoFacebookElement = document.getElementById('popup-vincular-pagina-escolher-pagina-do-facebook');
                escolherPaginaDoFacebookElement.classList.remove('hidden');

                // esconder lista de paginas do facebook
                const listaDePaginaDoFacebookElement = document.getElementById('popup-vincular-pagina-escolher-pagina-do-facebook-lista-de-paginas');
                listaDePaginaDoFacebookElement.innerHTML = ``;
                listaDePaginaDoFacebookElement.classList.add('hidden');

                // alterar mensagem da lista de paginas do facebook
                const mensagemListaDePaginasDoFacebook = document.getElementById('popup-vincular-pagina-escolher-pagina-do-facebook-mensagem');
                mensagemListaDePaginasDoFacebook.children[0].innerHTML = `Nenhuma página encontrada vinculada a essa conta`;
                mensagemListaDePaginasDoFacebook.classList.remove('hidden');
                

                console.log('Nenhuma pagina encontrada vinculada com essa conta');
            }

            enableButtons();

        })
    }

    // selecionou pagina do facebook
    selectedPageEvent(page){
        function resetButtons(){
            // resetar elemento de conta do facebook
            const listaDePaginasElement = document.getElementById('popup-vincular-pagina-escolher-pagina-do-facebook-lista-de-paginas');
            Array.from(listaDePaginasElement.children).forEach(pageElement => {
                pageElement.classList.replace('bg-purple','bg-white');
                
                const paragraphs = pageElement.querySelectorAll('p');
                paragraphs[0].classList.replace('text-white','text-[#404040]');
                paragraphs[1].classList.replace('text-white','text-gray-400');

                const icons = pageElement.querySelectorAll('i');
                icons[icons.length-1].classList.add('hidden');
            });
        }

        function disableButtons(){
            const listaDePaginasElement = document.getElementById('popup-vincular-pagina-escolher-pagina-do-facebook-lista-de-paginas');
            Array.from(listaDePaginasElement.children).forEach(pageElement=>{
                pageElement.style.pointerEvents = 'none';
            });
        }
        
        function enableButtons(){
            const listaDePaginasElement = document.getElementById('popup-vincular-pagina-escolher-pagina-do-facebook-lista-de-paginas');
            Array.from(listaDePaginasElement.children).forEach(pageElement=>{
                pageElement.style.pointerEvents = 'auto';
            });
        } 

        function showLoading(){
            const pageLoading = document.getElementById(`page-${page.idPage}-loading`);
            pageLoading.classList.remove('hidden');
        }
        function hiddenLoading(){
            const pageLoading = document.getElementById(`page-${page.idPage}-loading`);
            pageLoading.classList.add('hidden');
        }

        


        const pageElement = document.getElementById(`pageid-${page.idPage}`);
        pageElement.addEventListener('click',async ()=>{
            // pagina escolhida, não gerar evento de clique novamente
            if(Object.keys(this.page.page).length > 0 && this.page.page.idPage === page.idPage ){
                return
            }

            resetButtons();
            disableButtons();

            // mostrar loading
            showLoading();

            // alterar conta e página do chatbot 
            const updatePage = {
                page:{
                    page:{
                        idPage:page.idPage
                    }, 
                    account: { 
                        idAccount: this.page.account.idAccount }
                    }
                };
            const chatbotUpdated = await this.fluxogramaInstance.chatbotApi.updateChatbot(this.chatbot, updatePage);
            if(Object.keys(chatbotUpdated).length > 0 && chatbotUpdated.updateKeys && !chatbotUpdated.updateKeys.includes('page')){ // update mal sucedido
                return
            }

            // esconder Loading
            hiddenLoading();


            this.chatbot = chatbotUpdated.chatbot;
            
            // esconder mensagem de escolher pagina do facebook
            const mensagemEscolherPaginaDoFacebookElement = document.getElementById('popup-vincular-pagina-escolher-pagina-do-facebook-mensagem');
            mensagemEscolherPaginaDoFacebookElement.classList.add('hidden');

            // alterar background da pagina escolhida
            pageElement.classList.replace('bg-white','bg-purple');

            // alterar cores dos paragrafos
            const paragraphs = pageElement.querySelectorAll('p');
            paragraphs[0].classList.replace('text-[#404040]','text-white');
            paragraphs[1].classList.replace('text-gray-400','text-white');

            // mostrar icone de pagina selecionada
            pageElement.lastElementChild.classList.remove('hidden');

            // adicionar pagina no chatbot
            const pageChatbotElement = document.getElementById(`chatbot-${this.chatbot._id}-page`);
            pageChatbotElement.children[1].innerHTML = `
            <div class="flex flex-row justify-center items-center">
                <div class="flex -space-x-[16px]">
                    <img class="w-[35px] h-[35px] border-2 border-white rounded-full" src="${this.chatbot.page.account.photo}" alt="">    
                    <div class="relative">
                        <img class="w-[35px] h-[35px] border-2 border-white rounded-full relative" src="${this.chatbot.page.page.photo}" alt="">
                        <span class="${this.chatbot.status === "ligado" ? ``:`hidden`} absolute top-[20px] left-[23px] w-[12px] h-[12px] bg-green-500 rounded-full border-2 border-white"></span>
                    </div>
                </div>
            </div>`;

            // mostrar botão de desvincular pagina 
            const desvincularPaginaElement = document.getElementById('popup-vincular-pagina-botao-desvincular-pagina');
            desvincularPaginaElement.classList.remove("hidden");

            // alterar botão do ellipsis pra desvincular página
            const chatbotBotaoDesvincularPaginaElement = document.getElementById(`chatbot-button-link-page-${this.chatbot._id}`);
            chatbotBotaoDesvincularPaginaElement.children[0].classList.replace('link','link-slash');
            chatbotBotaoDesvincularPaginaElement.children[1].innerHTML = `Desvincular página`;

            enableButtons();
        });
    }

    // desvincular pagina do facebook
    botaoDesvincularPaginaEvent(){
        const disabledButtons = ()=> {
            // desabilitar botões de contas
            const listaDeContasElement = document.getElementById('popup-vincular-pagina-escolher-conta-do-facebook-lista-de-contas-do-facebook');
            Array.from(listaDeContasElement.children).forEach(accountElement=>{
                listaDeContasElement.style.pointerEvents = 'none';
            });

            // desabilitar botões de paginas
            const listaDePaginasElement = document.getElementById('popup-vincular-pagina-escolher-pagina-do-facebook-lista-de-paginas');
            Array.from(listaDePaginasElement.children).forEach(pageElement=>{
                pageElement.style.pointerEvents = 'none';
            });

            // desabilitar botão de desvincular pagina
            const desvincularPaginaElement = document.getElementById('popup-vincular-pagina-botao-desvincular-pagina').querySelector('button');
            desvincularPaginaElement.style.pointerEvents = 'none';
        };

        const enableButtons = () =>{
            // desabilitar botões de contas
            const listaDeContasElement = document.getElementById('popup-vincular-pagina-escolher-conta-do-facebook-lista-de-contas-do-facebook');
            Array.from(listaDeContasElement.children).forEach(accountElement=>{
                listaDeContasElement.style.pointerEvents = 'auto';
            });

            // desabilitar botões de paginas
            const listaDePaginasElement = document.getElementById('popup-vincular-pagina-escolher-pagina-do-facebook-lista-de-paginas');
            Array.from(listaDePaginasElement.children).forEach(pageElement=>{
                pageElement.style.pointerEvents = 'auto';
            });

            // desabilitar botão de desvincular pagina
            const desvincularPaginaElement = document.getElementById('popup-vincular-pagina-botao-desvincular-pagina').querySelector('button');
            desvincularPaginaElement.style.pointerEvents = 'auto';
        };

        const showLoading = () =>{
            // mostrar loading
            const vincularPaginaElement = document.getElementById("popup-vincular-pagina-botao-desvincular-pagina");
            const button = vincularPaginaElement.querySelector('button');
            button.querySelector('p').classList.add('hidden');
            button.querySelector('i').classList.add('hidden');
            button.querySelector('svg').classList.remove('hidden');
        };
        const hiddenLoading = () =>{
            // esconder loading
            const vincularPaginaElement = document.getElementById("popup-vincular-pagina-botao-desvincular-pagina");
            const button = vincularPaginaElement.querySelector('button');
            button.querySelector('p').classList.remove('hidden');
            button.querySelector('i').classList.remove('hidden');
            button.querySelector('svg').classList.add('hidden');
        };

        const button = document.getElementById('popup-vincular-pagina-botao-desvincular-pagina').querySelector('button');
        button.addEventListener('click',async ()=>{
            // desativar botões de contas, paginas e desvincular
            disabledButtons();

            // mostrar loading
            showLoading();
            

            // alterar chatbot
            const update = await this.fluxogramaInstance.chatbotApi.updateChatbot(this.chatbot,{page:{page:{},account:{}}});
            if(update && typeof update === "object" && update.updateKeys && update.updateKeys){
                // alterar pagina do chatbot pra nenhum escolhida
                const pageElement = document.getElementById(`chatbot-${this.chatbot._id}-page`);
                pageElement.children[1].innerHTML = `<p id="chatbot-page-${this.chatbot._id}" class="text-base/none text-[#40404]">Nenhuma página vinculada</p>`;

                // alterar botão do ellipsis pra vincular pagina
                const botaoVincularContaElement = document.getElementById(`chatbot-button-link-page-${this.chatbot._id}`);
                botaoVincularContaElement.innerHTML = `
                <i class="fa-solid fa-link text-white min-w-[30px] min-h-[30px] rounded-[10px] flex justify-center items-center bg-purple shadow-[0_3px_8px_rgba(0,0,0,0.24)]"></i>
                <p class="text-nowrap">Vincular página</p>`;

                // esconder loading
                hiddenLoading();

                // habilitar botões
                enableButtons();

                // pagina desvinculada
                this.showPopup(this.chatbot);

            }else{
                // esconder loading
                hiddenLoading();

                // habilitar botões
                enableButtons();

                console.log('NÃO FOI POSSIVEL DESVINCULAR PAGINA');
            }

            

         
        });
    }
 

    carregarPaginas(){

    }

    addEvents(){
        this.closeEvent();
        this.botaoDesvincularPaginaEvent();
    }

    closeEvent(){ // fechar popup
        const button = document.getElementById('popup-vincular-pagina-button-close');
        button.addEventListener('click',()=>{
            this.hiddenPopup(); // esconder popup
        });
    }
}

class PopupEditarNomeDoChatbot{
    constructor({fluxogramaInstance}){
        this.fluxogramaInstance = fluxogramaInstance;

    }
}

class PopupDesligarChatbot{
    constructor({fluxogramaInstance}){
        this.fluxogramaInstance = fluxogramaInstance;
    }
}

class PopupEditarNome{
    constructor({fluxogramaInstance}){
        this.fluxogramaInstance = fluxogramaInstance;

        // criar elemento
        this.element = this.createElement();

        // chatbot
        this.chatbotInstance = undefined;
        this.chatbot = {};

        // adicionar eventos
        this.fecharPopupEvent();
        this.botaoDeCancelarEvent();
        this.botaoRenomearEvent();
        this.changeInputNameEvent();


    }

    createElement(){
        const element = document.getElementById("popup-chatbot-alterar-nome");
        element.innerHTML = `<!-- CODDING: Titulo -->
        <div class="w-full flex flex-row justify-start items-center py-[32px] px-[32px] space-x-[10px] bg-purple rounded-tl-[10px] rounded-tr-[10px] relative">
          <!-- CODDING: Botão Fechar -->
          <div id="popup-icon-close" class="absolute top-[32px] right-[32px] h-[40px] w-[40px] hover:bg-[#823f87] rounded-full flex justify-center items-center text-sm text-white cursor-pointer">
            <i class="fa-solid fa-xmark"></i>
          </div>
    
          <!-- CODDING: Texto -->
          <i class="fa-brands fa-facebook-messenger text-white text-xl"></i>
          <div class="flex flex-col justify-center items-start">
            <p class="text-sm text-white">Facebook</p>
            <p class="text-base/none text-white">Alterar Nome</p>
          </div>
        </div>
        
        
        <div class="w-full flex flex-col justify-start items-center bg-white rounded-[10px] relative">
    
          <!-- CODDING: Input Alterar Nome -->
          <div class="w-full flex flex-col px-[32px] pt-[16px] pb-[32px] justify-center items-start">
            <p class="text-base/none text-[#40404]">Alterar Nome</p>
            <input id="input-nome-3ieoh9je01m-kscrhu4ypto-oto3qyfja" type="text" placeholder="Adicionar nome" class="w-full py-[8px] outline-none bg-transparent text-purple border-t-0 border-l-0 border-r-0 border-b-2 border-purple " value="nome do chatbot #03">
          </div>
          
          <!-- CODDING: Botão de "cancelar" e "renomear" -->
          <div id="botao-cancelar-renomear-container"  class="hidden w-full px-[32px] py-[16px] flex flex-row justify-end items-center space-x-[10px]">
            
            <button id="botao-cancelar" class="flex-grow min-h-[40px] rounded-[10px] border border-gray-500 hover:bg-gray-100 text-sm  flex justify-center items-center space-x-[10px]">
              <p class="text-gray-900">cancelar</p>
            </button>
            <button id="botao-renomear" class="flex-grow min-h-[40px] rounded-[10px] bg-purple hover:bg-[#823f87] shadow-[0_3px_8px_rgba(0,0,0,0.24)] text-white text-sm flex justify-center items-center space-x-[10px]">
                <p class="">renomear</p>
                <!-- CODDING: Loading -->
                <svg aria-hidden="true" class="hidden inline w-6 h-6 text-transparent animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
            </button>
          </div>
        </div>`;
        return element;
    }   

    show(chatbot){
        // definir chatbot
        this.chatbot = chatbot;

        // atributo 
        this.element.setAttribute('chatbotid',`${chatbot._id}`);

        // alterar valor do input
        const input = this.element.querySelector('#input-nome-3ieoh9je01m-kscrhu4ypto-oto3qyfja');
        input.value = this.chatbot.name;

        // mostrar background
        const backgroundElement = document.getElementById('popup-background-full');
        backgroundElement.classList.remove('hidden');

        // mostrar popup
        this.element.classList.remove('hidden');
    }

    close(){ // fechar popup
        // esconder background
        const backgroundElement = document.getElementById('popup-background-full');
        backgroundElement.classList.add('hidden');

        // esconder popup
        this.element.classList.add('hidden');
    }

    botaoDeCancelarEvent(){
        const button = this.element.querySelector('#botao-cancelar');
        button.addEventListener("click", ()=>{
            // fechar popup
            this.close();
        });
    }

    botaoRenomearEvent(){
        const disableButtons = () => {
            // desativar icone de fechar popup
            const buttonIconClose = this.element.querySelector(`#popup-icon-close`);
            buttonIconClose.style.pointerEvents = "none";

            // desativar botão de fechar popup
            const buttonCancel = this.element.querySelector(`#botao-cancelar`);
            buttonCancel.style.pointerEvents = "none";

            // desativar input
            const input = this.element.querySelector(`#input-nome-3ieoh9je01m-kscrhu4ypto-oto3qyfja`);
            input.disabled = true;

            // desativar botão de renomear
            const buttonRename = this.element.querySelector(`#botao-renomear`);
            buttonRename.style.pointerEvents = "none";

        }

        const activateButtons = () => {
            // ativar icone de fechar popup
            const buttonIconClose = this.element.querySelector(`#popup-icon-close`);
            buttonIconClose.style.pointerEvents = "auto";

            // ativar botão de fechar popup
            const buttonCancel = this.element.querySelector(`#botao-cancelar`);
            buttonCancel.style.pointerEvents = "auto";

            // ativar input
            const input = this.element.querySelector(`#input-nome-3ieoh9je01m-kscrhu4ypto-oto3qyfja`);
            input.disabled = false;

            // ativar botão de renomear
            const buttonRename = this.element.querySelector(`#botao-renomear`);
            buttonRename.style.pointerEvents = "auto";

        }

        const showLoadingButton = () => {
            const button = this.element.querySelector(`#botao-renomear`);
            
            // esconder texto
            const paragraph = button.querySelector('p');
            paragraph.classList.add('hidden');

            // mostrar loading
            const loading = button.querySelector('svg');
            loading.classList.remove('hidden');

        }

        const showParagraphButton = () =>{
            const button = this.element.querySelector('#botao-renomear');
            
            // mostrar texto
            const paragraph = button.querySelector('p');
            paragraph.classList.remove('hidden');

            // esconder loading
            const loading = button.querySelector('svg');
            loading.classList.add('hidden');
        }

        const alterarNomeDoChatbot = async () => {
            const input = this.element.querySelector('#input-nome-3ieoh9je01m-kscrhu4ypto-oto3qyfja');
            const nome = input.value;

            const response = await this.fluxogramaInstance.chatbotApi.alterarNomeDoChatbot({ chatbot:this.chatbot, name:nome });
            if(response.status === true){
                this.chatbot = response.chatbot;
                if(this.chatbotInstance){
                    this.chatbotInstance.chatbot = response.chatbot;
                }
                return response;
            }else{
                return response;
            }
            
        };

        

        const button = this.element.querySelector('#botao-renomear');
        button.addEventListener('click', async ()=>{
            // desativar botões do popup
            disableButtons();

            // mostrar loading no botão
            showLoadingButton();

            // alterar nome no banco de dados
            const response = await alterarNomeDoChatbot();

            if(response.status === true){
                // alterar nome 
                const paragraph = document.getElementById(`chatbot-name-${this.chatbot._id}`);
                paragraph.textContent = this.chatbot.name;

                // fechar popup
                this.close();

                // reativar botões do popup
                activateButtons();

                // mostrar texto do botão "renomear"
                showParagraphButton();
            }else{
                // fechar popup
                this.close();

                // reativar botões do popup
                activateButtons();

                // mostrar texto do botão "renomear"
                showParagraphButton();
            }

            console.log('clicou pra renomear');
        });
    }

    changeInputNameEvent(){
        const hiddenButtons = () => {
            const buttonsContainer = this.element.querySelector(`#botao-cancelar-renomear-container`);
            buttonsContainer.classList.add("hidden");
        }

        const showButtons = () => {
            const buttonsContainer = this.element.querySelector(`#botao-cancelar-renomear-container`);
            buttonsContainer.classList.remove("hidden");
        }

        const input = this.element.querySelector(`#input-nome-3ieoh9je01m-kscrhu4ypto-oto3qyfja`);
        input.addEventListener('input',(event)=>{
            console.log(`this.chatbot.name: ${this.chatbot.name} | event.target.value: ${event.target.value}`);
            if(this.chatbot.name !== event.target.value.trim()){
                // mostrar botão de "cancelar" e "renomear"
                showButtons();
            }else{
                // esconder botão de "cancelar" e "renomear"
                hiddenButtons();
            }
            
        });
    }

    fecharPopupEvent(){
        const button = this.element.querySelector(`#popup-icon-close`);
        button.addEventListener("click",()=>{ //
            // fechar popup
            this.close();
        });
    }

    renomear(){

    }
}

class ChatbotCardElement{
    constructor({fluxogramaInstance,chatbot, editing=true}){
        // CODDING: Instancia Fluxograma
        this.fluxogramaInstance = fluxogramaInstance;

        // CODDING: Configurações 
        this.editing = editing;
        console.log('valor de editing:', this.editing);

        this.chatbot = chatbot;
        this.chatbotElement = this.createElement(this.chatbot); 

        this.addEvents();
    }

    createElement(chatbot){
        const cardElement = document.createElement('div');
        cardElement.setAttribute('chatbotid',`${chatbot._id}`);
        cardElement.className = 'w-[90%] bg-white rounded-[10px] shadow-[0_8px_24px_rgba(149,157,165,0.2)] flex flex-col md:flex-row items-center space-x-[0px] md:space-x-[24px] relative md:p-0 md:pl-[100px]';
        
        // CODDING: Horario
        const horarioDate = new Date(chatbot.updatedAt);
        const dia = horarioDate.getDate().toString().padStart(2,"0");
        const mes = horarioDate.getDate().toString().padStart(2,"0");
        const ano = horarioDate.getFullYear().toString();
        const hora = horarioDate.getHours().toString().padStart(2,"0");
        const minuto = horarioDate.getMinutes().toString().padStart(2,"0");
        const segundo = horarioDate.getSeconds().toString().padStart(2,"0");
        const horarioFormatado = `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`;

        console.log(`chatbot(${this.chatbot._id}).index:`, this.chatbot.index);
        console.log(`chatbot(${this.chatbot._id}).length:`, this.chatbot.length);
        
        let pageElement;
        if(chatbot.page && chatbot.page.page && chatbot.page.account && Object.keys(chatbot.page.page).length > 0 && Object.keys(chatbot.page.account).length > 0){
            pageElement = `
            <div class="flex flex-row justify-center items-center">
                <div class="flex -space-x-[16px]">
                    <img class="w-[35px] h-[35px] border-2 border-white rounded-full" src="${chatbot.page.account.photo}" alt="">    
                    <div class="relative">
                        <img class="w-[35px] h-[35px] border-2 border-white rounded-full relative" src="${chatbot.page.page.photo}" alt="">
                        <span class="${chatbot.status === "ligado" ? ``:`hidden`} absolute top-[20px] left-[23px] w-[12px] h-[12px] bg-green-500 rounded-full border-2 border-white"></span>
                    </div>
                </div>
                

            </div>`;
        }else{
            pageElement = `
            <p id="chatbot-page-${chatbot._id}" class="text-base/none text-[#40404]">Nenhuma página vinculada</p>`;
        }

        

        // CODDING: 
        cardElement.innerHTML = `<!-- CODDING: Imagem -->
        <div class="w-full md:w-[100px] h-[100px] md:h-auto md:flex-grow md:flex-shrink-0 rounded-tl-[10px] rounded-bl-[0px] rounded-tr-[10px] rounded-br-[0px] md:rounded-bl-[10px] md:rounded-tr-[0px] md:rounded-br-[0px] bg-purple flex justify-center items-center relative md:absolute md:top-0 md:bottom-0 md:left-0">
          <i class="fa-brands fa-facebook-messenger text-4xl text-white"></i>
        </div>

        

        <!-- CODDING: Detalhes -->
        <div class="w-full py-[32px] px-[16px] md:px-0 md:py-[24px] grid grid-cols-2 md:grid-cols-4 gap-4">
          
            <!-- CODDING: Nome do chatbot -->
          <div class="flex flex-col items-start">
            <p class="text-base text-purple font-bold">ChatBot</p>
            <p id="chatbot-name-${chatbot._id}" class="text-base/none text-[#40404]">${chatbot.name.trim() !== '' ? chatbot.name : 'Sem nome'}</p>
          </div>

          <!-- CODDING: Pagina -->
          <div id="chatbot-${chatbot._id}-page" class="flex flex-col items-start">
            <p class="text-base text-purple font-bold">Página</p>
            ${pageElement}
          </div>

        
        <!-- CODDING: Carregando status -->
        <div id="chatbot-status-carregando-${chatbot._id}" class="hidden flex flex-col items-start space-y-[5px]">
            <p class="h-[20px] w-[60px] rounded-[10px] bg-gray-200 animate-pulse"></p>
            <div class="flex flex-row justify-start items-center space-x-[5px]">
                <p class="h-[20px] w-[30px] rounded-[10px] bg-gray-200 animate-pulse"></p>
                <p class="h-[20px] w-[90px] rounded-[10px] bg-gray-200 animate-pulse"></p>
            </div>
        </div>

            <!-- CODDING: Status -->    
          <div id="chatbot-status-container-${chatbot._id}" class="flex flex-col items-start">
            <p class="text-base text-purple font-bold">Status</p>
            <div id="chatbot-status-${chatbot._id}" class="flex flex-row justify-start items-center space-x-[5px]">
              <div class="w-[8px] h-[8px] rounded-full bg-${chatbot.status === "ligado" ? "green-500" : "red-500"}"></div>
              <p class="text-base/none text-${chatbot.status === "ligado" ? "green-500" : "red-500"} font-medium">${chatbot.status.charAt(0).toUpperCase()+chatbot.status.slice(1)}</p>
            </div>
          </div>

          <!-- CODDING: Modificado -->
          <div class="flex flex-col items-start">
            <p class="text-base text-purple font-bold">Modificado</p>  
            <p id="chatbot-modificado-${chatbot._id}" class="text-base/none text-[#404040]">${horarioFormatado}</p>
          
          </div>

         
        </div>

        <!-- CODDING: Botões -->
        <div class="w-full md:w-auto flex flex-row justify-end md:justify-start items-center space-x-[5px] pr-[24px] mb-[16px] md:mb-[0px]">
            ${this.editing ? `<button id="chatbot-button-edit-${chatbot._id}" class="w-[120px] px-[16px] h-[50px] text-sm text-white rounded-[10px] bg-purple flex justify-center items-center space-x-[10px]">
            <i class="fa-solid fa-pen"></i>
            <span>Editar</span>
          </button>` : ``}  
        
          <div class="relative">
            <button id="chatbot-button-ellipsis-${chatbot._id}" class="px-[16px] h-[50px] rounded-[10px]  flex justify-center items-center space-x-[10px] bg-purple relative">
                <i class="fa-solid fa-ellipsis-vertical text-base text-white"></i>
            </button>

            <!-- CODDING: Opções shadow fraco: shadow-[0_8px_24px_rgba(149,157,165,0.2)] shadow forte: shadow-[0_5px_15px_rgba(0,0,0,0.35)] -->
            <div id="chatbot-button-ellipsis-options-${chatbot._id}" class="z-50 hidden absolute top-[100%] mt-[5px] mb-[16px] right-0 bg-white rounded-[10px] shadow-[0_8px_24px_rgba(149,157,165,0.2)]">
                <button id="chatbot-button-edit-name-${chatbot._id}" class=" px-[16px] py-[8px] text-sm text-[#404040] hover:text-purple flex flex-row justify-start items-center space-x-[10px] rounded-tl-[10px] transform transition-transform hover:scale-105">
                <i class="fa-solid fa-pen text-white min-w-[30px] min-h-[30px] rounded-[10px] flex justify-center items-center bg-purple shadow-[0_3px_8px_rgba(0,0,0,0.24)]"></i>
                    <p>Editar nome</p>
                </button>
                
                <button id="chatbot-button-link-page-${chatbot._id}" class=" px-[16px] py-[8px] text-sm text-[#404040] flex flex-row justify-start items-center space-x-[10px] transform transition-transform hover:scale-105">
                    <i class="fa-solid fa-${chatbot.page?.page?.idPage ? "link-slash":"link"} text-white min-w-[30px] min-h-[30px] rounded-[10px] flex justify-center items-center bg-purple shadow-[0_3px_8px_rgba(0,0,0,0.24)]"></i>
                    <p class="text-nowrap">${chatbot.page?.page?.idPage ? "Desvincular":"Vincular"} página</p>
                </button>
                
                <!-- CODDING: Botão de desligar e ligar -->
                <button id="chatbot-button-on-and-off-automation-${chatbot._id}" class=" px-[16px] py-[8px] text-sm text-[#404040] flex flex-row justify-start items-center space-x-[10px] transform transition-transform hover:scale-105">
                <i class="fa-solid fa-toggle-${chatbot.status === "ligado" ? "off":"on"} text-white min-w-[30px] min-h-[30px] rounded-[10px] flex justify-center items-center bg-purple shadow-[0_3px_8px_rgba(0,0,0,0.24)]"></i>
                    <p class="text-nowrap">${chatbot.status === "ligado" ? "Desligar" : "Ligar"} automação</p>
                </button>

                <!-- CODDING[LOADING]: Botão de desligar e ligar carregando -->
                <button id="chatbot-button-on-and-off-automation-loading-${chatbot._id}" class="hidden px-[16px] py-[8px] text-sm text-[#404040] flex flex-row justify-start items-center space-x-[10px] transform transition-transform hover:scale-105">
                    <div class="flex flex-row justify-start items-center space-x-[10px]">
                        <p class="h-[30px] w-[30px] rounded-[10px] bg-gray-200 animate-pulse"></p>
                        <p class="h-[20px] w-[120px] rounded-[10px] bg-gray-200 animate-pulse"></p>
                    </div>
                </button>
                
                <button id="chatbot-button-delete-${chatbot._id}" class=" px-[16px] py-[8px] text-sm text-[#404040] flex flex-row justify-start items-center space-x-[10px] transform transition-transform hover:scale-105">
                <i class="fa-solid fa-trash text-white min-w-[30px] min-h-[30px] rounded-[10px] flex justify-center items-center bg-purple shadow-[0_3px_8px_rgba(0,0,0,0.24)]"></i>
                    <p>Excluir</p>
                </button>
                
            </div>
          </div>
        </div>`;
        return cardElement;
    }

    addEvents(){
        this.buttonEditEvent();
        this.buttonEllipsisEvent();

        // botão de desligar e ligar automação
        this.buttonDesligarELigar();

        // botão de alterar nome
        this.buttonEditarNomeEvent();

        this.buttonVincularPaginaEvent();
    }

    buttonDesligarELigar(){
        const hiddenStatus = () => {
            const element = this.chatbotElement.querySelector(`#chatbot-status-container-${this.chatbot._id}`);
            element.classList.add('hidden');
        }
        const showStatus = () => {
            const element = this.chatbotElement.querySelector(`#chatbot-status-container-${this.chatbot._id}`);
            element.innerHTML = `<p class="text-base text-purple font-bold">Status</p>
            <div id="chatbot-status-${this.chatbot._id}" class="flex flex-row justify-start items-center space-x-[5px]">
              <div class="w-[8px] h-[8px] rounded-full bg-${this.chatbot.status === "ligado" ? "green-500" : "red-500"}"></div>
              <p class="text-base/none text-${this.chatbot.status === "ligado" ? "green-500" : "red-500"} font-medium">${this.chatbot.status.charAt(0).toUpperCase()+this.chatbot.status.slice(1)}</p>
            </div>`;
            element.classList.remove('hidden');
        }

        const hiddenButton = () => {
            const element = this.chatbotElement.querySelector(`#chatbot-button-on-and-off-automation-${this.chatbot._id}`);
            element.classList.add('hidden');
        }
        const showButton = () => {
            const element = this.chatbotElement.querySelector(`#chatbot-button-on-and-off-automation-${this.chatbot._id}`);
            element.innerHTML = `<i class="fa-solid fa-toggle-${this.chatbot.status === "ligado" ? "off":"on"} text-white min-w-[30px] min-h-[30px] rounded-[10px] flex justify-center items-center bg-purple shadow-[0_3px_8px_rgba(0,0,0,0.24)]"></i>
            <p class="text-nowrap">${this.chatbot.status === "ligado" ? "Desligar" : "Ligar"} automação</p>`;
            element.classList.remove('hidden');
        }

        const showButtonLoading = () => {
            const element = this.chatbotElement.querySelector(`#chatbot-button-on-and-off-automation-loading-${this.chatbot._id}`);
            element.classList.remove('hidden');
        }
        const hiddenButtonLoading = () => {
            const element = this.chatbotElement.querySelector(`#chatbot-button-on-and-off-automation-loading-${this.chatbot._id}`);
            element.classList.add('hidden');
        }

        const hiddenStatusLoading = () => {
            const element = this.chatbotElement.querySelector(`#chatbot-status-carregando-${this.chatbot._id}`);
            element.classList.add('hidden');
        }

        const showStatusLoading = () => { 
            const element = this.chatbotElement.querySelector(`#chatbot-status-carregando-${this.chatbot._id}`);
            element.classList.remove('hidden');
        }

        const recarregarPagina = () =>{
            let pageElement;
            if(this.chatbot.page && this.chatbot.page.page && this.chatbot.page.account && Object.keys(this.chatbot.page.page).length > 0 && Object.keys(this.chatbot.page.account).length > 0){
                pageElement = `
                <div class="flex flex-row justify-center items-center">
                    <div class="flex -space-x-[16px]">
                        <img class="w-[35px] h-[35px] border-2 border-white rounded-full" src="${this.chatbot.page.account.photo}" alt="">    
                        <div class="relative">
                            <img class="w-[35px] h-[35px] border-2 border-white rounded-full relative" src="${this.chatbot.page.page.photo}" alt="">
                            <span class="${this.chatbot.status === "ligado" ? ``:`hidden`} absolute top-[20px] left-[23px] w-[12px] h-[12px] bg-green-500 rounded-full border-2 border-white"></span>
                        </div>
                    </div>
                    

                </div>`;
            }else{
                pageElement = `
                <p id="chatbot-page-${this.chatbot._id}" class="text-base/none text-[#40404]">Nenhuma página vinculada</p>`;
            }

            const element = this.chatbotElement.querySelector(`#chatbot-${this.chatbot._id}-page`);
            element.innerHTML = `<p class="text-base text-purple font-bold">Página</p>
            ${pageElement}`;
        }

        const turnOffOrTurnOnChatbot = async () =>{
            if(this.chatbot.status === "ligado"){ // desligar
                const response = await this.fluxogramaInstance.chatbotApi.desligarChatbot(this.chatbot);
                if(response.status === true){
                    this.chatbot = response.chatbot;
                    return response;
                }else{
                    return response;
                }
            }else{ // ligar
                const response = await this.fluxogramaInstance.chatbotApi.ligarChatbot(this.chatbot);
                if(response.status === true){
                    this.chatbot = response.chatbot;
                    return response;
                }else{
                    return response;
                }
            }
        }


        const button = this.chatbotElement.querySelector(`#chatbot-button-on-and-off-automation-${this.chatbot._id}`);
        button.addEventListener("click",async ()=>{
            console.log("clicou no botão de desligar e ligar");
            // esconder botão
            hiddenButton();

            // mostrar botão carregando
            showButtonLoading();

            // esconder status
            hiddenStatus();

            // mostrar status carregando
            showStatusLoading();

            // desligar ou ligar chatbot
            const response = await turnOffOrTurnOnChatbot();

            if(response.status === true){
                // esconder status carregando
                hiddenStatusLoading();

                // mostrar status
                showStatus();

                // esconder botão carregando
                hiddenButtonLoading();

                // mostrar botão
                showButton();

                // mostrar icone de online na pagina
                recarregarPagina();

            }else{
                // esconder status carregando
                hiddenStatusLoading();

                // mostrar status
                showStatus();

                // esconder botão carregando
                hiddenButtonLoading();

                // mostrar botão
                showButton();

                // tirar icone de online na pagina
                recarregarPagina();ss
            }
        });
    }

    buttonEditarNomeEvent(){
       
        const mostrarPopup = () => {
            console.log("this.fluxogramaInstance.popupEditarNome:",this.fluxogramaInstance.popupEditarNome);
            this.fluxogramaInstance.popupEditarNome.chatbotInstance = this;
            this.fluxogramaInstance.popupEditarNome.show(this.chatbot);

        }

        const element = this.chatbotElement.querySelector(`#chatbot-button-edit-name-${this.chatbot._id}`);
        element.addEventListener('click',()=>{
            // mostrar popup de alterar nome
            mostrarPopup();

            console.log('clicou no botão de editar nome');
        })
    }

    buttonEditEvent(){
        const buttonEdit = this.chatbotElement.querySelector(`#chatbot-button-edit-${this.chatbot._id}`);
        if(buttonEdit){
            buttonEdit.addEventListener('click',()=>{
                console.log(`clicou no botão editar:`, this.chatbot._id);
                this.fluxogramaInstance.fluxogramaPages.paginaEditarChatbot(this.chatbot);
            });
        }
    }

    buttonEllipsisEvent(){
        function resetarEllipsis(){
            const listaDeChatbotsEncontradosElement = document.getElementById('lista-de-chatbots-encontrados');
            Array.from(listaDeChatbotsEncontradosElement.children).forEach(chatbotFound=>{
                chatbotFound.lastElementChild.lastElementChild.lastElementChild.classList.add('hidden');
            });
        }

        const buttonEllipsis = this.chatbotElement.querySelector(`#chatbot-button-ellipsis-${this.chatbot._id}`);
        buttonEllipsis.addEventListener('click',()=>{

            const optionsElement = this.chatbotElement.querySelector(`#chatbot-button-ellipsis-options-${this.chatbot._id}`);
            if(optionsElement.classList.contains('hidden')){
                resetarEllipsis(); // resetar
            }
            
            optionsElement.classList.toggle('hidden');

        })
    }

    buttonVincularPaginaEvent(){
        const button = this.chatbotElement.querySelector(`#chatbot-button-link-page-${this.chatbot._id}`);
        button.addEventListener('click',()=>{
            console.log('clicou pra vincular pagina:', this.chatbot._id);
            this.fluxogramaInstance.popupVincularPagina.showPopup(this.chatbot);
        })
    }
    
}

class FluxogramaPages{
    constructor({fluxogramaInstance}){
        this.fluxogramaInstance = fluxogramaInstance;

        // adicionar eventos
        this.addEvents();
    }

    addEvents(){
        this.botaoDeVoltar();
    }

    async listaDeChatbots(){
        // esconder botão de voltar
        const botaoDeVoltarElement = document.getElementById('construtor-de-fluxograma-botao-de-voltar');
        botaoDeVoltarElement.classList.add('hidden');

        // alterar titulo 
        const tituloElement = document.getElementById('construtor-de-fluxograma-title');
        tituloElement.innerHTML = `Minhas Automações`;

        // alterar subtitulo 
        const subtitleElement = document.getElementById('construtor-de-fluxograma-subtitle');
        subtitleElement.innerHTML = `0 automações encontradas`;

        // mostrar botão de criar automação
        const botaoCriarAutomacao = document.getElementById('botao-criar-automacao');
        botaoCriarAutomacao.classList.remove('hidden');

        // esconder detalhes do chatbot
        const detalhesDoChatbotElement = document.getElementById('detalhes-do-chatbot-container');
        detalhesDoChatbotElement.classList.add('hidden');

        // esconder construtor de fluxograma
        const construtorDeFluxogramaContainer = document.getElementById('construtor-de-fluxograma-container');
        //construtorDeFluxogramaContainer.className = `w-full px-[16px] flex flex-col items-center justify-center absolute left-[100%] top-[100%]`;

        const nenhumChatbotEncontradoElement = document.getElementById('nenhum-chatbot-encontrado');
        nenhumChatbotEncontradoElement.classList.add('hidden');
        const listaDeChatbotsElement = document.getElementById('lista-de-chatbots-encontrados');
        listaDeChatbotsElement.innerHTML = "";
        listaDeChatbotsElement.classList.add('hidden');
        const listaDeChatbotsCarregandoElement = document.getElementById('lista-de-chatbots-carregando');
        listaDeChatbotsCarregandoElement.classList.remove('hidden');

        // procurar chatbots no servidor
        const chatbots = await this.fluxogramaInstance.chatbotApi.getChatbots();
        console.log('FluxogramaPages() --> listaDeChatbots() --> resposta da constante "chatbos":',chatbots);


        if(chatbots.length===0){
            // esconder lista de chatbots carregando
            listaDeChatbotsCarregandoElement.classList.add('hidden');

            // mostrar nenhum chatbot encontrado
            nenhumChatbotEncontradoElement.classList.remove('hidden');
            return
        }

        if(chatbots.length>0){
            // alterar subtitle 
            const subtitleElement = document.getElementById('construtor-de-fluxograma-subtitle');
            subtitleElement.innerHTML = `${chatbots.length === 1 ? `${chatbots.length} automação encontrada`:`${chatbots.length} automações encontradas`}`;

            // mostrar lista de chatbots encontrados
            listaDeChatbotsElement.classList.remove('hidden');

            // esconder lista de chatbots carregando
            listaDeChatbotsCarregandoElement.classList.add('hidden')
            chatbots.forEach((chatbot,index)=>{
                // criar card de chatbot e adicionar na pagina
                chatbot.index = index;
                chatbot.length = chatbot.length;
                const chatbotCardElement = new ChatbotCardElement({fluxogramaInstance: this.fluxogramaInstance, chatbot: chatbot});
                listaDeChatbotsElement.appendChild(chatbotCardElement.chatbotElement);
                
            })
        }

        
    }

    createChatbotElement(chatbot){

        const cardElement = document.createElement('div');
        cardElement.id = `detalhes-do-chatbot`;
        cardElement.setAttribute('chatbotid',`${chatbot._id}`);
        cardElement.className = 'w-[90%] bg-white rounded-[10px] shadow-[0_8px_24px_rgba(149,157,165,0.2)] flex flex-col md:flex-row items-center space-x-[0px] md:space-x-[24px] relative md:p-0 md:pl-[100px]';
        
        // CODDING: Horario
        const horarioDate = new Date(chatbot.updatedAt);
        const dia = horarioDate.getDate().toString().padStart(2,"0");
        const mes = horarioDate.getDate().toString().padStart(2,"0");
        const ano = horarioDate.getFullYear().toString();
        const hora = horarioDate.getHours().toString().padStart(2,"0");
        const minuto = horarioDate.getMinutes().toString().padStart(2,"0");
        const segundo = horarioDate.getSeconds().toString().padStart(2,"0");
        const horarioFormatado = `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`;

        console.log(`chatbot(${chatbot._id}).index:`, chatbot.index);
        console.log(`chatbot(${chatbot._id}).length:`, chatbot.length);
        
        let pageElement;
        if(chatbot.page && chatbot.page.page && chatbot.page.account && Object.keys(chatbot.page.page).length > 0 && Object.keys(chatbot.page.account).length > 0){
            pageElement = `
            <div class="flex flex-row justify-center items-center">
                <div class="flex -space-x-[16px]">
                    <img class="w-[35px] h-[35px] border-2 border-white rounded-full" src="${chatbot.page.account.photo}" alt="">    
                    <div class="relative">
                        <img class="w-[35px] h-[35px] border-2 border-white rounded-full relative" src="${chatbot.page.page.photo}" alt="">
                        <span class="${chatbot.status === "ligado" ? ``:`hidden`} absolute top-[20px] left-[23px] w-[12px] h-[12px] bg-green-500 rounded-full border-2 border-white"></span>
                    </div>
                </div>
                

            </div>`;
        }else{
            pageElement = `
            <p id="detalhes-do-chatbot-page" class="text-base/none text-[#40404]">Nenhuma página vinculada</p>`;
        }

        

        // CODDING: 
        cardElement.innerHTML = `<!-- CODDING: Imagem -->
        <div class="w-full md:w-[100px] h-[100px] md:h-auto md:flex-grow md:flex-shrink-0 rounded-tl-[10px] rounded-bl-[0px] rounded-tr-[10px] rounded-br-[0px] md:rounded-bl-[10px] md:rounded-tr-[0px] md:rounded-br-[0px] bg-purple flex justify-center items-center relative md:absolute md:top-0 md:bottom-0 md:left-0">
          <i class="fa-brands fa-facebook-messenger text-4xl text-white"></i>
        </div>

        

        <!-- CODDING: Detalhes -->
        <div class="w-full py-[32px] px-[16px] md:px-0 md:py-[24px] grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div class="flex flex-col items-start">
            <p class="text-base text-purple font-bold">ChatBot</p>
            <p id="detalhes-do-chatbot-name" class="text-base/none text-[#40404]">${chatbot.name.trim() !== "" ? chatbot.name : `Sem nome`}</p>
            
          </div>
          <div id="detalhes-do-chatbot-page" class="flex flex-col items-start">
            <p class="text-base text-purple font-bold">Página</p>
            ${pageElement}
          </div>

        
        
          <div class="flex flex-col items-start">
            <p class="text-base text-purple font-bold">Status</p>
            <div id="detalhes-do-chatbot-status" class="flex flex-row justify-start items-center space-x-[5px]">
              <div class="w-[8px] h-[8px] rounded-full bg-${chatbot.status === "ligado" ? "green-500" : "red-500"}"></div>
              <p class="text-base/none text-${chatbot.status === "ligado" ? "green-500" : "red-500"} font-medium">${chatbot.status.charAt(0).toUpperCase()+chatbot.status.slice(1)}</p>
            </div>
          </div>
          <div class="flex flex-col items-start">
            <p class="text-base text-purple font-bold">Modificado</p>  
            <p id="detalhes-do-chatbot-modificado" class="text-base/none text-[#404040]">${horarioFormatado}</p>
          </div>

         
        </div>

        <!-- CODDING: Botões -->
        <div class="w-full md:w-auto flex flex-row justify-end md:justify-start items-center space-x-[5px] pr-[24px] mb-[16px] md:mb-[0px]">
          
          <div class="relative">
            <button id="detalhes-do-chatbot-button-ellipsis" class="px-[16px] h-[50px] rounded-[10px]  flex justify-center items-center space-x-[10px] bg-purple relative">
                <i class="fa-solid fa-ellipsis-vertical text-base text-white"></i>
            </button>

            <!-- CODDING: Opções shadow fraco: shadow-[0_8px_24px_rgba(149,157,165,0.2)] shadow forte: shadow-[0_5px_15px_rgba(0,0,0,0.35)] -->
            <div id="detalhes-do-chatbot-button-ellipsis-options" class="z-50 hidden absolute top-[100%] mt-[5px] mb-[16px] right-0 bg-white rounded-[10px] shadow-[0_8px_24px_rgba(149,157,165,0.2)]">
                <button id="detalhes-do-chatbot-button-edit-name" class=" px-[16px] py-[8px] text-sm text-[#404040] hover:text-purple flex flex-row justify-start items-center space-x-[10px] rounded-tl-[10px] transform transition-transform hover:scale-105">
                <i class="fa-solid fa-pen text-white min-w-[30px] min-h-[30px] rounded-[10px] flex justify-center items-center bg-purple shadow-[0_3px_8px_rgba(0,0,0,0.24)]"></i>
                    <p>Editar nome</p>
                </button>
                
                <button id="detalhes-do-chatbot-button-link-page" class=" px-[16px] py-[8px] text-sm text-[#404040] flex flex-row justify-start items-center space-x-[10px] transform transition-transform hover:scale-105">
                    <i class="fa-solid fa-${chatbot.page?.page?.idPage ? "link-slash":"link"} text-white min-w-[30px] min-h-[30px] rounded-[10px] flex justify-center items-center bg-purple shadow-[0_3px_8px_rgba(0,0,0,0.24)]"></i>
                    <p class="text-nowrap">${chatbot.page?.page?.idPage ? "Desvincular":"Vincular"} página</p>
                </button>
                
                <button id="detalhes-do-chatbot-button-on-and-off-automation" class=" px-[16px] py-[8px] text-sm text-[#404040] flex flex-row justify-start items-center space-x-[10px] transform transition-transform hover:scale-105">
                <i class="fa-solid fa-toggle-${chatbot.status === "ligado" ? "off":"on"} text-white min-w-[30px] min-h-[30px] rounded-[10px] flex justify-center items-center bg-purple shadow-[0_3px_8px_rgba(0,0,0,0.24)]"></i>
                    <p class="text-nowrap">${chatbot.status === "ligado" ? "Desligar" : "Ligar"} automação</p>
                </button>
                
                <button id="detalhes-do-chatbot-button-delete" class=" px-[16px] py-[8px] text-sm text-[#404040] flex flex-row justify-start items-center space-x-[10px] transform transition-transform hover:scale-105">
                <i class="fa-solid fa-trash text-white min-w-[30px] min-h-[30px] rounded-[10px] flex justify-center items-center bg-purple shadow-[0_3px_8px_rgba(0,0,0,0.24)]"></i>
                    <p>Excluir</p>
                </button>
                
            </div>
          </div>
        </div>`;
        return cardElement;
    }

    async botaoDeVoltar(){
        const botao = document.getElementById(`construtor-de-fluxograma-botao-de-voltar`);
        botao.addEventListener('click', ()=>{
            this.listaDeChatbots();
        });
    }

    async paginaEditarChatbot(chatbot){
        console.log(`[@LOG] valor do fluxograma this.fluxogramaInstance.fluxograma:`,this.fluxogramaInstance.fluxograma);
        // mostrar botão de voltar
        const botaoDeVoltarElement = document.getElementById('construtor-de-fluxograma-botao-de-voltar');
        botaoDeVoltarElement.classList.remove('hidden');

        // alterar titulo 
        const tituloElement = document.getElementById('construtor-de-fluxograma-title');
        tituloElement.innerHTML = `Editar Automação `;

        // alterar subtitulo 
        const subtituloElement = document.getElementById('construtor-de-fluxograma-subtitle');
        subtituloElement.innerHTML = `${chatbot._id}`;
        
        // esconder botão de criar automação
        const botaoCriarAutomacaoElement = document.getElementById('botao-criar-automacao');
        botaoCriarAutomacaoElement.classList.add('hidden')

        // esconder lista de chatbots encontrados
        const listaDeChatbotsEncontradosElement = document.getElementById('lista-de-chatbots-encontrados');
        listaDeChatbotsEncontradosElement.classList.add('hidden');

        // criar elemento de detalhes do chatbot
        //const chatbotElement = this.createChatbotElement(chatbot);
        const chatbotElement = new ChatbotCardElement({fluxogramaInstance: this.fluxogramaInstance, chatbot: chatbot, editing: false});
        const detalhesDoChatbotContainerElement = document.getElementById('detalhes-do-chatbot-container');
        detalhesDoChatbotContainerElement.innerHTML = "";
        detalhesDoChatbotContainerElement.appendChild(chatbotElement.chatbotElement);
        detalhesDoChatbotContainerElement.classList.remove('hidden'); // mostrar detalhes do chatbot
        
        // mostrar construtor de fluxograma
        const construtorDeFluxogramaContainer = document.getElementById('construtor-de-fluxograma-container');
        const construtorDeFluxogramaElement = document.getElementById('construtor-de-fluxograma');
    
        //construtorDeFluxogramaElement.innerHTML =  ``;
        construtorDeFluxogramaContainer.className = `w-full px-[16px] flex flex-col items-center justify-center`;
        
        this.fluxogramaInstance.chatbot = chatbot;
        this.fluxogramaInstance.build();
        
    }
}

class Fluxograma{
    constructor(){
        // CODDING: Elementos HTML
        this.popupEditar = new PopupEditar({fluxogramaInstance: this});
        this.popupVincularPagina = new PopupVincularPagina({fluxogramaInstance: this});
        this.popupEditarNome = new PopupEditarNome({fluxogramaInstance: this});

        // CODDING: Usuario e ChatBot(API)
        this.userApi = new UserAPI({fluxogramaInstance: this});
        this.chatbotApi = new ChatbotAPI({fluxogramaInstance: this});

        // CODDING: Paginas
        this.fluxogramaPages = new FluxogramaPages({fluxogramaInstance: this});
        this.fluxogramaPages.listaDeChatbots();


        this.fluxogramaElement = document.getElementById('construtor-de-fluxograma');
        this.chatbot = {
            name: "",
            page:"",
            status:"",
            flowchart:{
                trigger: {
                    type:""
                },
                children:[
                    {
                        type: "card",
                        content: {
                            elements:[
                                {
                                    title:"Kit 5 Camisetas Novastreet Dry Fit Anti Suor - Linha Premium",
                                    subtitle:"Nossa camiseta DRY FIT foi desenvolvida para performance extrema, ideal para práticas esportivas, oferecendo ao usuário conforto incomparável com muito frescor.",
                                    image_url:"https://http2.mlstatic.com/D_NQ_NP_910816-MLB50182161976_062022-O.webp",
                                    buttons:[
                                      
                                        {
                                            type: "web_url",
                                            url: "https://www.novastreet.com.br/MLB-1933116168-kit-5-camisetas-novastreet-dry-fit-anti-suor-linha-premium-_JM",
                                            title: "Comprar Agora"
                                        },

                                        {
                                            etype: "postback",
                                            payload: "button-01-hchdsd-sdfjf-sjsadf",
                                            title: "Botão 01",
                                            children:[
                                                {
                                                    type: "video",
                                                    vido:{
                                                        video_url:""
                                                    },
                                                    children:[

                                                    ]
                                                }
                                            ]
                                        }
                                        
                                    ]
                                },
                                {
                                    title:"Jaqueta Corta Vento Masculina Lisa Com Capuz Blusa Leve",
                                    subtitle:"Experimente o máximo de conforto e proteção com nossa jaqueta corta vento masculina com capuz. Feita com materiais leves e resistentes, esta peça é perfeita para enfrentar ventos fortes. O capuz ajustável adiciona um toque extra de proteção, mantendo você protegido em todas as condições climáticas. Seja para atividades ao ar livre ou para o dia a dia, esta jaqueta oferece o equilíbrio ideal entre estilo e funcionalidade. Não deixe o vento atrapalhar seus planos - escolha qualidade e confiança com nossa jaqueta corta vento masculina.",
                                    image_url:"https://http2.mlstatic.com/D_NQ_NP_926792-MLB70330277196_072023-O.webp",
                                    buttons:[
                                        
                                        {
                                            type: "web_url",
                                            url: "https://www.novastreet.com.br/MLB-3786087122-jaqueta-corta-vento-masculina-lisa-com-capuz-blusa-leve-_JM#position=1&search_layout=grid&type=item&tracking_id=738ffa4d-e0e7-4232-b61a-64d48acd75fe",
                                            title: "Comprar Agora"
                                        }
                                    ]
                                },
                                {
                                    title:"Kit 3 Camisetas Femininas Sobre Legging Tapa Bumbum Uv 50+",
                                    subtitle:"Prepare-se para seus treinos ao ar livre com nosso kit de camisetas femininas para academia que cobrem o bumbum e têm proteção UV 50! Projetadas especificamente para oferecer mais cobertura para maior confiança durante os exercícios, essas camisetas também apresentam tecnologia avançada de proteção contra raios UV nocivos, mantendo você protegida enquanto se exercita ao ar livre.",
                                    image_url:"https://http2.mlstatic.com/D_NQ_NP_672796-MLB54854032818_042023-O.webp",
                                    buttons:[
                                        {
                                            type: "web_url",
                                            url: "https://www.novastreet.com.br/MLB-3436705134-kit-3-camisetas-femininas-sobre-legging-tapa-bumbum-uv-50-_JM#position=13&search_layout=stack&type=item&tracking_id=c0fef63e-c721-44bf-9ea9-6716eb467c57",
                                            title: "Comprar Agora"
                                        }
                                    ]
                                }
                            ]
                        },
                        delay:{
                            seconds:60,
                            typingAction: false
                        },
                     
                        children:[
                            {
                                type: "audio",
                                content: "mensagem filha da primeira mensagem",
                                audio:{
                                    size:0,
                                    duration:0,
                                    audio_url:"https://localhost:5500/chatbot/media/audios/alucina%C3%A7%C3%A3o.mp3"
                                },
                                delay:{
                                    seconds:120,
                                    typingAction:false
                                },
                                buttons:[
                                    {
                                        title: 'botão 01',
                                        children:[
                                            {type: "message",
                                            content: "mensagem do botão d",
                                            buttons:[],
                                            children:[]}
                                        ]
                                    },
                                    {
                                        title: 'botão 02',
                                        children:[
                                            {type: "message",
                                            content: "mensagem do botão d",
                                            buttons:[],
                                            children:[]}
                                        ]
                                    },
                                    {
                                        title: 'botão 03',
                                        children:[
                                            {type: "message",
                                            content: "mensagem do botão d",
                                            buttons:[],
                                            children:[]}
                                        ]
                                    },
                                    {
                                        title: 'botão 04',
                                        children:[
                                            {type: "message",
                                            content: "mensagem do botão d",
                                            buttons:[],
                                            children:[]}
                                        ]
                                    },
                                    {
                                        title: 'botão 05',
                                        children:[
                                            {type: "message",
                                            content: "mensagem do botão d",
                                            buttons:[],
                                            children:[]}
                                        ]
                                    },
                                    {
                                        title: 'botão 06',
                                        children:[
                                            {type: "message",
                                            content: "mensagem do botão d",
                                            buttons:[],
                                            children:[]}
                                        ]
                                    }
                                ],
                                children:[]
                            }
                        ]
                    }
                ]
            }
        };

       

     
        
    }

    build(){
        // CODDING: Criar lista para buildar fluxograma
        const lista = [];
        const firstSublista = []
        
        // CODDING: Criando Gatilho/Trigger
        const triggerInstance = new TriggerElement({fluxogramaInstance: this});
        this.chatbot.flowchart.trigger['elementInstance'] = triggerInstance;
        this.chatbot.flowchart.trigger['element'] = triggerInstance.element;
        firstSublista.push(this.chatbot.flowchart.trigger);

        // CODDING: Primeiro Children
        let isFirstChildren = this.chatbot.flowchart.children?.length>0;
        if(isFirstChildren){
            const firstChildren = this.chatbot.flowchart.children[0];

            // adicionar primeiro children na sublista
            firstChildren['elementInstance'] = new ChildrenElement({child: firstChildren, fluxogramaInstance: this});
            firstChildren['element'] = firstChildren['elementInstance'].element;
            firstSublista.push(firstChildren);
            lista.push(firstSublista);

            function percorrerLista(sublista){
                const newSublista = [];
    
                sublista.forEach(children=>{
                    // adicionar children 
                    if(children.children?.length > 0){
                        children.children[0]["elementInstance"] = new ChildrenElement({child: children.children[0], fluxogramaInstance: this});
                        children.children[0]["element"] = children.children[0]["elementInstance"].element;
                        newSublista.push(children.children[0]);
                    }
    
                    // adicionar childrens dos buttons do tipo "message"
                    if(children.type === "message" && children.buttons?.length > 0 && children.buttons.every(button=> typeof button === "object")){
                        children.buttons.forEach(button=>{
                            if(button.type === "postback" && button.children?.length > 0 && button.children.every(childrenButton=>typeof childrenButton === "object")){
                                button.children[0]["elementInstance"] = new ChildrenElement({child: button.children[0], fluxogramaInstance: this});
                                button.children[0]["element"] = button.children[0]["elementInstance"].element;
                                newSublista.push(button.children[0]);
                            }
                        })
                    }
    
                    // adicionar childrens dos botões do "card"
                    if(children.type === "card" && children.content?.elements?.length > 0){
                        children.content.elements.forEach(element => {
                            if(element.buttons?.length > 0){
                                element.buttons.forEach(button=>{
                                    if(button.type === "postback" && button.children?.length > 0){
                                        button.children[0]["elementInstance"] = new ChildrenElement({child: button.children[0], fluxogramaInstance: this});
                                        button.children[0]["element"] = button.children[0]["elementInstance"].element;
                                        newSublista.push(button.children[0]);
                                    }
                                });
                            }
                        });
                    } 
                });
    
                console.log(`percorrerLista() --> nova sublista:`,newSublista);
    
                if(newSublista.length > 0){
                    lista.push(newSublista);
                    percorrerLista(newSublista);
                }
            }
    
            percorrerLista([firstChildren])

        }else{
            lista.push(firstSublista);
        }

        
        console.log(`VALOR DA LISTA DEPOIS DE PERCORRER percorrerLista():`, lista);
        

        this.fluxogramaElement.innerHTML = ``;
        
        lista.forEach(sublista=>{
            const sessao = document.createElement('div');
            sessao.className = `flex flex-row justify-center items-start space-x-[64px]`;

            sublista.forEach(item=>{
                console.log('item:', item);
                console.log('item.element:', item.element);
                sessao.appendChild(item.element);
            });
            this.fluxogramaElement.appendChild(sessao);
        })

        return 
        
        
      
        
  
        const item01 = [this.chatbot.flowchart.trigger];
        
        // criar lista de elementos HTML
        if(this.chatbot.flowchart.children.length > 0){ 
            this.chatbot.flowchart.children[0]['elementInstance'] = new ChildrenElement({child: this.chatbot.flowchart.children[0], fluxogramaInstance: this});
            this.chatbot.flowchart.children[0]["elementHTML"] = this.chatbot.flowchart.children[0]['elementInstance'].element;
            this.chatbot.flowchart.children[0]["elementHTML"].id = this.chatbot.flowchart.children[0].id;
            item01.push(this.chatbot.flowchart.children[0]);
            lista.push(item01);
            console.log('LISTA ATÉ AQUI:', lista);
            

            // CODDING: 2° item da lista
            const item02 = [];
            const hasButtons = (this.chatbot.flowchart.children[0].buttons && this.chatbot.flowchart.children[0].buttons.length>0 && this.chatbot.flowchart.children[0].buttons.every(button=> Array.isArray(button)))?true:false;
            const hasChildren = (this.chatbot.flowchart.children[0].children && this.chatbot.flowchart.children[0].children.length>0)?true:false;
            if(hasChildren){
                this.chatbot.flowchart.children[0].children[0]['elementInstance'] = new ChildrenElement({child: this.chatbot.flowchart.children[0].children[0], fluxogramaInstance: this});
                this.chatbot.flowchart.children[0].children[0]['elementHTML'] = this.chatbot.flowchart.children[0].children[0]['elementInstance'].element;
                this.chatbot.flowchart.children[0].children[0]['elementHTML'].id = this.chatbot.flowchart.children[0].children[0].id;
                item02.push(this.chatbot.flowchart.children[0].children[0]);
            }
            if(hasButtons){
                this.chatbot.flowchart.children[0].buttons.slice().reverse().forEach((button,index)=>{
                    if(button.children.length>0){
                        button.children[0]['elementClass'] = new ChildrenElement({child:button.children[0], fluxogramaInstance: this});
                        button.children[0]['elementHTML'] = button.children[0]['elementClass'].element;
                        button.children[0]['elementHTML'].id = button.children[0].id;
                        button.children[0]['buttonIndex'] = index+1;
                        item02.push(button.children[0]);
                    }
                });
            }
            
            
           

            if(item02.length>0){
                lista.push(item02);
               
                
                while(true){
                    const ultimoItemDaLista = lista[lista.length-1];
                    const newItemList = [];
                    for(const item of ultimoItemDaLista){
                       
                        
                        const hasChildrens = item.children?.length>0;
                        const hasButtons = (item.buttons.length>0 && item.buttons.every(button=> Array.isArray(button)));
                        if(hasChildrens){
                            item.children[0]['elementInstance'] = new ChildrenElement({child: item.children[0], fluxogramaInstance: this});
                            item.children[0]['elementHTML'] = item.children[0]['elementInstance'].element;
                            item.children[0]['elementHTML'].id = item.children[0].id;
                            newItemList.push(item.children[0]);
                        }
                        if(hasButtons){
                            item.buttons.slice().reverse().forEach((button, index)=>{
                                if(button.children.length>0){
                                    button.children[0]['elementClass'] = new ChildrenElement({child: button.children[0], fluxogramaInstance: this});
                                    button.children[0]['elementHTML'] = button.children[0]['elementClass'].element;
                                    button.children[0]['elementHTML'].id = button.children[0].id;
                                    button.children[0]['buttonIndex'] = index+1;
                                    newItemList.push(button.children[0]);

                                    //console.log(`${index}. `,button);
                                }
                            });
                        }                        
                    }
                    if(newItemList.length>0){
                        lista.push(newItemList);
                    }else{
                        break;
                    }
                }
            }


        }
        
        console.log('LISTA SEPARADA COM OS ITEMS DO FLUXOGRAMA:',lista);
        console.log('FLUXOGRAMA:', this.fluxograma);
        return
         
        function addLine({item,fatherElement, childrenElement, type}){
            /* item --> {
                type: "message",
                content: "",
                id: "children-1",
                parentId: "children-0",
                parentButtonId: "button-0",


                item.indexNaLista = idx;
                item.tamanhoDaLista = sublista.length;
                item.quantidadeDeCardsComBotoesNaLista = quantidadeDeCardsComBotoes;
                item.indexDoCardComBotao = contagemIndexCardComBotao;
            } */
            fatherElement.classList.add('relative');
            childrenElement.classList.add('relative');

            //console.log(`function addLine, index: ${item.index}, listLenght: ${item.lenghtList} -->`,item);

            if(type === "trigger"){
                const distanciaHorizontal = childrenElement.offsetLeft-(fatherElement.offsetLeft+fatherElement.offsetWidth);
                
                const lineFather = document.createElement('div');
                lineFather.className = `absolute top-[50%] left-[100%] w-[${distanciaHorizontal}px] h-[3px] bg-purple z-10`;
                lineFather.innerHTML = `<div class="w-full h-full relative">
                    <!-- CODDING: Quadrado -->
                    <div class="absolute left-[-7px] top-[-6px] w-[15px] h-[15px] bg-purple"></div>

                    <!-- CODDING: Triangulo -->
                    <div class="absolute bottom-[-9px] right-[-9px] w-0 h-0 
                        border-purple
                        border-t-[10px] border-t-transparent
                        border-l-[10px] 
                        border-b-[10px] border-b-transparent
                        border-r-transparent">
                    </div>
                </div>`;
                fatherElement.appendChild(lineFather);
            }

            if(type==="button"){
                
                const valorDaMultiplicacao = item.quantidadeDeCardsComBotoesNaLista-(item.indexDoCardComBotao-1)
                const offsetRightButton = Math.abs(fatherElement.offsetParent.offsetWidth - (fatherElement.offsetLeft + fatherElement.offsetWidth));
                const offsetBottomButton =  Math.abs(fatherElement.offsetParent.offsetHeight - (fatherElement.offsetTop+(fatherElement.offsetHeight/2)));
                
                const distanciaHorizontal = (fatherElement.offsetParent.offsetLeft+fatherElement.offsetLeft+fatherElement.offsetWidth)+(offsetRightButton+(64+(item.buttonIndex*32))) - (childrenElement.offsetLeft+(childrenElement.offsetWidth/2));

                
                let direcao = "right"
                if(distanciaHorizontal<0){
                    //console.log(`item com a distancia horiontal menor que 0(${distanciaHorizontal}):`, item);
                    direcao = "left";
                }

                const espacamento = distanciaHorizontal < 0 ? offsetBottomButton - (32 + ((item.buttonIndex - 5) * 32)) : offsetBottomButton+(32+(item.buttonIndex*32));
                const distanciaVertical = Math.abs(((fatherElement.offsetHeight/2)+fatherElement.offsetTop+fatherElement.offsetParent.offsetTop)-childrenElement.offsetTop)- espacamento;
                

                const lineFather = document.createElement('div');
                lineFather.className = `absolute top-[50%] left-[100%] w-[${offsetRightButton+(64+(item.buttonIndex*32))}px] h-[3px] bg-purple z-10`;
                lineFather.innerHTML = `<div class="w-full h-full relative">
                    <!-- quadrado -->
                    <div class="absolute left-[-7px] top-[-6px] w-[15px] h-[15px] bg-transparent"></div>

                    <!-- CODDING: Line Vertical -->
                    <div class="absolute left-[100%] top-0 w-[3px] h-[${distanciaHorizontal < 0 ? offsetBottomButton - (32 + ((item.buttonIndex - 5) * 32)) : offsetBottomButton+(32+(item.buttonIndex*32))}px] bg-blue-900">
                        
                        <div class="w-full h-full relative">
                            
                                <!-- CODDING: Line horizontal -->
                                <div class="w-full h-full relative">
                                    <div class="absolute top-[100%] ${direcao}-[0] w-[${Math.abs(distanciaHorizontal)}px] h-[3px] bg-purple">
                                    
                                        <!-- CODDING: Line vertical -->
                                        <div class="w-full h-full relative">
                                            <div class="absolute ${direcao}-[100%] top-0 w-[3px] h-[${distanciaVertical}px] bg-purple">
                                                <!-- CODDING: Circle -->
                                                <div class="w-full h-full relative">
                                                    <!--<div class="absolute bottom-[-7px] left-[-6px] w-[15px] h-[15px] rounded-full bg-purple"></div>-->
                                                    <div class="absolute bottom-[-7px] left-[-9px] w-0 h-0 
                                                        border-purple
                                                        border-l-[10px] border-l-transparent
                                                        border-t-[10px] 
                                                        border-r-[10px] border-r-transparent
                                                        border-b-transparent">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        
                        </div>
                    </div>

                
                </div>`;
                fatherElement.appendChild(lineFather);
            }

            if(type === "children"){
                
                const distanciaHorizontal = (fatherElement.offsetLeft+(fatherElement.offsetWidth/2))-(childrenElement.offsetLeft+(childrenElement.offsetWidth/2));
                let direcao = `right`; // <------
                if(distanciaHorizontal<0){
                    direcao = `left`; // ------->
                }
                const distanciaVertical = (childrenElement.offsetTop-(fatherElement.offsetTop+fatherElement.offsetHeight))-32;
            
                const lineFather = document.createElement('div');
                lineFather.className = `absolute top-[100%] left-[50%] h-[32px] w-[3px] bg-purple z-10`;
                lineFather.innerHTML = `<div class="w-full h-full relative">
                    <!-- CODDING: Quadrado -->
                    <div class="absolute top-[-7px] left-[-6px] w-[15px] h-[15px] bg-transparent"></div>

                    <!-- CODDING: Line horizontal -->
                    <div class="absolute top-[100%] ${direcao}-0 h-[3px] w-[${Math.abs(distanciaHorizontal)}px] bg-purple">
                        <div class="w-full h-full relative">
                            <!-- CODDING: Line vertical -->
                            <div class="absolute ${direcao}-[100%] top-0 w-[3px] h-[${distanciaVertical}px] bg-purple">
                                <div class="w-full h-full relative">
                                    <div class="absolute bottom-[-7px] left-[-9px] w-0 h-0 
                                        border-purple
                                        border-l-[10px] border-l-transparent
                                        border-t-[10px] 
                                        border-r-[10px] border-r-transparent
                                        border-b-transparent">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
                fatherElement.appendChild(lineFather);

            }
            return

        }
    

        for(const [index, sublista] of lista.entries()){
            console.log(`${index}. lista sendo buildada:`, sublista);
            const section = document.createElement('div');
            section.id = `section-${index+1}`;
            section.className = `flex flex-row justify-center items-end space-x-[64px]`;
            this.fluxogramaElement.appendChild(section);
            
            if(index === 0){
                for(const [idx,item] of sublista.entries()){
                    if(idx === 0){ // buildar trigger
                        if(this.fluxograma.chatbot.trigger.type.trim() === ""){ // adicionar gatilho vazio
                           
                            section.appendChild(item.elementHTML);
                            
                        }else{
                            // adicionar gatilho especifico
                        }
                    }else{ // buildar children
                        // CODDING: Adicionar espaçamento
                        const hasChildren = item.children.length > 0;
                        const hasButtons = item.buttons.length > 0;
                        let quantidadeTotal = 0;
                        if(hasChildren){
                            quantidadeTotal += item.children.length;
                        }
                        if(hasButtons){
                            quantidadeTotal += item.buttons.length;
                        }

                        if(quantidadeTotal>0){
                            section.classList.add(`mb-[${quantidadeTotal*24}px]`);
                        }


                        section.appendChild(item.elementHTML);
                        
                        // CODDING: Eventos
                        item.elementClass.addEvents();

                        // CODDING: Adicionar linha entre trigger e children
                        const fatherElement = document.getElementById('trigger');
                        const childrenElement = document.getElementById('children-0');
                        
                        setTimeout(()=>{
                            addLine({item,fatherElement, childrenElement, type: "trigger"});
                        },2000);
                        

                       
                    }

                    
                }
            }else{

                // adicionar espaçamento vertical
                section.style.marginBottom = `${sublista.length*32}px`;

                // pegar detalhes
                let quantidadeDeCardsComBotoes = 0;
                let contagemIndexCardComBotao = 0;
                sublista.forEach(item=>{
                    if(item.hasOwnProperty('buttons') && item.buttons.length>0){
                        quantidadeDeCardsComBotoes+=1;
                    }
                });
                
                

                for(const [idx,item] of sublista.entries()){
                    
                    //console.log(`index percorrido:`, idx);

                    // Adicionar espaçamento horizontal
                    const espacamentoHorizontal = 80;
                    const espacamentoVertical = 80;
                    const hasChildren = item.children.length > 0;
                    const hasButtons = item.buttons.length > 0;
                   
                    if(hasButtons){
                        contagemIndexCardComBotao+=1;

                        if(hasChildren){
                            item.elementHTML.style.marginRight = `${(item.buttons.length+item.children.length)*espacamentoHorizontal}px`;
                        }else{
                            item.elementHTML.style.marginRight = `${item.buttons.length*espacamentoHorizontal}px`;
                        }
                    }
                    
                    section.appendChild(item.elementHTML);

                    // CODDING: Eventos
                    item.elementClass.addEvents();
                    
                    // criar linha 
                    const fatherElement = item.parentButtonId ? document.getElementById(item.parentButtonId) : document.getElementById(item.parentId);
                    const childrenElement = document.getElementById(item.id);
                    
                    item.indexNaLista = idx;
                    item.tamanhoDaLista = sublista.length;
                    item.quantidadeDeCardsComBotoesNaLista = quantidadeDeCardsComBotoes;
                    item.indexDoCardComBotao = contagemIndexCardComBotao;

                    setTimeout(()=>{
                        addLine({item,fatherElement, childrenElement, type:item.parentButtonId? "button":"children"});
                    },2000);
                    
                    
                }
            }

             
        }

      
        return
       

        
        // CODDING: Limpar comnteúdo do fluxograma
        this.fluxogramaElement.innerHTML = '';
    
        // CODDING: Criar 1° sessão
        const sessao01Element = document.createElement('div');
        sessao01Element.className = `flex flex-row justify-center items-center space-x-[64px]`;
        
        // CODDING: Adicionar 1° sessão no fluxograma
        this.fluxogramaElement.appendChild(sessao01Element);
        
        if(this.fluxograma.chatbot.trigger.type.trim() === ""){ // adicionar gatilho vazio
            
            sessao01Element.appendChild(this.triggerElement.triggerElement);
            
        }else{
            // adicionar gatilho especifico
        }

        return

        let sessaoAtual = sessao01Element;

        
    
    
    }
    

    buildAntigo(){
        
        // CODDING: Adicionar IDS nos botões de forma recursiva
        let numberButton = 0;
        let numberChildren = 0;
        let childrenIdList = [];
        function assignIds(children){
                delete children.id;
                if(!children.id){
                    children.id = `children-${numberChildren.toString().padStart(2,"0")}`;
                    numberChildren+=1;
                }

                if(children.type === "message"){
                    if (children.buttons && children.buttons.length > 0) {
                        children.buttons.forEach(button => {
                            delete button.id;
                            button.id = `button-${numberButton.toString().padStart(2,"0")}`;
                            button.parentId = children.id;
                            numberButton+=1;
                            if (button.children && button.children.length > 0) {
                                button.children[0].parentId = children.id;
                                button.children[0].parentButtonId = button.id;
                                assignIds(button.children[0]);
                            }
                        });
                    }
                }

                if(children.children && children.children.length > 0){
                    
                    children.children[0].parentId = children.id;
                    assignIds(children.children[0]);
                    
                }
        }
        assignIds(this.fluxograma.chatbot.children[0]);
        
        // CODDING: Criar lista para buildar fluxograma
        const lista = [];
        
        // CODDING: 1° item da lista, gatilho e primeiro item da lista
        this.fluxograma.chatbot.trigger['elementHTML'] = this.triggerElement.triggerElement;
        this.fluxograma.chatbot.trigger['elementHTML'].id = 'trigger';
        this.fluxograma.chatbot.trigger['id'] = 'trigger';
        const item01 = [this.fluxograma.chatbot.trigger];
        
        // criar elementos HTML
        if(this.fluxograma.chatbot.children.length > 0){ 
            this.fluxograma.chatbot.children[0]['elementClass'] = new ChildrenElement({child: this.fluxograma.chatbot.children[0], fluxogramaInstance: this});
            this.fluxograma.chatbot.children[0]["elementHTML"] = this.fluxograma.chatbot.children[0]['elementClass'].element;
            this.fluxograma.chatbot.children[0]["elementHTML"].id = this.fluxograma.chatbot.children[0].id;
            item01.push(this.fluxograma.chatbot.children[0]);
            lista.push(item01);
            

            // CODDING: 2° item da lista
            const item02 = [];
            const hasButtons = (this.fluxograma.chatbot.children[0].buttons && this.fluxograma.chatbot.children[0].buttons.length>0)?true:false;
            const hasChildren = (this.fluxograma.chatbot.children[0].children && this.fluxograma.chatbot.children[0].children.length>0)?true:false;
            if(hasChildren){
                this.fluxograma.chatbot.children[0].children[0]['elementClass'] = new ChildrenElement({child: this.fluxograma.chatbot.children[0].children[0], fluxogramaInstance: this});
                this.fluxograma.chatbot.children[0].children[0]['elementHTML'] = this.fluxograma.chatbot.children[0].children[0]['elementClass'].element;
                this.fluxograma.chatbot.children[0].children[0]['elementHTML'].id = this.fluxograma.chatbot.children[0].children[0].id;
                item02.push(this.fluxograma.chatbot.children[0].children[0]);
            }
            if(hasButtons){
                this.fluxograma.chatbot.children[0].buttons.slice().reverse().forEach((button,index)=>{
                    if(button.children.length>0){
                        button.children[0]['elementClass'] = new ChildrenElement({child:button.children[0], fluxogramaInstance: this});
                        button.children[0]['elementHTML'] = button.children[0]['elementClass'].element;
                        button.children[0]['elementHTML'].id = button.children[0].id;
                        button.children[0]['buttonIndex'] = index+1;
                        item02.push(button.children[0]);
                    }
                });
            }
            
            
           

            if(item02.length>0){
                lista.push(item02);
               
                
                while(true){
                    const ultimoItemDaLista = lista[lista.length-1];
                    const newItemList = [];
                    for(const item of ultimoItemDaLista){
                        
                        const hasChildrens = item.children.length>0;
                        const hasButtons = item.buttons.length>0;
                        if(hasChildrens){
                            item.children[0]['elementClass'] = new ChildrenElement({child: item.children[0], fluxogramaInstance: this});
                            item.children[0]['elementHTML'] = item.children[0]['elementClass'].element;
                            item.children[0]['elementHTML'].id = item.children[0].id;
                            newItemList.push(item.children[0]);
                        }
                        if(hasButtons){
                            item.buttons.slice().reverse().forEach((button, index)=>{
                                if(button.children.length>0){
                                    button.children[0]['elementClass'] = new ChildrenElement({child: button.children[0], fluxogramaInstance: this});
                                    button.children[0]['elementHTML'] = button.children[0]['elementClass'].element;
                                    button.children[0]['elementHTML'].id = button.children[0].id;
                                    button.children[0]['buttonIndex'] = index+1;
                                    newItemList.push(button.children[0]);

                                    //console.log(`${index}. `,button);
                                }
                            });
                        }                        
                    }
                    if(newItemList.length>0){
                        lista.push(newItemList);
                    }else{
                        break;
                    }
                }
            }


        }
        
        console.log('LISTA SEPARADA COM OS ITEMS DO FLUXOGRAMA:',lista);
        console.log('FLUXOGRAMA:', this.fluxograma);
         
        function addLine({item,fatherElement, childrenElement, type}){
            /* item --> {
                type: "message",
                content: "",
                id: "children-1",
                parentId: "children-0",
                parentButtonId: "button-0",


                item.indexNaLista = idx;
                item.tamanhoDaLista = sublista.length;
                item.quantidadeDeCardsComBotoesNaLista = quantidadeDeCardsComBotoes;
                item.indexDoCardComBotao = contagemIndexCardComBotao;
            } */
            fatherElement.classList.add('relative');
            childrenElement.classList.add('relative');

            //console.log(`function addLine, index: ${item.index}, listLenght: ${item.lenghtList} -->`,item);

            if(type === "trigger"){
                const distanciaHorizontal = childrenElement.offsetLeft-(fatherElement.offsetLeft+fatherElement.offsetWidth);
                
                const lineFather = document.createElement('div');
                lineFather.className = `absolute top-[50%] left-[100%] w-[${distanciaHorizontal}px] h-[3px] bg-purple z-10`;
                lineFather.innerHTML = `<div class="w-full h-full relative">
                    <!-- CODDING: Quadrado -->
                    <div class="absolute left-[-7px] top-[-6px] w-[15px] h-[15px] bg-purple"></div>

                    <!-- CODDING: Triangulo -->
                    <div class="absolute bottom-[-9px] right-[-9px] w-0 h-0 
                        border-purple
                        border-t-[10px] border-t-transparent
                        border-l-[10px] 
                        border-b-[10px] border-b-transparent
                        border-r-transparent">
                    </div>
                </div>`;
                fatherElement.appendChild(lineFather);
            }

            if(type==="button"){
                
                const valorDaMultiplicacao = item.quantidadeDeCardsComBotoesNaLista-(item.indexDoCardComBotao-1)
                const offsetRightButton = Math.abs(fatherElement.offsetParent.offsetWidth - (fatherElement.offsetLeft + fatherElement.offsetWidth));
                const offsetBottomButton =  Math.abs(fatherElement.offsetParent.offsetHeight - (fatherElement.offsetTop+(fatherElement.offsetHeight/2)));
                
                const distanciaHorizontal = (fatherElement.offsetParent.offsetLeft+fatherElement.offsetLeft+fatherElement.offsetWidth)+(offsetRightButton+(64+(item.buttonIndex*32))) - (childrenElement.offsetLeft+(childrenElement.offsetWidth/2));

                
                let direcao = "right"
                if(distanciaHorizontal<0){
                    //console.log(`item com a distancia horiontal menor que 0(${distanciaHorizontal}):`, item);
                    direcao = "left";
                }

                const espacamento = distanciaHorizontal < 0 ? offsetBottomButton - (32 + ((item.buttonIndex - 5) * 32)) : offsetBottomButton+(32+(item.buttonIndex*32));
                const distanciaVertical = Math.abs(((fatherElement.offsetHeight/2)+fatherElement.offsetTop+fatherElement.offsetParent.offsetTop)-childrenElement.offsetTop)- espacamento;
                

                const lineFather = document.createElement('div');
                lineFather.className = `absolute top-[50%] left-[100%] w-[${offsetRightButton+(64+(item.buttonIndex*32))}px] h-[3px] bg-purple z-10`;
                lineFather.innerHTML = `<div class="w-full h-full relative">
                    <!-- quadrado -->
                    <div class="absolute left-[-7px] top-[-6px] w-[15px] h-[15px] bg-transparent"></div>

                    <!-- CODDING: Line Vertical -->
                    <div class="absolute left-[100%] top-0 w-[3px] h-[${distanciaHorizontal < 0 ? offsetBottomButton - (32 + ((item.buttonIndex - 5) * 32)) : offsetBottomButton+(32+(item.buttonIndex*32))}px] bg-blue-900">
                        
                        <div class="w-full h-full relative">
                            
                                <!-- CODDING: Line horizontal -->
                                <div class="w-full h-full relative">
                                    <div class="absolute top-[100%] ${direcao}-[0] w-[${Math.abs(distanciaHorizontal)}px] h-[3px] bg-purple">
                                    
                                        <!-- CODDING: Line vertical -->
                                        <div class="w-full h-full relative">
                                            <div class="absolute ${direcao}-[100%] top-0 w-[3px] h-[${distanciaVertical}px] bg-purple">
                                                <!-- CODDING: Circle -->
                                                <div class="w-full h-full relative">
                                                    <!--<div class="absolute bottom-[-7px] left-[-6px] w-[15px] h-[15px] rounded-full bg-purple"></div>-->
                                                    <div class="absolute bottom-[-7px] left-[-9px] w-0 h-0 
                                                        border-purple
                                                        border-l-[10px] border-l-transparent
                                                        border-t-[10px] 
                                                        border-r-[10px] border-r-transparent
                                                        border-b-transparent">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        
                        </div>
                    </div>

                
                </div>`;
                fatherElement.appendChild(lineFather);
            }

            if(type === "children"){
                
                const distanciaHorizontal = (fatherElement.offsetLeft+(fatherElement.offsetWidth/2))-(childrenElement.offsetLeft+(childrenElement.offsetWidth/2));
                let direcao = `right`; // <------
                if(distanciaHorizontal<0){
                    direcao = `left`; // ------->
                }
                const distanciaVertical = (childrenElement.offsetTop-(fatherElement.offsetTop+fatherElement.offsetHeight))-32;
            
                const lineFather = document.createElement('div');
                lineFather.className = `absolute top-[100%] left-[50%] h-[32px] w-[3px] bg-purple z-10`;
                lineFather.innerHTML = `<div class="w-full h-full relative">
                    <!-- CODDING: Quadrado -->
                    <div class="absolute top-[-7px] left-[-6px] w-[15px] h-[15px] bg-transparent"></div>

                    <!-- CODDING: Line horizontal -->
                    <div class="absolute top-[100%] ${direcao}-0 h-[3px] w-[${Math.abs(distanciaHorizontal)}px] bg-purple">
                        <div class="w-full h-full relative">
                            <!-- CODDING: Line vertical -->
                            <div class="absolute ${direcao}-[100%] top-0 w-[3px] h-[${distanciaVertical}px] bg-purple">
                                <div class="w-full h-full relative">
                                    <div class="absolute bottom-[-7px] left-[-9px] w-0 h-0 
                                        border-purple
                                        border-l-[10px] border-l-transparent
                                        border-t-[10px] 
                                        border-r-[10px] border-r-transparent
                                        border-b-transparent">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
                fatherElement.appendChild(lineFather);

            }
            return

        }
    

        for(const [index, sublista] of lista.entries()){
            console.log(`${index}. lista sendo buildada:`, sublista);
            const section = document.createElement('div');
            section.id = `section-${index+1}`;
            section.className = `flex flex-row justify-center items-end space-x-[64px]`;
            this.fluxogramaElement.appendChild(section);
            
            if(index === 0){
                for(const [idx,item] of sublista.entries()){
                    if(idx === 0){ // buildar trigger
                        if(this.fluxograma.chatbot.trigger.type.trim() === ""){ // adicionar gatilho vazio
                           
                            section.appendChild(item.elementHTML);
                            
                        }else{
                            // adicionar gatilho especifico
                        }
                    }else{ // buildar children
                        // CODDING: Adicionar espaçamento
                        const hasChildren = item.children.length > 0;
                        const hasButtons = item.buttons.length > 0;
                        let quantidadeTotal = 0;
                        if(hasChildren){
                            quantidadeTotal += item.children.length;
                        }
                        if(hasButtons){
                            quantidadeTotal += item.buttons.length;
                        }

                        if(quantidadeTotal>0){
                            section.classList.add(`mb-[${quantidadeTotal*24}px]`);
                        }


                        section.appendChild(item.elementHTML);
                        
                        // CODDING: Eventos
                        item.elementClass.addEvents();

                        // CODDING: Adicionar linha entre trigger e children
                        const fatherElement = document.getElementById('trigger');
                        const childrenElement = document.getElementById('children-0');
                        
                        setTimeout(()=>{
                            addLine({item,fatherElement, childrenElement, type: "trigger"});
                        },2000);
                        

                       
                    }

                    
                }
            }else{

                // adicionar espaçamento vertical
                section.style.marginBottom = `${sublista.length*32}px`;

                // pegar detalhes
                let quantidadeDeCardsComBotoes = 0;
                let contagemIndexCardComBotao = 0;
                sublista.forEach(item=>{
                    if(item.hasOwnProperty('buttons') && item.buttons.length>0){
                        quantidadeDeCardsComBotoes+=1;
                    }
                });
                
                

                for(const [idx,item] of sublista.entries()){
                    
                    //console.log(`index percorrido:`, idx);

                    // Adicionar espaçamento horizontal
                    const espacamentoHorizontal = 80;
                    const espacamentoVertical = 80;
                    const hasChildren = item.children.length > 0;
                    const hasButtons = item.buttons.length > 0;
                   
                    if(hasButtons){
                        contagemIndexCardComBotao+=1;

                        if(hasChildren){
                            item.elementHTML.style.marginRight = `${(item.buttons.length+item.children.length)*espacamentoHorizontal}px`;
                        }else{
                            item.elementHTML.style.marginRight = `${item.buttons.length*espacamentoHorizontal}px`;
                        }
                    }
                    
                    section.appendChild(item.elementHTML);

                    // CODDING: Eventos
                    item.elementClass.addEvents();
                    
                    // criar linha 
                    const fatherElement = item.parentButtonId ? document.getElementById(item.parentButtonId) : document.getElementById(item.parentId);
                    const childrenElement = document.getElementById(item.id);
                    
                    item.indexNaLista = idx;
                    item.tamanhoDaLista = sublista.length;
                    item.quantidadeDeCardsComBotoesNaLista = quantidadeDeCardsComBotoes;
                    item.indexDoCardComBotao = contagemIndexCardComBotao;

                    setTimeout(()=>{
                        addLine({item,fatherElement, childrenElement, type:item.parentButtonId? "button":"children"});
                    },2000);
                    
                    
                }
            }

             
        }

      
        return
       

        
        // CODDING: Limpar comnteúdo do fluxograma
        this.fluxogramaElement.innerHTML = '';
    
        // CODDING: Criar 1° sessão
        const sessao01Element = document.createElement('div');
        sessao01Element.className = `flex flex-row justify-center items-center space-x-[64px]`;
        
        // CODDING: Adicionar 1° sessão no fluxograma
        this.fluxogramaElement.appendChild(sessao01Element);
        
        if(this.fluxograma.chatbot.trigger.type.trim() === ""){ // adicionar gatilho vazio
            
            sessao01Element.appendChild(this.triggerElement.triggerElement);
            
        }else{
            // adicionar gatilho especifico
        }

        return

        let sessaoAtual = sessao01Element;

        
    
    
    }
}

class TriggerElement{
    constructor({fluxogramaInstance}){
        this.fluxogramaInstance = fluxogramaInstance;

        // trigger
        this.chatbot = this.fluxogramaInstance.chatbot;
        this.flowchart = this.fluxogramaInstance.chatbot.flowchart;
        this.trigger = this.fluxogramaInstance.chatbot.flowchart.trigger;

        this.element = this.createElement();
        if(this.trigger.postId && this.trigger.postId.length){
            this.showPost();
        }


        this.addEvents();
    }

    async showPost(){
        
        // mostrar post carregando
        const postLoadingElement = this.element.querySelector('#post-loading');
        postLoadingElement.classList.remove('hidden');
        
       
        const {status, response} = await this.fluxogramaInstance.chatbotApi.getPostWithId({chatbot: this.fluxogramaInstance.chatbot, postId: this.trigger.postId});
      

        if(status){
            const post = response.post;
            // post.created_time
            // post.full_picture
            // post.id
            // post.message

            // mostrar post carregado
            const postElement = this.element.querySelector('#post');

            // logo
            const logo = postElement.querySelector('#logo');
            logo.src = this.chatbot.page.page.photo;

            // title
            const title = postElement.querySelector('#title');
            title.innerHTML = this.chatbot.page.page.name.length > 20 ? this.chatbot.page.page.name.slice(0,20)+"..." : this.chatbot.page.page.name;

            // subtitulo
            const subtitle = postElement.querySelector('#subtitle');
            const createdTime = new Date(post.created_time);
            const horarioFormatado = `${createdTime.getDate().toString().padStart(2,"0")}/${createdTime.getMonth().toString().padStart(2,"0")}/${createdTime.getFullYear()} ${createdTime.getHours().toString().padStart(2,"0")}:${createdTime.getMinutes().toString().padStart(2,"0")}:${createdTime.getSeconds().toString().padStart(2,"0")}`;
            subtitle.innerHTML = horarioFormatado;


            // conteudo
            const content = postElement.querySelector('#content');
            content.innerHTML = post.message;

            // imagem
            const picture = postElement.querySelector('#picture');
            picture.src = post.full_picture;

            // link
            const link = postElement.querySelector('#link');
            link.href = `https://facebook.com/${post.id}`;

            postLoadingElement.classList.add('hidden');
            postElement.classList.remove('hidden');

        }
        

    }

    addEvents(){
        this.buttonEditarTrigger(); 
        this.buttonAddChildren();
    }

    createElement(){
        const element = document.createElement('div');
        element.className = `min-w-[300px] max-w-[300px] relative rounded-[10px] bg-white shadow-[0_8px_24px_rgba(149,157,165,0.2)] flex flex-col justify-between items-center`;
        element.id = `gatilho-fluxograma`;

        // CODDING: Palavras chaves
        let keywordsElement = '';
        if(this.trigger.type && this.trigger.keyword){
            // const keywordListElement = flowchart.trigger.keyword.split(',').map(keyword=>`<div class="px-[16px] py-[8px] rounded-full bg-gradient-to-r from-[#04A8A2] to-[#61D68E] shadow-[0_3px_8px_rgba(0,0,0,0.24)]"> <p class="text-sm text-white">${keyword.trim()}</p> </div>`)
            const keywordListElement = this.trigger.keyword.split(',').map(keyword=>`<div class="px-[16px] py-[8px] rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.24)]"> <p class="text-sm text-[#404040]">${keyword.trim()}</p> </div>`)
            keywordsElement = `
            <!-- CODDING: Palavras chaves-->
            <div class="flex flex-col items-start justify-center space-y-[10px] mt-[16px]">
              <p class="text-base/none text-[#404040]">e ${this.trigger.type === "comment" ? `o comentário` : `a mensagem`} <span class="font-bold">contém</span> alguma destas palavras-chave:</p>
              <div class="flex flex-row flex-wrap justify-start items-center space-x-[5px] space-y-[5px]">
                ${keywordListElement.join('')}
              </div>
            </div>`;
        }

        // CODDING: Palavras chaves negativas
        let negativeKeywordsElement = ``;
        if(this.trigger.type && this.trigger.negativeKeyword){
            // const negativeKeywordListElement = flowchart.trigger.negativeKeyword.split(',').map(keyword=>`<div class="px-[16px] py-[8px] rounded-full bg-[#F65656] shadow-[0_3px_8px_rgba(0,0,0,0.24)]"><p class="text-sm text-white">${keyword.trim()}</p></div>`);
            const negativeKeywordListElement = this.trigger.negativeKeyword.split(',').map(keyword=>`<div class="px-[16px] py-[8px] rounded-full bg-white shadow-[0_3px_8px_rgba(0,0,0,0.24)]"><p class="text-sm text-[#404040]">${keyword.trim()}</p></div>`);
            negativeKeywordsElement = `
            <!-- CODDING: Palavras chaves negativas -->
            <div class="flex flex-col items-start justify-center space-y-[10px] mt-[32px]">
              <p class="text-base/none text-[#404040]"> e ${this.trigger.type === "comment" ? `o comentário` : `a mensagem`} <span class="font-bold">não contém</span> nenhuma destas palavras-chave:</p>
              <div class="flex flex-row flex-wrap justify-start items-center space-x-[5px] space-y-[5px]">
                ${negativeKeywordListElement.join('')}
              </div>
            </div>`;
        }

        element.innerHTML = `<!-- CODDING: Content -->
        <div class="flex flex-col justify-start space-y-[32px] w-full">
          
          <!-- CODDING:  Titulo do gatilho -->
          <div class="flex justify-start items-center space-x-[10px] px-[16px] pt-[16px] text-[#404040] w-full">
            <i class="fa-solid fa-bolt text-xl min-h-[40px] min-w-[40px] rounded-[10px] bg-purple text-white flex justify-center items-center"></i>
            <div class="flex flex-col justify-center items-start">
              <p class="text-base/none">Quando...</p>
            </div>
          </div>

          <!-- CODDING: Sobre -->
          <div class="${!this.trigger.type ? "":"hidden"} px-[16px] space-y-[16px] text-sm text-[#404040]">  
              <p class="text-base">O <span class="font-bold">gatilho</span> é responsável por acionar a <span class="font-bold">automação</span> </p>
              <p class="text-base">clique em <span class="font-bold">"Adicionar Gatilho"</span></p>
            
          </div>

          <!-- CODDING: Gatilho escolhido -->
          <div class=" px-[16px] space-y-[10px]">
            <!-- CODDING: comment -->
            <div class="w-full flex flex-row justify-start items-center rounded-[10px] space-x-[10px] bg-[#EEF1F4] py-[16px] px-[16px] border border-gray-400 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
              <i class="fa-brands fa-facebook-messenger text-white text-base min-w-[30px] min-h-[30px] bg-[#08A4F6] flex justify-center items-center rounded-full"></i>
              <div class="flex flex-col items-start justify-center">
                <!-- CODDING: Texto -->
                <p class="text-base/none text-[#404040]">${this.trigger.type === "message" ? `O usuário envia uma <span class="font-bold">mensagem</span> na sua página`: this.trigger.type === "comment" ? `O usuário deixa um <span class="font-bold">comentário</span> ${this.trigger.postId ? "na sua publicação:":"em alguma publicação"}`:""}</p>
                
                <!-- CODDING: Publicação carregando -->
                <div id="post-loading" class="hidden border-gray-200 w-full hover:border-[#752A7A] my-[16px] bg-white shadow-[0_3px_8px_rgba(0,0,0,0.24)] rounded-[10px] shadow py-[16px] px-[16px] flex flex-col items-start justify-start space-y-[5px]">
                    <!-- CODDING: Logo mais nome da pagina -->
                    <div class="flex flex-row justify-start items-center space-x-[5px]">
                        <div class="min-w-[30px] max-w-[30px] min-h-[30px] max-h-[30px] rounded-full bg-gray-200 animate-pulse"></div>
                        <div class="flex flex-col items-start justify-center space-y-[3px]">
                            <p class="min-h-[12px] min-w-[120px] rounded-full bg-gray-200 animate-pulse"></p>
                            <p class="min-h-[12px] min-w-[60px] rounded-full bg-gray-200 animate-pulse"></p>
                        </div>
                    </div>
                    
                    <!-- CODDING: Titulo da postagem -->
                    <div class="py-[5px] w-full flex flex-col justify-center items-start space-y-[3px]">
                        <p class="w-full min-h-[12px] rounded-full bg-gray-200 animate-pulse"></p>
                        <p class="w-[50%] min-h-[12px] rounded-full bg-gray-200 animate-pulse"></p>
                    
                    </div>
                    
                    <!-- CODDING: Imagem da postagem -->
                    <img class="w-full min-h-[80px] w-full rounded bg-gray-200 animate-pulse" src="" alt="">

                    <!-- CODDING: ver no facebook -->
                    <div class="w-full flex flex-row justify-end items-center">
                        <div class="w-[60%] h-[12px] rounded-full bg-gray-200 animate-pulse"></div>
                    </div>
                  </div>

                <!-- CODDING: Publicação -->
                <div id="post" class="hidden border-gray-200 w-full hover:border-[#752A7A] my-[16px] bg-white shadow-[0_3px_8px_rgba(0,0,0,0.24)] rounded-[10px] shadow py-[16px] px-[16px] flex flex-col items-start justify-start space-y-[5px]">
                    <!-- CODDING: Logo mais nome da pagina -->
                    <div class="flex flex-row justify-start items-center space-x-[5px]">
                        <div class="relative">
                            <!-- CODDING: Logo da página -->
                            <img id="logo" class="min-w-[30px] max-w-[30px] min-h-[30px] max-h-[30px] rounded-full bg-purple" src="https://scontent.fcau2-1.fna.fbcdn.net/v/t39.30808-1/429776193_377336775084635_459692734501322956_n.jpg?stp=c156.156.588.588a_dst-jpg_s200x200&_nc_cat=1&ccb=1-7&_nc_sid=5f2048&_nc_ohc=HNLqNm8Tw2AAb6zrIoZ&_nc_ht=scontent.fcau2-1.fna&oh=00_AfBoe_EjQbgXUuEdUg6pSFM2qG5c14ptJadoaGzqPm8MXw&oe=6626262A" alt="">

                            <!-- CODDING: Logo do facebook -->
                            <img src="https://www.facebook.com/images/fb_icon_325x325.png" class="absolute bottom-[-4px] right-0 min-h-[15px] max-h-[15px] min-w-[15px] max-w-[15px] rounded-full rounded-full">
                            
                        </div>
                        <div class="flex flex-col items-start justify-center">
                            <p id="title" class="text-xs/none font-bold">Receitas Favoritas d...</p>
                            <p id="subtitle" class="text-xs text-[#cccccc]">17/04/2024 19:00:00</p>
                        </div>
                    </div>
                
                    <!-- CODDING: Titulo da postagem -->
                    <p id="content" class="py-[5px] text-xs text-[#404040]">Se prepare para ter muita fartura na sua vida!🙌❤️🌳🌵🌾👏</p>

                    <!-- CODDING: Imagem da postagem -->
                    <img id="picture" class="w-full h-[80px] rounded shadow-[1.95px_1.95px_2.6px_rgba(0,0,0,0.15)]" src="https://scontent.fcau2-1.fna.fbcdn.net/v/t39.30808-6/436238364_122136991502123683_3239338428063828033_n.jpg?stp=dst-jpg_p526x296&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_ohc=hejeNiW0NMAQ7kNvgGdlAYa&_nc_ht=scontent.fcau2-1.fna&oh=00_AfAd-T1qR1rAWx5Ynls9X7WJ9loJuOi3tAar80M2hqyrgA&oe=66413532" alt="">

                    <!-- CODDING: Ver no facebook -->
                    <div class="pt-[10px] w-full flex flex-row justify-end items-center">
                        <a href="" target="_blank" id="link" class="flex flex-row justify-center items-center space-x-[5px] text-xs text-[#404040] hover:text-[#0863F7]">
                            <i class="fa-solid fa-link"></i>
                            <p>Ver no Facebook</p>
                        </a>
                        
                    </div>
                </div>
                
                
                <!-- CODDING: Palavras chaves-->
               ${keywordsElement ? keywordsElement : ''}

                <!-- CODDING: Palavras chaves negativas -->
                ${negativeKeywordsElement?negativeKeywordsElement:''}
                
              </div>
            </div>
          </div>
        </div>

        <!-- CODDING: Botões de Editar e Excluir -->
        <div class="w-full flex flex-row justify-center items-center space-x-[5px] px-[16px] pt-[32px] ${this.flowchart.children.length ? `pb-[32px]`:`pb-[16px]`}">
          <div id="button-editar-trigger" class="cursor-pointer flex-1 h-[40px] bg-purple rounded-[10px] flex flex-row justify-center items-center text-sm text-white space-x-[10px]">
              <i class="fa-solid fa-pen"></i>
              <p>Editar</p>
          </div>
          <div class="cursor-pointer flex-1 h-[40px] bg-purple rounded-[10px] flex flex-row justify-center items-center text-sm text-white space-x-[10px]">
              <i class="fa-solid fa-trash"></i>
              <p>Deletar</p>
          </div>
        </div>

        <!-- CODDING: Botão de adicionar -->
        <button id="button-add-children" class="${this.flowchart.children.length ? "hidden" : ""} w-full py-[8px] bg-purple text-white rounded-bl-[10px] rounded-br-[10px] space-x-1 ">
            <div id="button-content" class=" flex flex-row justify-center items-center space-x-[5px]">
                <i class="fa-solid fa-plus"></i>
                <span>Adicionar</span>
            </div>

            <!-- CODDING: Loading -->
            <svg id="button-loading"  aria-hidden="true" class="hidden inline w-6 h-6 text-transparent animate-spin fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
         
        </button>`;

        return element;
    }

    buttonAddChildren(){
        const button = this.element.querySelector("#button-add-children");
        button.addEventListener('click', async ()=>{
            // esconder conteudo do botão
            const buttonContentElement = this.element.querySelector('#button-content');
            buttonContentElement.classList.add('hidden');

            // mostrar botão carregando
            const buttonLoadingElement = this.element.querySelector('#button-loading');
            buttonLoadingElement.classList.remove('hidden')

            // fazer requisição
            const {status, response, error} = await this.fluxogramaInstance.chatbotApi.addFirstChildren({chatbotId: this.fluxogramaInstance.chatbot._id, children:[{type: "message", content: "mensagem vazia"}]})
            console.log('status:',status);
            console.log('response:',response);
            console.log('error:',error);
            if(status){
                // rebuildar 
                this.fluxogramaInstance.chatbot = response.chatbot;
                this.fluxogramaInstance.build();
            }

            
        });
    }

    buttonEditarTrigger(){
        const button = this.element.querySelector('#button-editar-trigger');
        button.addEventListener('click',()=>{
            const popupEditarTrigger = new PopupEditarTrigger({fluxogramaInstance: this.fluxogramaInstance, chatbot: this.fluxogramaInstance.chatbot})
            popupEditarTrigger.show();
        });

    }

}

const fluxograma = new Fluxograma();
// fluxograma.build();

// remover popup trigger existente
const popupEditarTriggerElement = document.getElementById('popup-editar-trigger');
if(popupEditarTriggerElement){
    //popupEditarTriggerElement.remove();
}

const popupEditarTrigger = new PopupEditarTrigger({fluxogramaInstance: fluxograma,triggerChanged:{type:"comment", negativeKeyword:"",keyword:"", postId:"172220209310432_122129628746123683"}, chatbot: {_id:"6609af37411a5685622afdea", 
page:{page:{idPage:"172220209310432",name:"Pagina de Teste Plubee",photo:"https://scontent.fcau2-1.fna.fbcdn.net/v/t39.30808-1/406212234_122106008474123683_8295910229202053732_n.png?stp=cp0_dst-png_p50x50&_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_ohc=evxZPEObpqgAb6LG3Le&_nc_ht=scontent.fcau2-1.fna&edm=AJdBtusEAAAA&oh=00_AfBrzW-AV9iZoncEXYTJRLzxX7f4M34rGoVsPQguQ9g6fA&oe=662C74F7"}},
flowchart:{
    trigger:{
        keyword:"eu quero, comprar agora, desconto, cupom", 
        negativeKeyword:"gratis, grátis, pirata",
        postId:"172220209310432_122136991544123683",
        type:"comment"
    }
}}
});
//popupEditarTrigger.show();

// CODDING: Abrir popup de editar post
const popupChoosePost = new PopupChoosePost({fluxogramaInstance: fluxograma, chatbot:{_id:"6609af37411a5685622afdea",page:{page:{idPage:"172220209310432", name:"Pagina de Teste Plubee",photo:"https://scontent.fcau2-1.fna.fbcdn.net/v/t39.30808-1/406212234_122106008474123683_8295910229202053732_n.png?stp=cp0_dst-png_p50x50&_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_ohc=evxZPEObpqgAb6LG3Le&_nc_ht=scontent.fcau2-1.fna&edm=AJdBtusEAAAA&oh=00_AfBrzW-AV9iZoncEXYTJRLzxX7f4M34rGoVsPQguQ9g6fA&oe=662C74F7"}},flowchart:{trigger:{type:"comment",keyword:"",negativeKeyword:"",postId:"..."}}}});
//popupChoosePost.show();

// CODDING: Remover popup de editar post do HTML
const popupEscolherPublicacaoElement = document.getElementById('popup-escolher-publicacao');
if(popupEscolherPublicacaoElement){
    //popupEscolherPublicacaoElement.remove();
}

// CODDING: Adicionar popup de editar post
console.log('valor de element do PopupEditarPost():', popupChoosePost.element);
//popupBackgroundElement.insertAdjacentElement('afterend', popupEditarPost.element);
