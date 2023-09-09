chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'searchForFood') {
        const { location, price, range } = message;
        searchForFood(location, price, range, sendResponse);
        return true; 
    }
});

function searchForFood(location, price, range, callback) {
    let apiUrl = `http://localhost:3000/?location=${location}`;
    
    if (price) {
      apiUrl += `&price=${price}`;
    }
    if (range) {
      apiUrl += `&radius=${range}`;
    }
    
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
