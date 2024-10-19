let quotes = [
    { text: "The best way to predict the future is to create it.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Get busy living or get busy dying.", category: "Motivation" }
];

const mockServerData = [
    { text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment.", category: "Inspiration" },
    { text: "In three words I can sum up everything I've learned about life: it goes on.", category: "Life" }
];

// Load quotes from local storage if available
function loadQuotes() {
    const storedQuotes = JSON.parse(localStorage.getItem('quotes'));
    if (storedQuotes) {
        quotes = storedQuotes;
    }
}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
    // Simulating a network request with a promise
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockServerData);
        }, 1000);
    });
}

// Check for updates from the server
async function checkForUpdates() {
    const serverQuotes = await fetchQuotesFromServer(); // Using the new function
    resolveConflicts(serverQuotes);
}

// Resolve conflicts between local and server data
function resolveConflicts(serverQuotes) {
    const existingQuotes = quotes.map(q => q.text);

    serverQuotes.forEach(serverQuote => {
        if (!existingQuotes.includes(serverQuote.text)) {
            quotes.push(serverQuote); // Add new quote from server
        }
    });

    saveQuotes(); // Save updated quotes to local storage
    showNotification("Quotes updated from server.");
}

// Function to create and display the add quote form
function createAddQuoteForm() {
    const container = document.getElementById('addQuoteContainer');
    container.innerHTML = ''; // Clear existing content

    const form = document.createElement('form');
    form.onsubmit = function (event) {
        event.preventDefault(); // Prevent form submission
        addQuote();
    };

    const quoteInput = document.createElement('input');
    quoteInput.id = 'newQuoteText';
    quoteInput.type = 'text';
    quoteInput.placeholder = 'Enter a new quote';
    form.appendChild(quoteInput);

    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';
    form.appendChild(categoryInput);

    const addButton = document.createElement('button');
    addButton.type = 'submit';
    addButton.textContent = 'Add Quote';
    form.appendChild(addButton);

    container.appendChild(form);
}

// Function to display a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<strong>${quote.text}</strong> <em>(${quote.category})</em>`;
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        saveQuotes();
        populateCategories();
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        alert('Quote added successfully!');
    } else {
        alert('Please fill in both fields.');
    }
}

// Populate categories in the dropdown
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = [...new Set(quotes.map(quote => quote.category))];

    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    const lastSelected = localStorage.getItem('lastSelectedCategory');
    if (lastSelected) {
        categoryFilter.value = lastSelected;
    }
}

// Filter quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);

    if (filteredQuotes.length > 0) {
        const quoteDisplay = document.getElementById('quoteDisplay');
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const quote = filteredQuotes[randomIndex];
        quoteDisplay.innerHTML = `<strong>${quote.text}</strong> <em>(${quote.category})</em>`;
    } else {
        document.getElementById('quoteDisplay').innerHTML = 'No quotes available for this category.';
    }

    localStorage.setItem('lastSelectedCategory', selectedCategory);
}

// Show notification to the user
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    setTimeout(() => {
        notification.textContent = '';
    }, 3000);
}

// Function to export quotes as a JSON file
function exportQuotes() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const exportDetails = ["quotes.json", "application/json"]; // ["file"]

    const a = document.createElement('a');
    a.href = url;
    a.download = exportDetails[0]; // Filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up the URL object
    showNotification("Quotes exported successfully!");
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const file = event.target.files[0]; // Using FileReader
    if (!file) {
        return;
    }

    const reader = new FileReader(); // Using FileReader
    reader.onload = function (e) {
        try {
            const importedQuotes = JSON.parse(e.target.result); // Using onload
            quotes = importedQuotes; // Update quotes array with imported quotes
            saveQuotes(); // Save the new quotes to local storage
            populateCategories(); // Update categories
            showNotification("Quotes imported successfully!");
        } catch (error) {
            showNotification("Failed to import quotes: " + error.message);
        }
    };
    reader.readAsText(file); // Using readAsText
}

// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('exportQuotes').addEventListener('click', exportQuotes); // Attach export event



async function fetchQuotesFromServer() {
    // Simulating a network request with a promise
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockServerData);
        }, 1000);
    });
}

async function fetchPosts() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
}

// Call the function to fetch posts
fetchPosts();


async function postQuoteToServer(quote) {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST", // Setting the request method to POST
        headers: {
            "Content-Type": "application/json" // Setting the Content-Type header
        },
        body: JSON.stringify(quote) // Sending the quote as JSON
    });
    return await response.json(); // Return the response from the server
}


async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer(); // Fetch latest quotes from server
    const existingQuotes = quotes.map(q => q.text);
    
    serverQuotes.forEach(serverQuote => {
        if (!existingQuotes.includes(serverQuote.text)) {
            quotes.push(serverQuote); // Add new quote from server
        }
    });

    saveQuotes(); // Save updated quotes to local storage
    showNotification("Quotes synchronized with server.");
}

showNotification("Quotes synced with server!"); // Display the notification



// Initialize the application
loadQuotes();
populateCategories();
createAddQuoteForm(); // Create the add quote form
setInterval(checkForUpdates, 10000); // Check for updates every 10 seconds
