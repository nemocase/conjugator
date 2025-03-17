//! VERSION: 0.6
//* 17/03/25

// BUTTONS
document.getElementById('ranButton').addEventListener('click', conjugateRandom) // Random word
document.getElementById('switchButton').addEventListener('click', modeSwitch) // Switch to Find Mode
document.getElementById('findButton').addEventListener('click', findVerb) // Search button for Find Mode

// Verb list
const esp = 'https://raw.githubusercontent.com/nemocase/conjugator/refs/heads/main/verbs.json'
let verbList = []; // List of all verbs imported from JSON
let previous = []; // List of previously 'drawn' verbs (max 5)
let verb = []; // The active verb

// HIDE & REVEAL FUNCTIONS
function reveal(text) {
    document.getElementById(text).style.color = 'black';
}
// When clicked (activated in HTML), words are changed to black and 'revealed'

// Hide an individual word in the table
function hideCon(element) {
    document.getElementById(element).style.color = 'blanchedalmond';
}

// Loop through all conjugations in the table and applies hideCon, without hiding the table itself
function hideLoop() {
    const output = ['topL', 'midL', 'lowL', 'topR', 'midR', 'lowR'];
    output.forEach(hideCon);
}

// Hide the Find Word sections
function hideSearch() {
    document.getElementById('search').style.display = 'none';
}

// Hide the table and clears message box
function hideTable() {
    hideLoop();
    document.getElementById('main').innerHTML = '';
    document.getElementById('sub').innerHTML = '';
    document.getElementById('table').style.display = 'none';
}

function hideAll() {
    hideTable();
    hideSearch();
}

// Display the current verb
function display(verb) {
    const word = verb[0];
    const meaning = verb[1];
    const con = verb[3];
    document.getElementById('topL').innerHTML = `${con[0]}`;
    document.getElementById('midL').innerHTML = `${con[1]}`;
    document.getElementById('lowL').innerHTML = `${con[2]}`;
    document.getElementById('topR').innerHTML = `${con[3]}`;
    document.getElementById('midR').innerHTML = `${con[4]}`;
    document.getElementById('lowR').innerHTML = `${con[5]}`;
    document.getElementById('main').innerHTML = word.toUpperCase();
    document.getElementById('sub').innerHTML = meaning;
    document.getElementById('messageBox').style.display = 'flex';
    document.getElementById('table').style.display = 'flex';
    document.getElementById('tenseLine').style.display = 'flex';
}

function displayAlternate(con) {
    document.getElementById('topL').innerHTML = `${con[0]}`;
    document.getElementById('midL').innerHTML = `${con[1]}`;
    document.getElementById('lowL').innerHTML = `${con[2]}`;
    document.getElementById('topR').innerHTML = `${con[3]}`;
    document.getElementById('midR').innerHTML = `${con[4]}`;
    document.getElementById('lowR').innerHTML = `${con[5]}`;
}

function displayParticiple(participle) {
    document.getElementById('topL').innerHTML = `he ${participle}`;
    document.getElementById('midL').innerHTML = `has ${participle}`;
    document.getElementById('lowL').innerHTML = `ha ${participle}`;
    document.getElementById('topR').innerHTML = `hemos ${participle}`;
    document.getElementById('midR').innerHTML = `habéis ${participle}`;
    document.getElementById('lowR').innerHTML = `han ${participle}`;
}

// Switch from Random Word to Find Word displays on web page
function modeSwitch() {
    hideTable();
    document.getElementById('search').style.display = 'flex';
}

// Switch between tenses based on the button clicked
function tenseSwitch(button) {
    let a = 'tense'+ button;
    let con = [];
    buttonDownTense(a);
    hideLoop();
    switch (button) {
        case 'Present':
            display(verb);
            break;
        case 'Preterite':
            con = regPreterite(verb);
            displayAlternate(con);
            break;
        case 'Participle':
            let participle = String(verb[6]);
            displayParticiple(participle);
            break;
        case 'Imperfect':
            con = [];
            con = regImperfect(verb);
            displayAlternate(con);
            break;
    }
}

// BUTTON PRESS EFFECTS
// Together these functions make the buttons appear to be pressing down
function buttonDown(a) {
    document.getElementById(a).style.border = '4px inset black';
    document.getElementById(a).style.background = 'silver';
    setTimeout(buttonUp, 120, a);
}

function buttonUp(a) {
    document.getElementById(a).style.border = '2px outset black';
    document.getElementById(a).style.background = 'gainsboro';
}

function buttonDownTense(a) {
    document.getElementById(a).style.border = '4px inset black';
    setTimeout(buttonUpTense, 120, a);
}

function buttonUpTense(a) {
    document.getElementById(a).style.border = '2px outset black';
}

