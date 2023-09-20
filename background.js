chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'searchForFood') {
        const { location, type, price, range } = message;
        searchForFood(location, type, price, range, sendResponse);
        return true; 
    }
});

function searchForFood(location, type, price, range, callback) {
    let apiUrl = `http://ENDPOINT-HERE/?location=${location}&type=${type}`;
    
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
