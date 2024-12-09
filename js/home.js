document.addEventListener('DOMContentLoaded', () => {
    
    
    const fetchTrendingMusic = async () => {
        const url = "https://itunes.apple.com/us/rss/topsongs/limit=9/json";
        try {
            const response = await fetch(url);
            const data = await response.json();
            displayTrendingMusic(data.feed.entry);
        } 
        catch (error) {
            console.error("Error fetching trending music:", error);
        }
    };


    const displayTrendingMusic = (songs) => {
 
        const topSongDiv = document.querySelector(".top-song");
        topSongDiv.innerHTML = '';  
        const secondSongDiv = document.querySelector(".second-song");
        secondSongDiv.innerHTML = '';  
        const thirdSongDiv = document.querySelector(".third-song");
        thirdSongDiv.innerHTML = '';  
        const trendingContainer = document.getElementById('trending'); 



        songs.forEach((song, index) => {
            const songCard = document.createElement('div');

            songCard.innerHTML = `
                <img src="${song["im:image"][2].label}" alt="${song.title.label}" class="song-image">
                <h2>${index + 1}.  ${song["im:name"].label}</h3>
                <p>Artist: ${song["im:artist"].label}</p>
                <button class="add-to-favorites" data-song="${song["im:name"].label}" data-artist="${song["im:artist"].label}" data-artwork="${song["im:image"][2].label}">Add to Favorites</button>
            `;


            if (index === 0) {
                topSongDiv.appendChild(songCard);
            } else if (index === 1) {
                secondSongDiv.appendChild(songCard);
            } else if (index === 2) {
                thirdSongDiv.appendChild(songCard);
            } else {

                songCard.classList.add('small-song');
                trendingContainer.appendChild(songCard)

            } 
        });

        

        // Add event listeners to all "Add to Favorites" buttons
        document.querySelectorAll('.add-to-favorites').forEach(button => {
            button.addEventListener('click', (e) => {
                const songName = e.target.dataset.song;
                const artistName = e.target.dataset.artist;
                const artworkUrl = e.target.dataset.artwork;
                addToFavorites(songName, artistName, artworkUrl);
            });
        });
    };

    const addToFavorites = (songName, artistName, artworkUrl) => {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const song = { songName, artistName, artworkUrl };
        
        // Prevent duplicate songs in favorites
        if (!favorites.some(fav => fav.songName === song.songName && fav.artistName === song.artistName)) {
            favorites.push(song);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            window.dispatchEvent(new Event('favorites-updated'));
            alert(`${songName} has been added to your favorites!`);
        } else {
            alert(`${songName} is already in your favorites!`);
        }
    };

    fetchTrendingMusic();
});
