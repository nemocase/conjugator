//CONJUGATOR v0.4

/* 
22/10/24
    18:05 Hide/reveal is now working as intended! With some extra verbs, ConjuGator is ready to go.
*/

document.getElementById('newButton').addEventListener('click', takeNew)
document.getElementById('conButton').addEventListener('click', conjugateNew)
document.getElementById('ranButton').addEventListener('click', conjugateRandom)

// Verb list
const esp = 'https://raw.githubusercontent.com/nemocase/conjugator/refs/heads/main/verbs.json'
let verbA = [];
let previous = [];
let verb = [];
let answer = '';


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

// Combine conjugate and display functions
function conjugateRandom() {
    document.getElementById('newWord').style.display = 'none';
    hideLoop();
    randomVerb();
    if (verb[2] == "reg") { // Check if verb is regular
        verb[2] = regular(verb); // If regular, conjugate...
        display(verb); // ...and display.
    } else {
        display(verb); // If irregular, display without conjugating
    }
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
    previous.push(word); // Appends the word to the "previous" array
    if (previous.length > 5) { // If "previous" is more than X number of words...
        previous.shift(); // ...the first (oldest) word is removed.
    }
    console.log(previous);
}


// Conjugate any infinitive
function takeNew() {
    document.getElementById('main').innerHTML = '';
    document.getElementById('sub').innerHTML = '';
    document.getElementById('table').style.display = 'none';
    document.getElementById('newWord').style.display = 'flex';
}

function conjugateNew() {
    console.clear();
    const verb = document.getElementById('enterVerb').value;
    document.getElementById('main').innerHTML = `${verb}`;
    const ending = verb.substring(verb.length - 2);
    const root = verb.substring(0, verb.length - 2);
    switch (true) {
        case ending === 'ar':
            document.getElementById('topL').innerHTML = `Yo ${root + 'o'}`;
            document.getElementById('midL').innerHTML = `Tú ${root + 'as'}`;
            document.getElementById('lowL').innerHTML = `Usted ${root + 'a'}`;
            document.getElementById('topR').innerHTML = `Nosotros ${root + 'amos'}`;
            document.getElementById('midR').innerHTML = `Vosotros ${root + 'áis'}`;
            document.getElementById('lowR').innerHTML = `Ustedes ${root + 'an'}`;
            document.getElementById('table').style.display = 'flex';
            break;
        case ending === 'er':
            document.getElementById('topL').innerHTML = `Yo ${root + 'o'}`;
            document.getElementById('midL').innerHTML = `Tú ${root + 'es'}`;
            document.getElementById('lowL').innerHTML = `Usted ${root + 'e'}`;
            document.getElementById('topR').innerHTML = `Nosotros ${root + 'emos'}`;
            document.getElementById('midR').innerHTML = `Vosotros ${root + 'éis'}`;
            document.getElementById('lowR').innerHTML = `Ustedes ${root + 'en'}`;
            document.getElementById('table').style.display = 'flex';
            break;
        case ending === 'ir':
            document.getElementById('topL').innerHTML = `Yo ${root + 'o'}`;
            document.getElementById('midL').innerHTML = `Tú ${root + 'es'}`;
            document.getElementById('lowL').innerHTML = `Usted ${root + 'e'}`;
            document.getElementById('topR').innerHTML = `Nosotros ${root + 'imos'}`;
            document.getElementById('midR').innerHTML = `Vosotros ${root + 'ís'}`;
            document.getElementById('lowR').innerHTML = `Ustedes ${root + 'en'}`;
            document.getElementById('table').style.display = 'flex';
            break;
    }
}
