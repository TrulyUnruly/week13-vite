// Import the API function needed to get data for rendering
import { fetchCelebrityDeaths } from './api.js';

// Declare variables to hold DOM references, but don't initialize them yet
// We will initialize them once the DOM is ready.
export let $addCelebrityForm: JQuery<HTMLElement>;
export let $newCelebrityNameInput: JQuery<HTMLElement>;
export let $newDeathCauseInput: JQuery<HTMLElement>;
export let $newDeathDateInput: JQuery<HTMLElement>;
export let $celebrityDeathTableBody: JQuery<HTMLElement>;

// Function to initialize DOM elements once the DOM is ready
// This function should be called from index.ts inside $(document).ready()
export function initializeDOMElements() {
    $addCelebrityForm = $("#addCelebrityForm");
    $newCelebrityNameInput = $("#newCelebrityName");
    $newDeathCauseInput = $("#newDeathCause");
    $newDeathDateInput = $("#newDeathDate");
    $celebrityDeathTableBody = $("#celebrityDeathTable tbody");

    // Optional: Add a check to ensure elements are found (for debugging)
    if ($celebrityDeathTableBody.length === 0) {
        console.error("Error: #celebrityDeathTable tbody not found in the DOM. Check your HTML structure.");
    }
}


/* Function to display the celebrity deaths in the HTML table */
export async function render() {
    // Check if $celebrityDeathTableBody has been initialized. This is a safeguard.
    // In a correct setup, initializeDOMElements() will have already been called.
    if (!$celebrityDeathTableBody || $celebrityDeathTableBody.length === 0) {
        console.error("render() called before $celebrityDeathTableBody was initialized or found.");
        return; // Prevent further errors if DOM element is missing
    }

    $celebrityDeathTableBody.empty();
    const celebrities = await fetchCelebrityDeaths();

    // Check if celebrities is an array before sorting and iterating
    if (!Array.isArray(celebrities)) {
        console.error("fetchCelebrityDeaths did not return an array:", celebrities);
        return; // Stop rendering if data is not an array
    }

    celebrities.sort((a: any, b: any) => parseInt(a.id) - parseInt(b.id));

    celebrities.forEach(function (celebrity: { id: string; name: string; causeOfDeath: string; dateOfDeath: string; deceased: boolean }, index: number) {
        const deceasedClass = celebrity.deceased ? "deceased-text" : "";
        const statusText = celebrity.deceased ? "Deceased" : "Alive";
        const toggleButtonText = celebrity.deceased ? "Mark Alive" : "Mark Deceased";
        const toggleButtonClass = celebrity.deceased ? "btn-warning" : "btn-success";

        let celebrityItemRow = `
            <tr id="celebrity-row-${celebrity.id}">
                <th scope="row">${index + 1}</th>
                <td><span class="celebrity-text ${deceasedClass}">${celebrity.name}</span></td>
                <td>${celebrity.causeOfDeath}</td>
                <td>${celebrity.dateOfDeath}</td>
                <td>${statusText}</td>
                <td>
                    <button class="btn btn-sm btn-secondary editCelebrity me-1" data-id="${celebrity.id}">Edit</button>
                    <button class="btn btn-sm ${toggleButtonClass} toggleCelebrity me-1" data-id="${celebrity.id}">${toggleButtonText}</button>
                    <button class="btn btn-sm btn-danger deleteCelebrity" data-id="${celebrity.id}">Delete</button>
                </td>
            </tr>`;
        $celebrityDeathTableBody.append(celebrityItemRow);
    });
}

// Custom Confirmation Dialog using Bootstrap (No changes needed here, as it's typically called within an event listener)
export function showConfirmDialog(message: string) {
    return new Promise((resolve) => {
        const $modal = $(`
            <div class="modal fade show d-block" tabindex="-1" role="dialog" style="background-color: rgba(0,0,0,0.5);">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Confirm Action</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>${message}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="confirmNo">No</button>
                            <button type="button" class="btn btn-primary" id="confirmYes">Yes</button>
                        </div>
                    </div>
                </div>
            </div>
        `);
        $("body").append($modal);

        $("#confirmYes").on("click", function () {
            $modal.remove();
            resolve(true);
        });

        $("#confirmNo, .modal .btn-close").on("click", function () {
            $modal.remove();
            resolve(false);
        });
    });
}