const API_KEY = '345202cf38e1e29edbeeb83ea87828e3';
let currentQuestion = {};
let correctAnswer = '';
let questionsAnswered = 0;
const usedArtists = new Set();
const delayBeforeNextQuestion = 0.05; // 2 seconds delay

document.addEventListener('DOMContentLoaded', () => {
    loadQuestion();
});

async function loadQuestion() {
    if (questionsAnswered >= 10) {
        alert('Quiz completed! Thanks for playing.');
        window.location.reload();
        return;
    }

    try {
        const randomArtist = await fetchRandomArtist();
        usedArtists.add(randomArtist);

        const artistInfo = await fetchArtistInfo(randomArtist);
        const bioSnippet = filterArtistName(artistInfo.artist.name, artistInfo.artist.bio.summary.split('.').slice(0, 2).join('. ') + '.');

        const choices = await generateRandomChoices(randomArtist);

        currentQuestion = {
            question: `Which artist has this biography? "${bioSnippet}"`,
            choices: choices,
            correctAnswer: randomArtist
        };

        correctAnswer = currentQuestion.correctAnswer;
        displayQuestion(currentQuestion);
    } catch (error) {
        console.error('Error loading question:', error);
    }
}

async function fetchRandomArtist() {
    const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&limit=500&api_key=${API_KEY}&format=json`);
    const data = await response.json();

    let randomArtist;
    do {
        randomArtist = data.artists.artist[Math.floor(Math.random() * data.artists.artist.length)].name;
    } while (usedArtists.has(randomArtist));

    return randomArtist;
}

async function fetchArtistInfo(artist) {
    const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(artist)}&api_key=${API_KEY}&format=json`);
    return response.json();
}

async function generateRandomChoices(correctArtist) {
    const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&limit=500&api_key=${API_KEY}&format=json`);
    const data = await response.json();

    const allChoices = new Set();
    allChoices.add(correctArtist);

    while (allChoices.size < 4) {
        const randomArtist = data.artists.artist[Math.floor(Math.random() * data.artists.artist.length)].name;
        allChoices.add(randomArtist);
    }

    return Array.from(allChoices).sort(() => 0.5 - Math.random());
}

function filterArtistName(artistName, bio) {
    const regex = new RegExp(artistName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'gi');
    return bio.replace(regex, '***');
}

function displayQuestion(question) {
    document.getElementById('question').textContent = question.question;
    const choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = ''; // Clear previous choices

    question.choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice;
        button.onclick = () => {
            checkAnswer(choice);
        };
        choicesContainer.appendChild(button);
    });
}

function checkAnswer(selectedAnswer) {
    if (selectedAnswer === correctAnswer) {
        alert('Correct!');
    } else {
        alert(`Wrong! The correct answer was ${correctAnswer}`);
    }

    setTimeout(() => {
        questionsAnswered++;
        loadQuestion();
    }, delayBeforeNextQuestion);
}
