const fetchSongInfo = async (songName) => {
    try {
        const url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(songName)}&api_key=${apiKey}&format=json`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const eventsContainer = document.getElementById('events-song');
        eventsContainer.innerHTML = ''; // Clear previous results

        if (data.results.trackmatches.track.length > 0) {
            data.results.trackmatches.track.forEach(track => {
                const songElement = document.createElement('div');
                songElement.className = 'event';
                songElement.innerHTML = `
                    <h3>${track.name} by ${track.artist}</h3>
                    <a href="${track.url}" target="_blank">Listen on Last.fm</a>
                `;
                eventsContainer.appendChild(songElement);
            });
        } else {
            eventsContainer.innerHTML = '<p>No information found for this song.</p>';
        }
    } catch (error) {
        console.error('Error fetching song info:', error);
        document.getElementById('events-song').innerHTML = '<p>There was an error fetching the song information. Please check the console for more details.</p>';
    }
};

document.getElementById('search-form-song').addEventListener('submit', (event) => {
    event.preventDefault();
    const songName = document.getElementById('song-name').value.trim();
    if (songName) {
        fetchSongInfo(songName);
    } else {
        document.getElementById('events-song').innerHTML = '<p>Please enter a song name.</p>';
    }
});
