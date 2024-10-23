let modalHeader, yesButtonText, noButtonText, yesButtonColor, noButtonColor, buttonLayout, buttonCount, icon, iconColor, yesAction, noAction;

// Create and append modal dynamically
function createModal() {
    const modalDiv = document.createElement('div');
    modalDiv.id = "permModal";
    modalDiv.className = "modal";

    const modalContent = document.createElement('div');
    modalContent.className = "modal-content";

    const closeButton = document.createElement('span');
    closeButton.className = "close";
    closeButton.innerHTML = "&times;";
    closeButton.onclick = closeModal;

    const modalHeaderElement = document.createElement('p');
    modalHeaderElement.className = "modal-header";

    // Create icon element
    const iconElement = document.createElement('i');
    iconElement.className = `fa-solid ${icon}`; // Use the dynamic icon class
    iconElement.style.color = iconColor; // Set icon color

    // Append icon and text to the header
    modalHeaderElement.appendChild(iconElement);
    modalHeaderElement.appendChild(document.createTextNode(modalHeader)); // Append text after icon

    const buttonContainer = document.createElement('div');
    buttonContainer.className = "button-container";

    // Set layout for buttons
    if (buttonLayout === 'horizontal') {
        buttonContainer.classList.add('button-container-horizontal');
    }

    if (buttonCount === 1) {
        const yesButton = document.createElement('button');
        yesButton.className = "button shift-right"; // Shift to the right
        yesButton.innerText = yesButtonText;
        yesButton.style.backgroundColor = yesButtonColor;
        yesButton.onclick = function() { 
            yesAction(); // Execute the provided yesAction
            closeModal(); // Close modal after action
        };
        buttonContainer.appendChild(yesButton);
    } else if (buttonCount === 2) {
        const yesButton = document.createElement('button');
        yesButton.className = "button";
        yesButton.innerText = yesButtonText;
        yesButton.style.backgroundColor = yesButtonColor;
        yesButton.onclick = function() { 
            yesAction(); // Execute the provided yesAction
            closeModal(); // Close modal after action
        };

        const noButton = document.createElement('button');
        noButton.className = "button";
        noButton.innerText = noButtonText;
        noButton.style.backgroundColor = noButtonColor;
        noButton.onclick = function() { 
            noAction(); // Execute the provided noAction
            closeModal(); // Close modal after action
        };

        buttonContainer.appendChild(yesButton);
        buttonContainer.appendChild(noButton);
    }

    modalContent.appendChild(closeButton);
    modalContent.appendChild(modalHeaderElement);
    modalContent.appendChild(buttonContainer);
    modalDiv.appendChild(modalContent);

    document.body.appendChild(modalDiv);
}

// Modal functions
function openModal(header, yesText, noText, yesColor, noColor, layout, count, modalIcon, modalIconColor, yesCallback, noCallback) {
    modalHeader = header;
    yesButtonText = yesText;
    noButtonText = noText;
    yesButtonColor = yesColor;
    noButtonColor = noColor;
    buttonLayout = layout; // Set button layout type
    buttonCount = count; // Set number of buttons
    icon = modalIcon; // Set icon class
    iconColor = modalIconColor; // Set icon color
    yesAction = yesCallback; // Set the yes button action
    noAction = noCallback; // Set the no button action
    
    createModal(); // Create modal with the specified parameters
    document.getElementById("permModal").style.display = "block"; // Show the modal
}

function closeModal() {
    document.getElementById("permModal").style.display = "none";
    // Remove modal from DOM to avoid duplication
    const modal = document.getElementById("permModal");
    if (modal) {
        modal.remove();
    }
}
