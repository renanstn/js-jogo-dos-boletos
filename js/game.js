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

// Audios
let score_snd   = new Audio();
let damage_snd  = new Audio();

score_snd.src   = "sounds/coin.wav";
damage_snd.src  = "sounds/hurt.wav";

// Game variables
const money_speed   = 3;
const left_limit    = 20;
const right_limit   = 340;
const fire_cooldown = 300;
const enemy_spawn_x = [20, 84, 148, 212, 276, 340];
const enemy_spawn_y = -64;

let score           = 0;
let level           = 0;
let lives           = 3;
let is_game_over    = false;
let player_x        = 20;
let player_y        = canvas.height - 90;
let hand_sup_y      = player_y;
let moneys          = [];
let boletos         = [];
let can_fire        = true;
let enemy_cooldown  = 2000;
let enemy_speed     = 1;


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
    if (player_x > left_limit) {
        player_x -= 64;
    }
}

function move_right() {
    if (player_x < right_limit) {
        player_x += 64;
    }
}

function throw_money() {
    if (can_fire) {
        moneys.push({"x": player_x + 20, "y": player_y});
        animate_hand_up();
        setTimeout(() => {
            animate_hand_down();
        }, fire_cooldown);
    }
}

function animate_hand_up() {
    can_fire = false;
    hand_sup_y -= 30;
}

function animate_hand_down() {
    can_fire = true;
    hand_sup_y = player_y;
}

function game_over() {
    is_game_over = true;
    document.getElementById("pontuacao").innerText = score;
    document.getElementById("game-over").style = "display : inline";
}

function hit() {
    lives -= 1;
    damage_snd.play();
    document.getElementById("vidas").innerText = lives;
}

function increase_score() {
    score += 1;
    score_snd.play();
    document.getElementById("score").innerText = score;
}

function increase_level() {
    level += 1;
    document.getElementById("level").innerText = level;
}

function spawn_enemies() {
    setInterval(() => {
        create_enemy();
    }, enemy_cooldown);
}

function create_enemy() {
    const position = enemy_spawn_x[Math.floor(Math.random() * enemy_spawn_x.length)];
    boletos.push({"x": position, "y": enemy_spawn_y});
}

function play_again() {

}

function draw() {
    // Limpar o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar fundo
    // ctx.drawImage(background, 0, 0);

    // Desenhar mão inferior
    ctx.drawImage(hand_down, player_x, player_y);

    // Desenhar bolo de grana
    ctx.drawImage(money_pot, player_x + 20, player_y + 8);

    // Desenhar os dinheiros jogados
    for (let i = 0; i < moneys.length; i++) {
        const t_money = moneys[i];
        ctx.drawImage(money, t_money.x, t_money.y);
        t_money.y -= money_speed;

        // Verificar colisões
        for (let j = 0; j < boletos.length; j++) {
            const enemy = boletos[j];
            if (t_money.x - 20 == enemy.x && enemy.y > t_money.y - 40) {
                boletos.splice(j, 1);
                moneys.splice(i, 1);
                increase_score();
            }
        }

        // Remover o dinheiro do array ao sair do canvas
        if (t_money.y < -64) {
            moneys.splice(i, 1);
        }
    }

    // Desenhar o dedo
    ctx.drawImage(dedo, player_x + 51, player_y + 30);

    // Desenhar a mão superior
    ctx.drawImage(hand_up, player_x - 20, hand_sup_y);

    for (let i = 0; i < boletos.length; i++) {
        const t_boleto = boletos[i];
        ctx.drawImage(boleto, t_boleto.x, t_boleto.y);
        t_boleto.y += enemy_speed;

        if (t_boleto.y > canvas.height) {
            hit();
            boletos.shift();
        }
    }

    requestAnimationFrame(draw);
}

window.onload = function() {
    draw();
    spawn_enemies();
}