// CONJUGATION FUNCTIONS
// Fetch the verb list on page load and apply all necessary properties
fetch(esp)
    .then(response => response.json()) // Parse the response as JSON
    .then(verbs => {
        verbs.forEach(word => {  //Loop over the verb array
            const name = word.word; // 0
            const meaning = word.meaning; // 1
            const reflexive = word.reflexive; // 2
            const present = word.present; // 3
            const imperfect = word.imperfect; // 4
            const preterite = word.preterite; // 5
            const participle = word.participle; // 6
            verbList.push([name, meaning, reflexive, present, imperfect, preterite, participle]); // For each verb, append all properties (conjugations will be empty for regular verbs)
            return verbList;
        });
    })
    .catch(error => console.error('Error fetching users:', error));


function random(max) {
    return Math.floor(Math.random()*max);
}


//! MAIN RANDOM WORD SEQUENCE
// Fetch random verb
async function randomVerb() {
    const range = verbList.length;
    verb = verbList[random(range)];
    if (previous.includes(verb[0])) {
        randomVerb(); // Runs the function again if the word is included in the "previous" array
    }
    else {
        return verb;
    }
}

// Random Word button function
function conjugateRandom() {
    hideSearch();
    hideLoop();
    randomVerb();
    if (verb[3] == "reg") { // Check if verb is regular
        verb[3] = regPresent(verb); // If regular, conjugate...
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

// Conjugate PRESENT for regular verbs [3]
function regPresent(verb) {
    const word = verb[0];
    let con = verb[3];
    const ending = word.substring(word.length - 2);
    const root = word.substring(0, word.length - 2);
    if (con == 'reg') {
        switch (ending) {
            case 'ar':
                con = [
                    root + 'o',
                    root + 'as',
                    root + 'a',
                    root + 'amos',
                    root + 'áis',
                    root + 'an'
                ];
                return con;
            case 'er':
                con = [
                    root + 'o',
                    root + 'es',
                    root + 'e',
                    root + 'emos',
                    root + 'éis',
                    root + 'en'
                ];
                return con;
            case 'ir':
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
}

// Conjugate IMPERFECT for regular verbs [4]
function regImperfect(verb) {
    const word = verb[0];
    let con = verb[4];
    const ending = word.substring(word.length - 2);
    const root = word.substring(0, word.length - 2);
    if (con == 'reg') {
        switch (ending) {
            case 'ar':
                con = [
                    root + 'aba',
                    root + 'abas',
                    root + 'aba',
                    root + 'ábamos',
                    root + 'abais',
                    root + 'aban'
                ];
                return con;
            case 'er':
                con = [
                    root + 'ía',
                    root + 'ías',
                    root + 'ía',
                    root + 'íamos',
                    root + 'ías',
                    root + 'ían'
                ];
                return con;
            case 'ir':
                con = [
                    root + 'ía',
                    root + 'ías',
                    root + 'ía',
                    root + 'íamos',
                    root + 'ías',
                    root + 'ían'
                ];
                return con;
        }
    }
}

// Conjugate PRETERITE for regular verbs [5]
function regPreterite(verb) {
    const word = verb[0];
    let con = verb[5];
    const ending = word.substring(word.length - 2);
    const root = word.substring(0, word.length - 2);
    if (con == 'reg') {
        switch (ending) {
            case 'ar':
                con = [
                    root + 'é',
                    root + 'aste',
                    root + 'ó',
                    root + 'amos',
                    root + 'asteis',
                    root + 'aron'
                ];
                return con;
            case 'er':
                con = [
                    root + 'í',
                    root + 'iste',
                    root + 'ió',
                    root + 'imos',
                    root + 'isteis',
                    root + 'ieron'
                ];
                return con;
            case 'ir':
                con = [
                    root + 'í',
                    root + 'iste',
                    root + 'ió',
                    root + 'imos',
                    root + 'isteis',
                    root + 'ieron'
                ];
                return con;
        }
    }
}

// Conjugate regular participles
//! FINAL VERSION
/* function conjugateParticiple(infinitive) {
    const participle = verb[4];
    return participle;
} */

//! STOPGAP VERSION
/* function conjugateParticiple(infinitive) {
    const ending = infinitive.substring(infinitive.length - 2);
    const root = infinitive.substring(0, infinitive.length - 2);
    let participle = '';
    switch (ending) {
        case 'ar':
            participle = root + 'ado';
            return participle;
        case 'er':
            participle = root + 'ido';
            return participle;
        case 'ir':
            participle = root + 'ido';
            return participle;
    }
} */

// SEARCH FUNCTIONS
// Search the verb database
function findVerb() {
    hideTable();
    const field = verbList;
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
        result[2] = regPresent(result);
        display(result);
    } else {
        display(result);
    }
    console.log(result);
}
