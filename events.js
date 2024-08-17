const apiKey = '345202cf38e1e29edbeeb83ea87828e3';

const fetchArtistInfo = async (artistName) => {
    try {
        const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getInfo&artist=${encodeURIComponent(artistName)}&api_key=${apiKey}&format=json`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const eventsContainer = document.getElementById('events-artist');
        eventsContainer.innerHTML = ''; // Clear previous results

        if (data.artist) {
            const artistElement = document.createElement('div');
            artistElement.className = 'event';
            artistElement.innerHTML = `
                <h3>${data.artist.name}</h3>
                <p>${data.artist.bio.summary}</p>
                <a href="${data.artist.url}" target="_blank">More Info</a>
            `;
            eventsContainer.appendChild(artistElement);
        } else {
            eventsContainer.innerHTML = '<p>No information found for this artist.</p>';
        }
    } catch (error) {
        console.error('Error fetching artist info:', error);
        document.getElementById('events-artist').innerHTML = '<p>There was an error fetching the artist information. Please check the console for more details.</p>';
    }
};

document.getElementById('search-form-artist').addEventListener('submit', (event) => {
    event.preventDefault();
    const artistName = document.getElementById('artist-name').value.trim();
    if (artistName) {
        fetchArtistInfo(artistName);
    } else {
        document.getElementById('events-artist').innerHTML = '<p>Please enter an artist name.</p>';
    }
});
