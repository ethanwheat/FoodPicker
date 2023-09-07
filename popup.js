document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton');
    const newSearchButton = document.getElementById('startNewSearch');
    const locationInput = document.getElementById('location');
    const resultsDiv = document.getElementById('results');
    const searchMenuDiv = document.getElementById('search-menu');

    searchButton.addEventListener('click', function () {
        const location = locationInput.value;
        
        searchMenuDiv.style.display = 'none';
        resultsDiv.style.display = 'block';
        // Send a message to the background script to initiate the search
        chrome.runtime.sendMessage({ action: 'searchForFood', location }, (response) => {
            if (!response.error) {
                displayResults(response);
            } else {
                newSearchButton.style.display = 'block';
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

        newSearchButton.style.display = 'block';
    }
});

