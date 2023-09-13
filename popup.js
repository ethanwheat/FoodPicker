document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton');
    const newSearchButton = document.getElementById('startNewSearch');
    const locationInput = document.getElementById('location');
    const resultsDiv = document.getElementById('results');
    const searchMenuDiv = document.getElementById('search-menu');
    const priceLevels = document.querySelectorAll('.price-level');
    const loadingWheel = document.getElementById('loading-div');
 
    // price selection
    let price = 0;
    
    // Add click event listeners to each price level
    priceLevels.forEach((level, index) => {
        level.addEventListener('click', () => {
            // Update the selected range value (1 to 4)
            price = index + 1;

            // Update the color of price levels based on selected value
            priceLevels.forEach((el, idx) => {
                if (idx < price) {
                    el.classList.add('selected');
                } else {
                    el.classList.remove('selected');
                }
            });
        });
    });

    // range slider
    const rangeSlider = document.getElementById('range-slider');  
    const currentRangeDisplay = document.getElementById('currentRange');

    rangeSlider.addEventListener('input', function() {
        const currentRange = parseInt(rangeSlider.value);
        currentRangeDisplay.textContent = currentRange;
    });
    
    currentRangeDisplay.textContent = rangeSlider.value;

    searchButton.addEventListener('click', function () {
        const location = locationInput.value;
        let range = rangeSlider.value;
        if (range > 24) {
          range = 40000;
        } else {
          range = range * 1609;
        }
        searchMenuDiv.style.display = 'none';
        newSearchButton.style.display = 'block';
        loadingWheel.style.display = 'block';  // display loading wheel when search initiated

        // Send a message to the background script to initiate the search
        chrome.runtime.sendMessage({ action: 'searchForFood', location, price, range }, (response) => {
            resultsDiv.style.display = 'block';     
            loadingWheel.style.display = 'none';  // hide loading wheel when response received
            if (!response.error) {
                displayRandom(response);
            } else {
                resultsDiv.innerHTML = 'An error occurred while fetching data.';
            }
        }); 
    });

    newSearchButton.addEventListener('click', function () {
        // Clear the results and show the search menu again
        resultsDiv.style.display = 'none';
        newSearchButton.style.display = 'none';
        searchMenuDiv.style.display = 'block';
    });

    function displayResults(data) {
        // Display the API results in the popup
        resultsDiv.innerHTML = '<h2>Search Results:</h2>';
        if (data.businesses && data.businesses.length > 0) {
            data.businesses.forEach((business) => {
                const businessName = business.name;
                resultsDiv.innerHTML += `<p>${businessName}</p>`;
            });
        } else {
            resultsDiv.innerHTML += '<p>No results found.</p>';
        }
    }
  

    function displayRandom(data) { 
        // Check if there are businesses in the data
        if (data.businesses && data.businesses.length > 0) {
            // Choose a random index
            const randomIndex = Math.floor(Math.random() * data.businesses.length);
            // Get the randomly selected business
            const randomBusiness = data.businesses[randomIndex];
            // Display the selected business data
            resultsDiv.innerHTML = '<h2>Random Business:</h2>';
            resultsDiv.innerHTML += `<p>${randomBusiness.name}</p>`;
            resultsDiv.innerHTML += `<p>Address: ${randomBusiness.location.display_address.join(', ')}</p>`;
        } else {
            // No results found
            resultsDiv.innerHTML = '<h2>No results found.</h2>';
        }
    }
});
