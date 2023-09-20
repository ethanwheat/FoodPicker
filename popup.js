document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('search-button');
    const newSearchButton = document.getElementById('startNewSearch');
    const clearFiltersButton = document.getElementById('clear-filters');
    const locationInput = document.getElementById('location');
    const resultsDiv = document.getElementById('results');
    const resultsTitleDiv = document.getElementById('title-div');
    const searchMenuDiv = document.getElementById('search-menu');
    const resultsMenuDiv = document.getElementById('results-menu');
    const priceLevels = document.querySelectorAll('.price-level');
    const loadingWheel = document.getElementById('loading-div');
    const rerollButton = document.getElementById('reroll');
    const typeOptions = document.getElementById('type-options');
 
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
    const currentRangeDisplay = document.getElementById('current-range');

    rangeSlider.addEventListener('input', function() {
        const currentRange = parseInt(rangeSlider.value);
        currentRangeDisplay.textContent = currentRange;
    });
    
    searchButton.addEventListener('click', function () {
        const location = locationInput.value;
        const type = typeOptions.value;
        let range = rangeSlider.value;
        if (range > 24) {
          range = 40000;
        } else {
          range = range * 1609;
        }
        searchMenuDiv.style.display = 'none';
        resultsMenuDiv.style.display = 'flex';
        newSearchButton.style.display = 'block';
        loadingWheel.style.display = 'block';  // display loading wheel when search initiated

        // Send a message to the background script to initiate the search
        chrome.runtime.sendMessage({ action: 'searchForFood', location, type, price, range }, (response) => {
            resultsTitleDiv.style.display = 'flex';
            resultsDiv.style.display = 'flex';     
            loadingWheel.style.display = 'none';  // hide loading wheel when response received
            if (!response.error) {
                displayRandom(response);
            } else {
                resultsDiv.innerHTML = 'An error occurred while fetching data.';
            }
        }); 
    });
    
    clearFiltersButton.addEventListener('click', function() {
        typeOptions.selectedIndex = 0;
        price = 0;  // reset price
        priceLevels.forEach((el, idx) => {
            el.classList.remove('selected');  // remove selected dollar signs
        });
        rangeSlider.value = 5;
        currentRangeDisplay.textContent = 5;
    });

    newSearchButton.addEventListener('click', function () {
        // Clear the results and show the search menu again
        resultsMenuDiv.style.display = 'none';
        resultsTitleDiv.style.display = 'none';
        resultsDiv.style.display = 'none';
        newSearchButton.style.display = 'none';
        rerollButton.style.display = 'none';
        loadingWheel.style.display = 'none';
        searchMenuDiv.style.display = 'flex';
    });

    rerollButton.addEventListener('click', function () {
          resultsTitleDiv.style.display = 'none';
        resultsDiv.style.display = 'none';
        rerollButton.style.display = 'none';
        searchButton.click(); 
    }); 

    function displayRandom(data) { 
        // Check if there are businesses in the data
        if (data.businesses && data.businesses.length > 0) {
            // Choose a random index
            const randomIndex = Math.floor(Math.random() * data.businesses.length);
            // Get the randomly selected business
            const randomBusiness = data.businesses[randomIndex];
            // Display the selected business data
            resultsTitleDiv.innerHTML = '<h2><span>Random Restaurant:</span></h2>';
            resultsTitleDiv.innerHTML += `<h3>${randomBusiness.name}</h3>`;
            resultsDiv.innerHTML = `<label class="label color-2">Address</label>`;
            resultsDiv.innerHTML += `<p>${randomBusiness.location.display_address.join(', ')}</p>`;
            resultsDiv.innerHTML += `<label class="label color-4">Rating</label>`;
            resultsDiv.innerHTML += `<p>${randomBusiness.rating}</p>`;
            resultsDiv.innerHTML += `<label class="label color-3">Phone Number</label>`;
            resultsDiv.innerHTML += `<p>${randomBusiness.display_phone}</p>`;
            resultsDiv.innerHTML += `<label class="label color-1">Website</label>`;
            resultsDiv.innerHTML += `<a href="${randomBusiness.url}" target="_blank">Click Me!</a>`;
            if (randomBusiness.is_closed) {
                resultsDiv.innerHTML += '<label class="label" style="color: red;">Currently Closed</label>';
            } else {
                resultsDiv.innerHTML += '<label class="label" style="color: green;">Currently Open</label>';
            }
            rerollButton.style.display = 'block'; 
        } else {
            // No results found
            resultsDiv.innerHTML = '<h2>No results found.</h2>';
        }
    }
});
