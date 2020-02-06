const canvas    = document.getElementById("stage");
const ctx       = canvas.getContext("2d");

// Sprites
let background  = new Image();
let money       = new Image();
let money_pot   = new Image();
let hand_up     = new Image();
let hand_down   = new Image();
let boleto      = new Image();
let dedo        = new Image();

background.src  = "sprites/background.png";
money.src       = "sprites/dinheiro.png";
money_pot.src   = "sprites/dinheiro_bolo.png";
hand_up.src     = "sprites/mao_superior.png";
hand_down.src   = "sprites/mao_inferior.png";
boleto.src      = "sprites/boleto.png";
dedo.src        = "sprites/dedo.png";

// Game variables
const speed     = 2.0;              // Velocidade que o dinheiro se move
const width     = canvas.width;     // Largura da tela
const height    = canvas.height;    // Altura da tela
const limit_l   = 20;               // Limite esquerdo da tela para limitar o movimento
const limit_r   = 340;              // Limite direito da tela para limitar o movimento
const cooldown  = 300;              // Tempo (milisegundos) entre jogar uma nota e outra
let score       = 0;                // Placar
let game_over   = false;            // Controle de game over
let hand_x      = 20;               // Posição X da mão
let hand_y      = height - 90;      // Posição Y da mão
let hand_sup_y  = hand_y;           // Posição Y da mão superior
let moneys      = [];               // Array de dinheiros jogados
let can_throw   = true;             // Variável que controla o cooldown do ato de jogar dinheiro


// Detectar inputs
document.addEventListener("keydown", function(e) {
    let key_code = e.which || e.keyCode;

    if (key_code == 37) { // left arrow
        move_left();
    } else if (key_code == 39) { // right arrow
        move_right();
    } else if (key_code == 32) { // space
        throw_money();
    } else if (key_code == 82) { // letter R
        reset_game();
    }
});

function move_left() {
    if (hand_x > limit_l) {
        hand_x -= 64;
    }
}

function move_right() {
    if (hand_x < limit_r) {
        hand_x += 64;
    }
}

function throw_money() {
    if (can_throw) {
        moneys.push({"x": hand_x + 20, "y": hand_y});
        anima_mao_up();
        setTimeout(() => {
            anima_mao_down();
        }, cooldown);
    }
}

function anima_mao_up() {
    can_throw = false;
    hand_sup_y -= 30;
}

function anima_mao_down() {
    can_throw = true;
    hand_sup_y = hand_y;
}

function gameOver() {
    game_over = true;
    document.getElementById("pontuacao").innerText = score;
    document.getElementById("game-over").style = "display : inline";
}

function draw() {
    // Limpar o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar fundo
    // ctx.drawImage(background, 0, 0);

    // Desenhar mão inferior
    ctx.drawImage(hand_down, hand_x, hand_y);

    // Desenhar bolo de grana
    ctx.drawImage(money_pot, hand_x + 20, hand_y + 8);

    // Desenhar os dinheiros jogados
    for (let i = 0; i < moneys.length; i++) {
        const t_money = moneys[i];
        ctx.drawImage(money, t_money.x, t_money.y);
        t_money.y -= 5
    }

    // Desenhar o dedo
    ctx.drawImage(dedo, hand_x + 51, hand_y + 30);

    // Desenhar a mão superior
    ctx.drawImage(hand_up, hand_x - 20, hand_sup_y);

    requestAnimationFrame(draw);
}

window.onload = function() {
    draw();
}
