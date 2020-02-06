
const stage     = document.getElementById("stage");
const ctx       = stage.getContext("2d");

// Sprites
let background  = new Image();
let money       = new Image();
let money_pot   = new Image();
let hand_a      = new Image();
let hand_b      = new Image();
let boleto      = new Image();

background.src  = "sprites/background.png";
money.src       = "sprites/money.png";
money_pot.src   = "sprites/money_pot.png";
hand_a.src      = "sprites/hand_a.png";
hand_b.src      = "sprites/hand_b.png";
boleto.src      = "sprites/boleto.png";

// Game variables
const speed     = 2.0;
let score       = 0;
let game_over   = false;
let hand_x      = 150;
let hand_y      = 237;
let hand_sup_x  = 150;
let hand_sup_y  = 237;
let moneys      = [];

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
    hand_x -= 64;
}

function move_right() {
    hand_x += 64;
}

function throw_money() {
    hand_sup_y -= 30;
    moneys.push({"x": hand_x, "y": hand_y});
}

function gameOver() {
    game_over = true;
    document.getElementById("pontuacao").innerText = score;
    document.getElementById("game-over").style = "display : inline";
}


function draw() {
    // Desenhar fundo
    ctx.drawImage(background, 0, 0);

    // Desenhar mão
    ctx.drawImage(hand_a, hand_x, hand_y);

    // Desenhar pot de grana
    ctx.drawImage(money_pot, hand_x + 10, hand_y - 10);

    // Desenhar a outra mão
    ctx.drawImage(hand_b, hand_sup_x, hand_sup_y);

    // Desenhar os dinheiros jogados
    for (let i = 0; i < moneys.length; i++) {
        const t_money = moneys[i];
        ctx.drawImage(money, t_money.x, t_money.y);
        t_money.y -= 5
    }

    requestAnimationFrame(draw);
}

window.onload = function() {
    draw();
}
