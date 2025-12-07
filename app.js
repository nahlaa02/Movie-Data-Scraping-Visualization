Papa.parse("./lib/data/movie_data.csv", {
    download: true,
    header: true,
    complete: function(results) {
        const data = results.data;
        console.log(data);

        // --- EXAMPLE CHART (Assuming 'myChart' exists in HTML) ---
        const locationOfChart = document.getElementById('myChart');
        new Chart(locationOfChart, {
            type: 'bar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange', 'Magenta'],
                datasets: [{
                    label: 'Color Frequency',
                    data: [12, 19, 3, 5, 2, 3, 25],
                    borderWidth: 1,
                    backgroundColor: "green"
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // --- CHART 1: TOP 10 MOVIES ---
        const topTenMoviesChart = document.getElementById('movieRatingBarChart');
        const moviesWithData = data.filter(function(movie){
            // Ensure rating can be parsed as a number
            return movie.rating && movie.title && !isNaN(parseFloat(movie.rating));
        })
        
        const sortedMovies = moviesWithData.sort(function(a,b){
            return parseFloat(b.rating) - parseFloat(a.rating);
        })

        const top10Movies = sortedMovies.slice(0, 10);
        console.log(top10Movies);

        new Chart(topTenMoviesChart, {
            type: 'bar',
            data: {
                labels: top10Movies.map(movie => movie.title),
                datasets: [{
                    label: 'Top 10 Movies by Rating',
                    data: top10Movies.map(movie => parseFloat(movie.rating)), // Use parseFloat for safety
                    borderWidth: 2,
                    backgroundColor: "lightblue",
                    borderColor: "grey"
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // --- CHART 2: GENRE PIE CHART (FIXED LOGIC) ---
        const topGenrePieChart = document.getElementById('genrePieChart');
        const genreCounts = {};
        
        for (let i = 0; i < data.length; i++) {
            // FIX: Check if data[i].genre exists before trying to split it
            if (!data[i].genre) {
                continue;
            }

            // Also use .trim() to remove spaces so ' Drama' and 'Drama' don't count separately
            let currentGenres = data[i].genre.split(",").map(g => g.trim());
            
            for (let j = 0; j < currentGenres.length; j++) {
                let currentGenre = currentGenres[j];
                
                if (genreCounts[currentGenre] == null) {
                    genreCounts[currentGenre] = 1;
                } else {
                    genreCounts[currentGenre] += 1; 
                }
            }
        }
        
        console.log(genreCounts); 

        const pieLabels = Object.keys(genreCounts);
        const pieData = pieLabels.map(genre => genreCounts[genre]);

        const backgroundColors = [
            "red", "blue", "green", "yellow", "lightblue", 
            "grey", "pink", "orange", "purple", "cyan",
            "magenta", "lime", "teal", "brown"
        ];

        new Chart(topGenrePieChart, {
            type: 'pie',
            data: {
                labels: pieLabels,
                datasets: [{
                    label: 'Movie Count',
                    data: pieData,
                    borderWidth: 3,
                    backgroundColor: backgroundColors
                }]
            },
            options: {
                plugins: { // Corrected: options key should be 'plugins', not 'plugIns'
                    title: {
                        display: true,
                        text: "Top Genres Pie Chart"
                    }
                }
            }
        });
        
        // --- CHART 3: AVERAGE RATING LINE CHART ---
        const avgLineChart = document.getElementById('averageRatingLineChart');
        const ratingSumByYear = {}; // Renamed from ratingByYear for clarity
        const movieCountByYear = {};

        for (let i = 0; i < data.length; i++) {
            // Logic to skip null values is correct
            if (data[i].year == null || data[i].rating == null) {
                continue;
            }

            const year = parseInt(data[i].year);
            const rating = parseFloat(data[i].rating);

            if(ratingSumByYear[year] == null) {
                ratingSumByYear[year] = 0;
                movieCountByYear[year] = 0;
            }
            ratingSumByYear[year] += rating;
            movieCountByYear[year] += 1;
        }

        const years = Object.keys(ratingSumByYear);
        const yearsSorted = years.sort((a,b) => parseInt(a) - parseInt(b));

        // Calculate average ratings for the Y-axis
        const avgRatings = yearsSorted.map(year => (ratingSumByYear[year] / movieCountByYear[year]).toFixed(2));


        new Chart(avgLineChart, {
            type: 'line',
            data: {
                labels: yearsSorted,
                datasets: [{
                    label: 'Average Rating', // Corrected Label
                    data: avgRatings,
                    borderWidth: 2,
                    borderColor: "rgba(75, 192, 192, 1)", // Teal/Cyan line
                    tension: 0.4, // Makes the line slightly curved
                    fill: false // Prevents area under line from being filled
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false // It's fine for ratings not to start at 0
                    }
                }
            }
        });
    }
})