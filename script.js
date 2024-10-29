//! VERSION: 0.5

document.getElementById('ranButton').addEventListener('click', conjugateRandom)
document.getElementById('switchButton').addEventListener('click', modeSwitch)
document.getElementById('findButton').addEventListener('click', findVerb)

// Verb list
const esp = 'https://raw.githubusercontent.com/nemocase/conjugator/refs/heads/main/verbs.json'
let verbA = [];
let previous = [];
let verb = [];
let answer = '';

// Hide and reveal functions
function reveal(text) {
    document.getElementById(text).style.color = 'black';
}
// When clicked (activated in HTML), words are changed to black and 'revealed'

function hide(element) {
    document.getElementById(element).style.color = 'blanchedalmond';
}

function hideLoop() {
    const output = ['topL', 'midL', 'lowL', 'topR', 'midR', 'lowR'];
    output.forEach(hide);
}

// Button press functions
function buttonDown(a) {
    document.getElementById(a).style.border = '4px inset black';
    document.getElementById(a).style.background = 'silver';
    setTimeout(buttonUp, 120, a);
}

function buttonUp(a) {
    document.getElementById(a).style.border = '2px outset black';
    document.getElementById(a).style.background = 'gainsboro';
}

// Fetch the verb list on page load
fetch(esp)
    .then(response => response.json()) // Parse the response as JSON
    .then(verbs => {
        verbs.forEach(word => {  //Loop over the verb array
            const name = word.word;
            const meaning = word.meaning;
            const con = word.con;
            verbA.push([name, meaning, con]); // For each verb, append all properties ("con" will be empty for regular verbs)
            return verbA;
        });
    })
    .catch(error => console.error('Error fetching users:', error));


function random(max) {
    return Math.floor(Math.random()*max);
}

// Generate random verb
async function randomVerb() {
    const range = verbA.length;
    verb = verbA[random(range)];
    if (previous.includes(verb[0])) {
        randomVerb(); // Runs the function again if the word is included in the "previous" array
    }
    else {
        return verb;
    }
}

// Conjugate verb and display result
function conjugateRandom() {
    document.getElementById('search').style.display = 'none';
    hideLoop();
    randomVerb();
    if (verb[2] == "reg") { // Check if verb is regular
        verb[2] = regular(verb); // If regular, conjugate...
        display(verb); // ...and display.
    } else {
        display(verb); // If irregular, display without conjugating
    }
    let word = verb[0];
    previous.push(word); // Appends the word to the "previous" array
    if (previous.length > 5) { // If "previous" is more than X number of words...
        previous.shift(); // ...the first (oldest) word is removed.
    }
    console.log(previous);
}

// Conjugate regular verbs
function regular(verb) {
    const word = verb[0];
    let con = verb[2];
    const ending = word.substring(word.length - 2);
    const root = word.substring(0, word.length - 2);
    switch (true) {
        case ending === 'ar':
            con = [
                root + 'o',
                root + 'as',
                root + 'a',
                root + 'amos',
                root + 'áis',
                root + 'an'
            ];
            return con;
        case ending === 'er':
            con = [
                root + 'o',
                root + 'es',
                root + 'e',
                root + 'emos',
                root + 'éis',
                root + 'en'
            ];
            return con;
        case ending === 'ir':
            con = [
                root + 'o',
                root + 'es',
                root + 'e',
                root + 'imos',
                root + 'ís',
                root + 'en'
            ];
            return con;
    }
}

// Display the current verb
function display(verb) {
    const word = verb[0];
    const meaning = verb[1];
    const con = verb[2];
    document.getElementById('main').innerHTML = word.toUpperCase();
    document.getElementById('sub').innerHTML = meaning;
    document.getElementById('messageBox').style.display = 'flex';
    document.getElementById('topL').innerHTML = `${con[0]}`;
    document.getElementById('midL').innerHTML = `${con[1]}`;
    document.getElementById('lowL').innerHTML = `${con[2]}`;
    document.getElementById('topR').innerHTML = `${con[3]}`;
    document.getElementById('midR').innerHTML = `${con[4]}`;
    document.getElementById('lowR').innerHTML = `${con[5]}`;
    document.getElementById('table').style.display = 'flex';
}

// Search verb database
function findVerb() {
    hideLoop();
    document.getElementById('main').innerHTML = '';
    document.getElementById('table').style.display = 'none';
    const field = verbA;
    const query = document.getElementById('enterVerb').value;
/*     if (query.match('to') < 1) {
        query = `to ${query}`;
    } */
    let message = '';
    let result = ['word', 'meaning', 'con'];
    field.forEach(word => {
        if (word[0] == query || word[1] == query || word[1] == `to ${query}`) {
            result[0] = word[0];
            result[1] = word[1];
            result[2] = word[2];
        }
    });
    if (result[0] == 'word') {
        message = 'No result found. Make sure the word is spelled correctly and ends in <b>-er</b>, <b>-ar</b>, or <b>-ir.</b>'
        document.getElementById('sub').innerHTML = message;
    } else if (result[2] == 'reg') {
        result[2] = regular(result);
        display(result);
    } else {
        display(result);
    }
    console.log(result);
}

// Switch between Random Word and Find Word displays on web page
function modeSwitch() {
    document.getElementById('main').innerHTML = '';
    document.getElementById('sub').innerHTML = '';
    document.getElementById('table').style.display = 'none';
    document.getElementById('search').style.display = 'flex';
}
