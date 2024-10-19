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

// Simulate fetching quotes from the server
function fetchServerQuotes() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockServerData);
        }, 1000);
    });
}

// Check for updates from the server
async function checkForUpdates() {
    const serverQuotes = await fetchServerQuotes();
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

// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Initialize the application
loadQuotes();
populateCategories();
createAddQuoteForm(); // Create the add quote form
setInterval(checkForUpdates, 10000); // Check for updates every 10 seconds
