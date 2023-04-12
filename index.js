console.clear();
const readlineSync = require('readline-sync');
const chalk = require('chalk');
const ora = require('ora');
const cards = ['As', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Valet', 'Dame', 'Roi'];

function biggerBataille(num1, num2) { return ((num1 == 1 || num1 > num2) && num2 > 1); };

console.log(chalk.green('Bienvenue sur Bataille-Devinator, un programme qui va donner des informations sur qui va gagner et autres en partant des principes suivants :'))
console.log(chalk.yellow('- La carte gagnante est mise en dessous du tas du gagnant, PUIS la carte gagnée'))
console.log(chalk.yellow('- Les batailles sont faites avec une carte au milieu, et comme précédement, le tas gagnant et placé en premier, puis le tas gagné'))
console.log(chalk.yellow('- Appuyez sur 0 pour dire que vous arrêtez de lister les cartes'))
console.log(chalk.yellow('- Le calcul peut prendre un certain temps, celà dépent du nombre de tours'))
readlineSync.question(chalk.bold('Appuyez sur ENTRER pour continuer'));

var player1 = [];
var player2 = [];


var lastResult = 0;
var lastP = true;

while (lastResult != -1) {
    console.clear();
    lastResult = readlineSync.keyInSelect(cards, `${(lastP) ? 'Quel carte a le joueur 1 ?' : 'Quel carte a le joueur 2 ?'}`, { cancel: chalk.redBright.bold("Arrêter".toUpperCase()) });

    if (lastResult != -1) {
        if (lastP) {
            player1.push(lastResult + 1)
            lastP = false
        }
        else {
            player2.push(lastResult + 1)
            lastP = true;
        }
    }
}

var start = Date.now() / 1000;

const spinner = ora({
    spinner: {
        "interval": 130,
        "frames": [
            "-",
            "\\",
            "|",
            "/"
        ]
    },
    text: 'Calcul en cours...'
});
spinner.start();

var totalRounds = 0,
    totalBataille = 0,
    max1 = player1.length,
    max2 = player2.length,
    min1 = player1.length,
    min2 = player2.length;

var toGive1 = [], toGive2 = [];

while (player1?.[0] && player2?.[0]) {
    var isDiff = (player1[0] != player2[0]);
    totalRounds++;

    // Bataille won, so give the cards
    if ((toGive1.length > 0 || toGive2.length > 0) && isDiff) {
        if (biggerBataille(player1[0], player2[0])) {
            player1.push(toGive1, toGive2);
        }

        else if (biggerBataille(player2[0], player1[0])) {
            player2.push(toGive2, toGive1);
        }
    }


    // Check who is winning
    if (biggerBataille(player1[0], player2[0])) {
        player1.push(player1[0], player2[0]);
    }
    else if (biggerBataille(player2[0], player1[0])) {
        player2.push(player2[0], player1[0]);
    }

    // It is equal
    else {
        totalBataille++;
        toGive1.push(player1[0], player1[1]);
        toGive2.push(player2[0], player2[1]);
        player1.shift();
        player2.shift();
    }

    player1.shift();
    player2.shift();

    if (isDiff) {
        if (max1 < player1.length) max1 = player1.length;
        if (max2 < player2.length) max2 = player2.length;

        if (min1 > player1.length) min1 = player1.length;
        if (min2 > player2.length) min2 = player2.length;
    }
}
var winner = (player1.length > 0);

console.clear();
spinner.succeed(`Calcul effectué ! (Temps écoulé: ${(Date.now() / 1000 - start).toFixed(2)}s)`);

console.table({
    'Nombre de tours': totalRounds,
    'Nombre de batailles': totalBataille,

    'Cartes min pour joueur 1': min1,
    'Cartes max pour joueur 1': max1,

    'Cartes min pour joueur 2': min2,
    'Cartes max pour joueur 2': max2,
});
console.log(chalk.green('Le gagnant est le ' + ((winner) ? chalk.bold('Joueur 1') : chalk.bold('Joueur 2')) + ' !'));