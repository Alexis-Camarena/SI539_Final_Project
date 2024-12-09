document.addEventListener('DOMContentLoaded', () => {
    const favoritesContainer = document.getElementById('favorites-container');
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-content');
    const modalClose = document.getElementById('modal-close');

    // Display favorites dynamically
    const displayFavorites = () => {
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        favoritesContainer.innerHTML = '';

        favorites.forEach(favorite => {
            const favoriteCard = document.createElement('div');
            favoriteCard.classList.add('album-card');
            favoriteCard.innerHTML = `
                <img src="${favorite.artworkUrl}" alt="${favorite.songName}" class="song-image">
                <h3>${favorite.songName}</h3>
                <p>Artist: ${favorite.artistName}</p>
                <button class="lyrics-btn" data-song="${favorite.songName}" data-artist="${favorite.artistName}">View Lyrics</button>
                <button class="chords-btn" data-song="${favorite.songName}">View Chords</button>
            `;
            favoritesContainer.appendChild(favoriteCard);
        });

        // Add event listeners for "View Lyrics" buttons
        const lyricsButtons = document.querySelectorAll('.lyrics-btn');
        lyricsButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const songName = e.target.dataset.song;
                const artistName = e.target.dataset.artist;
                viewLyrics(songName, artistName);
            });
        });

        // Add event listeners for "View Chords" buttons
        const chordsButtons = document.querySelectorAll('.chords-btn');
        chordsButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const songName = e.target.dataset.song;
                viewChords(songName);
            });
        });
    };

    // View guitar chords (mock data)
    const viewChords = (songName) => {
        openModal(`
            <h2>Guitar Chords for ${songName}</h2>
            <p>Chords: G, C, D, Am</p>
        `);
    };

    // Fetch and display Lyrics for the song
    const viewLyrics = async (songName, artistName) => {
        const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artistName)}/${encodeURIComponent(songName)}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Lyrics not found for "${songName}" by "${artistName}"`);
            }
            const data = await response.json();
            openModal(`
                <h2>Lyrics for ${songName} by ${artistName}</h2>
                <pre>${data.lyrics || "No lyrics available."}</pre>
            `);
        } catch (error) {
            console.error("Error fetching lyrics:", error);
            openModal(`
                <h2>Lyrics Not Found</h2>
                <p>We couldn't find lyrics for "${songName}" by "${artistName}".</p>
            `);
        }
    };

    // Open modal with content
    const openModal = (content) => {
        modalContent.innerHTML = content;
        modal.style.display = 'block';
    };

    // Close modal
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Initial call to display favorites
    displayFavorites();
});
