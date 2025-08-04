// Import the main functions from our modular files
import { render, initializeDOMElements } from './dom.js'; // <-- Import initializeDOMElements
import { initEvents } from './events.js';

// ensures that the DOM is fully loaded before running the script
$(document).ready(function () {
    // FIRST: Initialize all DOM element references
    initializeDOMElements(); // <-- Call this first!

    // THEN: Call the render function to populate the table on page load
    render();

    // THEN: Initialize all event listeners (they now have valid DOM references)
    initEvents();
});