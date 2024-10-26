function showNotification(message, bgColor = '#5cb85c', icon = '') {
    const notification = document.getElementById('notification');
    
    // Set the message and styles
    notification.innerHTML = `${icon} ${message}`; // Set message with icon
    notification.style.backgroundColor = bgColor; // Set background color
    notification.style.display = 'block'; // Show the notification

    // Hide the notification after 3 seconds
    setTimeout(() => {
        notification.style.display = 'none'; // Hide the notification
    }, 3000);
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        // Use the modern clipboard API
        navigator.clipboard.writeText(text)
            .then(() => showNotification('Copied to clipboard', '#5cb85c', '<i class="fas fa-check"></i>'))
            .catch(err => showNotification('Failed to copy text', '#d9534f', '<i class="fas fa-exclamation-triangle"></i>'))
    } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand("copy");
            showNotification('Copied to clipboard', '#5cb85c', '<i class="fas fa-check"></i>')
        } catch (err) {
            showNotification('Failed to copy text', '#d9534f', '<i class="fas fa-exclamation-triangle"></i>');
        }
        document.body.removeChild(textArea);
    }
}

// eye funtion of the password input
const toggleIcon = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
toggleIcon.addEventListener('click', function() {
    togglePasswordVisibility(passwordInput, toggleIcon);
});

// Function to dynamically toggle password visibility
function togglePasswordVisibility(passwordInput, toggleIcon) {
    // Toggle the type attribute
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Toggle the eye icon
    toggleIcon.classList.toggle('fa-eye');
    toggleIcon.classList.toggle('fa-eye-slash');
}

// Function to filter services
function filterServices() {
    let searchQuery = document.getElementById('searchService').value.toLowerCase();
    let services = document.querySelectorAll('#serviceList li');

    services.forEach(function(service) {
        let serviceName = service.querySelector('span').textContent.toLowerCase();
        if (serviceName.includes(searchQuery)) {
            service.style.display = ''; // Show service if it matches
        } else {
            service.style.display = 'none'; // Hide service if it doesn't match
        }
    });
}

// Select search icon and add event listener for click
const searchIcon = document.getElementById('searchIcon');
searchIcon.addEventListener('click', filterServices);



// Event listener for input field
document.getElementById('searchService').addEventListener('input', filterServices);

// Event listener for "Enter" keypress
document.getElementById('searchService').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();  // Prevent the default form submission
        filterServices();        // Call the filter function when Enter is pressed
    }
});

const serviceForm = document.getElementById('serviceForm');
const serviceList = document.getElementById('serviceList');
let serviceIndexToDelete = null; // Holds the index of the service to be deleted

let services = JSON.parse(localStorage.getItem('services')) || [];

