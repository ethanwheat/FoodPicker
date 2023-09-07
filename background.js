chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'searchForFood') {
        const location = message.location;
        searchForFood(location, sendResponse);
        return true; 
    }
});

function searchForFood(location, callback) {
    const apiUrl = `http://localhost:3000/api/foodpicker?location=${location}`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            callback(data);
        })
        .catch(error => {
            console.error('Error:', error);
            callback({ error: 'An error occurred while fetching data.' });
        });
}
