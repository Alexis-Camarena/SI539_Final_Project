document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const searchBar = document.getElementById('search-bar');
    const searchResultsContainer = document.getElementById('search-results');

    // Event listener for search button click
    searchButton.addEventListener('click', () => {
        const query = searchBar.value.trim();
        if (query) {
            fetchSearchResults(query);
        }
    });


    // Fetch search results from iTunes API
    const fetchSearchResults = async (query) => {
        const url = "https://itunes.apple.com/search?term=" + query + "&attribute=allArtistTerm";
        try {
            const response = await fetch(url);
            const data = await response.json();
            displaySearchResults(data.results);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    // Display search results in the UI
    const displaySearchResults = (results) => {
        searchResultsContainer.innerHTML = '';  // Clear previous results
        results.forEach(album => {
            const albumCard = document.createElement('div');
            albumCard.classList.add('album-card');
            albumCard.innerHTML = `
                <img src="${album.artworkUrl100}" alt="${album.trackName}" class="album-image">
                <h4>${album.trackName}</h4>
                <p><strong>Artist:</strong> ${album.artistName}</p>
                <p><strong>Price:</strong> $${album.trackPrice || 'N/A'}</p>
                <button class="add-to-favorites" data-song="${album.trackName}" data-artist="${album.artistName}" data-artwork="${album.artworkUrl100}">Add to Favorites</button>
            `;
            searchResultsContainer.appendChild(albumCard);
        });

        // Add event listeners for "Add to Favorites" buttons
        const addToFavoritesButtons = document.querySelectorAll('.add-to-favorites');
        addToFavoritesButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const songName = e.target.dataset.song;
                const artistName = e.target.dataset.artist;
                const artworkUrl = e.target.dataset.artwork;
                addToFavorites(songName, artistName, artworkUrl);
            });
        });

    };



    // Add song to favorites (saving in localStorage)
    const addToFavorites = (songName, artistName, artworkUrl) => {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const song = { songName, artistName, artworkUrl };
        
        // Prevent duplicates
        if (!favorites.some(fav => fav.songName === song.songName && fav.artistName === song.artistName)) {
            favorites.push(song);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            alert(`${songName} has been added to your favorites!`);
        } else {
            alert(`${songName} is already in your favorites!`);
        }
    };
});