function renderServices() {
    serviceList.innerHTML = '';

    // Check if services array is not empty
    if (services.length === 0) {
        return false; // No services to render
    }

    services.forEach((service, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${service.name}</span>
            <div>
                <button class="view-btn" onclick="viewService(${index})">View</button>
                <button class="edit-btn" onclick="editService(${index})">Edit</button>
                <button class="delete-btn" onclick="deleteService(${index})">Delete</button>
            </div>
        `;
        serviceList.appendChild(li);
    });

    return true; // Services rendered successfully
}



// Function to add a new service
serviceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newService = {
        name: document.getElementById('serviceName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    services.push(newService);
    localStorage.setItem('services', JSON.stringify(services));
    renderServices();
    serviceForm.reset();
    if (renderServices = true) {
        // Show notification for successful addition
        showNotification('Added successfully!', '#5cb85c', '<i class="fas fa-check"></i>');
    } else {
        // Show notification for duplicate service
        showNotification('Failed to add!', '#d9534f', '<i class="fas fa-exclamation-triangle"></i>');
    }
});


// Function to open the info box
function openInfoBox() {
    document.querySelector('.infoBox').style.display = 'block';
}

// Function to close the info box
function closeInfoBox() {
    document.querySelector('.infoBox').style.display = 'none';
}

// Function to display the infoBox with service information
function viewService(index) {
    const service = services[index];
    const infoBox = document.getElementById('infoBox');
    const infoBoxBody = document.getElementById('infoBoxBody');
    
    // Set the innerHTML for the infoBox content with clickable icons for copying
    infoBoxBody.innerHTML = `
        <h3 class="info-head">Service Information</h3>
        
        <label class="form-label">Service Name:</label>
        <div class="form-value">${service.name}</div>
        
        <label class="form-label">Email:</label>
        <div class="form-value">
            ${service.email}
            <i class="fas fa-copy copy-icon" onclick="copyToClipboard('${service.email}')"></i>
        </div>
        
        <label class="form-label">Password:</label>
        <div class="form-value">
            ${service.password}
            <i class="fas fa-copy copy-icon" onclick="copyToClipboard('${service.password}')"></i>
        </div>

        <button class="closebtn" onclick="closeInfoBox()">Close</button>
    `;
    
    // Display the infoBox
    infoBox.style.display = "block";
}

function deleteService(index) {
    serviceIndexToDelete = index; // Set the service index to delete
    openModal(
        `Are you sure you want to delete ${services[index].name.replace(/"/g, '&quot;')}?`, 
        'Yes', 
        'No', 
        '#5cb85c', 
        '#d9534f', 
        'horizontal', 
        2, 
        'fa-trash-can', 
        '#c9302c', 
        function() { 
            // Function to actually delete the service after confirmation
            if (serviceIndexToDelete !== null) {
                services.splice(serviceIndexToDelete, 1);
                localStorage.setItem('services', JSON.stringify(services));
                renderServices();
                closeModal(); // Close modal after deleting
                serviceIndexToDelete = null; // Reset index after deletion
            }
         }, // Confirm deletion
        closeModal    // Cancel deletion
    );
}

// Function to update the service information
function updateService(index) {
    const name = document.getElementById('editServiceName').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const password = document.getElementById('editPassword').value.trim();

    // Get the existing service data
    const existingService = services[index];

    // Check if the new values are the same as the existing values
    if (
        name === existingService.name ||
        email === existingService.email ||
        password === existingService.password
    ) {
        // Show a notification if no changes were made
        showNotification('No changes detected!', '#d9534f', '<i class="fas fa-exclamation-triangle"></i>');
        return; // Exit the function if no changes
    }

    // Proceed with updating the service since changes are detected
    const updatedService = { name, email, password };

    // Update the service in the array and save to localStorage
    services[index] = updatedService;
    localStorage.setItem('services', JSON.stringify(services));

    // Re-render the service list and close the info box
    renderServices();
    closeInfoBox();

    // Show a notification for successful update
    showNotification('Service updated successfully!', '#5cb85c', '<i class="fas fa-check"></i>');
}

// Function to edit a service
function editService(index) {
    const service = services[index];

    // Set the content of the info box with editable fields
    const infoBox = document.getElementById('infoBox');
    const infoBoxBody = document.getElementById('infoBoxBody');

    infoBoxBody.innerHTML = `
        <h3 class="info-head">Edit Service</h3>
        <div class="edit-box">
            <label class="form-label">Service Name:</label>
            <input type="text" class="form-value" id="editServiceName" value="${service.name}">
            
            <label class="form-label">Email:</label>
            <input type="email" class="form-value" id="editEmail" value="${service.email}">
            
            <label class="form-label">Password:</label>
            <div class="password-container">
                <input type="password" class="password" id="editPassword" value="${service.password}" required>
                <i class="fas fa-eye toggle-password" id="toggleEditPassword"></i>
            </div>
        </div>
        <button class="update-btn" onclick="updateService(${index})">Update</button>
        <button class="closebtn" onclick="closeInfoBox()">Close</button>
    `;

    // Add event listener for the toggle password icon
    const toggleEditPassword = document.getElementById('toggleEditPassword');
    const editPasswordInput = document.getElementById('editPassword');

    toggleEditPassword.addEventListener('click', function() {
        togglePasswordVisibility(editPasswordInput, toggleEditPassword);
    });

    // Display the info box
    infoBox.style.display = "block";
}

// Initial render of services
renderServices();
