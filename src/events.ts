// js/events.js
// Import all necessary functions and DOM elements from other files
import { render, showConfirmDialog, $addCelebrityForm, $newCelebrityNameInput, $newDeathCauseInput, $newDeathDateInput, $celebrityDeathTableBody } from './dom.js';
import { API_URL, fetchCelebrityDeaths } from './api.js';

// Function to handle adding a new celebrity
async function handleAddCelebrity(event: JQuery.SubmitEvent) {
    event.preventDefault();

    const newName = String($newCelebrityNameInput.val() ?? "").trim();
    const newCause = String($newDeathCauseInput.val() ?? "").trim();
    const newDate = $newDeathDateInput.val();

    // Changed to check for falsy values more directly, including empty string
    if (newName && newCause && newDate) {
        const newCelebrity = {
            name: newName,
            causeOfDeath: newCause,
            dateOfDeath: newDate,
            deceased: true
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCelebrity)
            });

            if (response.ok) {
                // Clear input fields only on successful addition
                $newCelebrityNameInput.val("");
                $newDeathCauseInput.val("");
                $newDeathDateInput.val("");
                render(); // Re-render the table to show the new celebrity
            } else {
                // Log more specific error from the API if available
                const errorData = await response.json().catch(() => ({})); // Try to parse error body
                console.error("Failed to add celebrity:", response.status, response.statusText, errorData.message || '');
                // Potentially show a user-friendly error message here
            }
        } catch (error) {
            console.error("Error adding celebrity:", error);
            // Potentially show a user-friendly error message here
        }
    } else {
        console.log("Validation failed: Please fill in all fields.");
        // Potentially show a user-friendly message to the user here (e.g., using an alert or a temporary message on the form)
    }
}

// Function to handle toggling deceased status
async function handleToggleStatus(this: HTMLElement) {
    // Ensure id is parsed as an integer for strict comparison
    const id = parseInt($(this).data("id"), 10);
    // Optimization: Fetch only the specific celebrity if your API supports it,
    // otherwise, the current approach of fetching all and finding is acceptable for small datasets.
    // For demonstration, keeping the original fetchCelebrityDeaths as it might be a simpler API.
    const celebrities = await fetchCelebrityDeaths();
    const celebrityToToggle = celebrities.find((c: any) => c.id === id); // Used strict equality

    if (celebrityToToggle) {
        const updatedStatus = !celebrityToToggle.deceased;
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deceased: updatedStatus })
            });
            if (response.ok) {
                render(); // Re-render the table to show the updated status
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error("Failed to toggle celebrity status:", response.status, response.statusText, errorData.message || '');
            }
        } catch (error) {
            console.error("Error toggling celebrity status:", error);
        }
    } else {
        console.warn(`Celebrity with ID ${id} not found for toggling status.`);
    }
}

// Function to handle deleting a celebrity
function handleDeleteCelebrity(this: HTMLElement) {
    const $thisButton = $(this);
    const id = parseInt($thisButton.data("id"), 10); // Ensure ID is an integer
    const celebrityName = $thisButton.closest("tr").find(".celebrity-text").text();

    showConfirmDialog(`Are you sure you want to delete "${celebrityName}"?`).then(async (result) => {
        if (result) {
            try {
                const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    render(); // Re-render the table after deletion
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    console.error("Failed to delete celebrity:", response.status, response.statusText, errorData.message || '');
                }
            } catch (error) {
                console.error("Error deleting celebrity:", error);
            }
        }
    });
}

// Function to handle editing a celebrity name
async function handleEditCelebrity(this: HTMLElement) {
    const id = parseInt($(this).data("id"), 10); // Ensure ID is an integer
    const $celebritySpan = $(this).closest("tr").find(".celebrity-text");
    const currentText = $celebritySpan.text();
    const $inputField = $(`<input type="text" class="form-control form-control-sm celebrity-edit-input" value="${currentText}">`);

    $celebritySpan.replaceWith($inputField);
    $inputField.focus().select();

    // The $editButton reference should be specific to the current edit action
    // However, since render() will rebuild the row, we don't need to change the button state here.
    // The "Save" button state change should ideally be handled by the rendering logic based on the mode (edit vs view).
    // For now, removing the direct button manipulation here as render() will overwrite it.

    // A flag to prevent multiple saves/renders from rapid keypress/blur
    let isSaving = false;

    // Use .one() to ensure the event listener is only triggered once per edit session
    // This helps prevent multiple AJAX calls or renders if a user rapidly types and blurs
    $inputField.one("keypress blur", async function (event) {
        if (isSaving) return; // Prevent re-entry if already saving

        if (event.type === "blur" || event.key === "Enter") {
            const newText = String($(this).val() ?? "").trim();

            // Check if text has actually changed and is not empty
            if (newText && newText !== currentText) {
                isSaving = true; // Set flag to true

                try {
                    const response = await fetch(`${API_URL}/${id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: newText })
                    });
                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        console.error("Failed to update celebrity name:", response.status, response.statusText, errorData.message || '');
                        // Optionally revert the input field or show error to user
                    }
                } catch (error) {
                    console.error("Error updating celebrity name:", error);
                    // Optionally revert the input field or show error to user
                } finally {
                    isSaving = false; // Reset flag
                    render(); // Re-render the table regardless of save success to revert input to span
                }
            } else {
                render(); // If no change or empty, just re-render to revert input to span
            }
        }
    });
}


// A single function to initialize all event listeners
export function initEvents() {
    $addCelebrityForm.submit(handleAddCelebrity);
    // Use event delegation for dynamic elements in the table body
    $celebrityDeathTableBody.on("click", ".toggleCelebrity", handleToggleStatus);
    $celebrityDeathTableBody.on("click", ".deleteCelebrity", handleDeleteCelebrity);
    $celebrityDeathTableBody.on("click", ".editCelebrity", handleEditCelebrity);
}