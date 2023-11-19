const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scoreOutput = document.querySelector('.score');
const recordeOutput = document.querySelector('.recorde');
const recordeTelaInicial = document.querySelector('.tela-inicial-recorde');
const recordeRecorde = document.querySelector('.recorde-recorde');
const telaInicial = document.querySelector('.tela-container');
const tela = document.querySelector('.tela-inicial');

const iniciarBotao = document.querySelector('.iniciar-btn');


let gameOver = false;
let score = 0;
let recorde = JSON.parse(localStorage.getItem('recorde')) || 0;

recordeRecorde.innerHTML = recorde;

let bloco = 15;
let linhas = 30;
let colunas = 15;

let canvasWidth = linhas*bloco;
let canvasHeight = colunas*bloco;

let personagem = {
    posicaoX : canvasWidth/2,
    largura : bloco,
    altura : bloco * 2,
    pulando : false,
    agachado : false
};

personagem.posicaoY = canvasHeight - personagem.altura;


let obstaculos = [];

let velocidadeY = 0;
let velocidadeX = -3;
let gravidade = .4;

iniciarBotao.addEventListener('click', iniciarJogo)

function iniciarJogo() {
    
    telaInicial.style.display = 'none';
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;    
    atualizar();
    setInterval(adicionarObstaculos, 1000); 
    setInterval(iniciarContagem, 10);  
}



addEventListener('keydown', (e) => {
    if(gameOver) {
        return
    }
    if(!personagem.pulando) {
        if(e.key == 'ArrowUp') {
            velocidadeY = -9;
            personagem.pulando = true;    
        }
        if(e.key == 'ArrowDown' ) {
            personagem.agachado = true;          
        }
    }    
})


addEventListener('keyup', (e) => {
    if(e.key == 'ArrowDown') {
        personagem.agachado = false;
    }
})

function atualizar() {
    requestAnimationFrame(atualizar);

    if(gameOver) {
        return
    }

    //canvas
    ctx.clearRect(0,0, canvas.width, canvas.height);

    ctx.fillStyle = 'black';
    ctx.fillRect(0,0, canvas.width, canvas.height);

    //personagem
    velocidadeY += gravidade;
    personagem.posicaoY += velocidadeY;

    if(personagem.posicaoY > canvasHeight - personagem.altura) {
        personagem.posicaoY = canvasHeight - personagem.altura;
        personagem.pulando = false;
        velocidadeY = 0;
    }



    if(personagem.agachado) {
        personagem.altura = bloco;
        personagem.posicaoY = canvasHeight - personagem.altura;
    } else {
        personagem.altura = bloco*2
    }
    
    ctx.fillStyle = 'white';
    ctx.fillRect(personagem.posicaoX, personagem.posicaoY, personagem.largura, personagem.altura);

    //obstaculos
    obstaculos.forEach((obstaculo) => {
       
        if(score > 3000) {
            velocidadeX = -9;
            console.log('velocidade 4');
        } else if(score > 2000) {
            velocidadeX = -8;
            console.log('velocdidade 3');
        } else if(score > 1500) {
            velocidadeX = -7;
            console.log('velocidade 2');
        } else if(score > 1000) {
            velocidadeX = -6;
            console.log('velocidade 1');
        }
         

        obstaculo.posicaoX += velocidadeX;

        ctx.fillStyle = 'green';
        ctx.fillRect(obstaculo.posicaoX, obstaculo.posicaoY, obstaculo.largura, obstaculo.altura);

        //colisao
        let personagemAcimaObstaculo = personagem.posicaoY + personagem.altura < obstaculo.posicaoY;
        let personagemAbaixoObstaculo = personagem.posicaoY > obstaculo.posicaoY + obstaculo.altura;
        let personagemEsquerdaObstaculo = personagem.posicaoX + personagem.largura < obstaculo.posicaoX;
        let personagemDireitaObstaculo = personagem.posicaoX > obstaculo.posicaoX + obstaculo.largura;

        if (!personagemAcimaObstaculo && !personagemAbaixoObstaculo && !personagemEsquerdaObstaculo && !personagemDireitaObstaculo) {  
            gameOver = true;  
            telaInicial.style.display = 'flex';            
            let elemento = `
            <div class="game-over-recorde">                    
                    Recorde: ${recorde}
                </div>
                <div class="game-over-score">                    
                    Score: ${score}
                </div>
                <div class="game-over">
                FIM DE JOGO!!!
                    <span class="subtexto"> 
                        (clique na tela para recomeçar) 
                    </span>
                </div>
                `
            tela.innerHTML = elemento;            
            const recomecarBotao = document.querySelector('.recomecar-btn');
            //recomecarBotao.addEventListener('click', recomecarJogo, iniciarJogo);
            telaInicial.addEventListener('click', recomecarJogo, iniciarJogo)
    }         
    })   
}

function adicionarObstaculos() {

    if(gameOver) {
        return
    }

    let largura = bloco;
    let altura;
    let posicaoX;
    let posicaoY;
    let numeroAleatorio = Math.random();
    if(numeroAleatorio > .90) {
        altura = bloco*4;
        posicaoX = canvasWidth - largura;
        posicaoY = canvasHeight - altura;
        console.log('obst 4');

    } else if(numeroAleatorio > .70) {
        altura = bloco*3;
        posicaoX = canvasWidth - largura;
        posicaoY = canvasHeight - altura;
        console.log('obst 3');

    } else if(numeroAleatorio > .50) {
        altura = bloco*2;
        posicaoX = canvasWidth - largura;
        posicaoY = canvasHeight - altura;
        console.log('obst 2');

    }  else if(numeroAleatorio > .30) {
        largura = bloco*2;
        altura = bloco/2;
        posicaoX = canvasWidth - largura;
        posicaoY = canvasHeight - bloco*2.5;
        console.log('obst voador');
    } else return

    
    obstaculos.push({
        largura,
        altura,
        posicaoX,
        posicaoY
    })

    if(obstaculos.length > 5) {
        obstaculos.shift();
    };
    
}



function iniciarContagem() {    
    if(gameOver) {
        return
    }
    score ++;    
    scoreOutput.innerHTML = `score: ${score}`;

    atualizarRecorde();
    
}

function atualizarRecorde() {
    if( score > recorde) {
        recorde = score;
    }

    localStorage.setItem('recorde', JSON.stringify(recorde));
    
    recordeOutput.innerHTML = recorde;
}



function recomecarJogo() {
    gameOver = false;
    score = 0;
    obstaculos = [];
    personagem.posicaoY = canvasHeight - personagem.altura;
    velocidadeY = 0;
    telaInicial.style.display = 'none';
    
}


