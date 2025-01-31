import { movies } from "../data/movies.js";

// Debugging: Log loaded movies to the console
console.log("Movies loaded:", movies);

// Get DOM elements for tables and alerts
const allMoviesTable = document.querySelector("#all-movies-container table");
const pinnedMoviesTable = document.querySelector("#pinned-movies-container table");
const allMoviesAlert = document.querySelector("#all-movies-container .alert");
const pinnedMoviesAlert = document.querySelector("#pinned-movies-container .alert");

// Retrieve stored pinned movies or return an empty list
const fetchPinnedMovies = () => JSON.parse(localStorage.getItem("pinnedMovies")) || [];

// Store updated pinned movies in local storage
const storePinnedMovies = (pinnedMovies) => {
    localStorage.setItem("pinnedMovies", JSON.stringify(pinnedMovies));
};

// Function to populate a given table with movie data
const populateMovieTable = (tableElement, moviesList) => {
    // Sort movies in descending order by rating
    moviesList.sort((a, b) => b.rating - a.rating);
    
    const tbody = tableElement.querySelector("tbody");
    tbody.innerHTML = ""; // Clear table content before inserting new data
    
    // Iterate through movies and insert each into the table
    moviesList.forEach(movie => {
        // Exclude movies of the "Drama" genre
        if (movie.genre === "Drama") return;
        
        const row = tbody.insertRow();
        row.insertCell(0).textContent = movie.title;
        row.insertCell(1).textContent = movie.genre;
        row.insertCell(2).textContent = new Date(movie.release_date * 1000).toLocaleDateString();
        row.insertCell(3).textContent = movie.director;
        row.insertCell(4).textContent = movie.rating;
        
        // Create a button for pin/unpin functionality
        const buttonCell = row.insertCell(5);
        const button = document.createElement("button");
        button.classList.add("btn");
        
        // Determine if the movie is already pinned
        const pinnedMovies = fetchPinnedMovies();
        const isPinned = pinnedMovies.some(m => m.title === movie.title);
        
        // Set button appearance based on pin status
        button.classList.add(isPinned ? "btn-danger" : "btn-primary");
        button.innerHTML = isPinned ? '<i class="fas fa-times"></i>' : '<i class="fas fa-thumbtack"></i>';
        
        // Handle pin/unpin action when button is clicked
        button.addEventListener("click", () => {
            const updatedMovies = isPinned 
                ? pinnedMovies.filter(m => m.title !== movie.title) 
                : [...pinnedMovies, movie];
            
            storePinnedMovies(updatedMovies);
            location.reload(); // Refresh page to reflect changes
        });
        
        buttonCell.appendChild(button);
        
        // Assign row styling based on movie rating
        row.classList.add(
            movie.rating <= 2 ? "table-danger" :
            movie.rating <= 5 ? "table-warning" :
            movie.rating <= 8 ? "table-primary" : "table-success"
        );
    });
    
    tableElement.classList.remove("d-none"); // Ensure the table is visible
};

// Fetch and log pinned movies from storage
const pinnedMovies = fetchPinnedMovies();
console.log("Pinned movies:", pinnedMovies);

// Show or hide pinned movies alert based on availability
pinnedMoviesAlert.classList.toggle("d-none", pinnedMovies.length > 0);
if (pinnedMovies.length > 0) populateMovieTable(pinnedMoviesTable, pinnedMovies);

// Show or hide all movies alert based on availability
allMoviesAlert.classList.toggle("d-none", movies.length > 0);
if (movies.length > 0) populateMovieTable(allMoviesTable, movies);
