const serviceForm = document.getElementById('serviceForm');
const serviceList = document.getElementById('serviceList');
let serviceIndexToDelete = null; // Holds the index of the service to be deleted

let services = JSON.parse(localStorage.getItem('services')) || [];

function renderServices() {
    serviceList.innerHTML = '';
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
});


// Function to display the infoBox with service information
function viewService(index) {
    const service = services[index];
    const infoBox = document.getElementById('infoBox');
    const infoBoxBody = document.getElementById('infoBoxBody');
    
    // Set the innerHTML for the infoBox content directly
    infoBoxBody.innerHTML = `
        <h3 class="info-head">Service Information</h3>
        <label class="form-label">Service Name:</label>
        <div class="form-value">${service.name}</div>
        
        <label class="form-label">Email:</label>
        <div class="form-value">${service.email}</div>
        
        <label class="form-label">Password:</label>
        <div class="form-value">${service.password}</div>

        <button class="closebtn"  onclick="closeInfoBox()">Close</button>
    `;
    
    // Display the infoBox
    infoBox.style.display = "block";
}

// Function to open the info box
function openInfoBox() {
    document.querySelector('.infoBox').style.display = 'block';
}

// Function to close the info box
function closeInfoBox() {
    document.querySelector('.infoBox').style.display = 'none';
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
        function() { confirmDelete(index); }, // Confirm deletion
        closeModal    // Cancel deletion
    );
}

// Function to actually delete the service after confirmation
function confirmDelete() {
    if (serviceIndexToDelete !== null) {
        services.splice(serviceIndexToDelete, 1);
        localStorage.setItem('services', JSON.stringify(services));
        renderServices();
        closeModal(); // Close modal after deleting
        serviceIndexToDelete = null; // Reset index after deletion
    }
}

// Function to edit a service
function editService(index) {
    openModal(
        `Are you sure you want to edit ${services[index].name.replace(/"/g, '&quot;')}?`, 
        'I want', 
        'Cancel', 
        '#5cb85c', 
        '#d9534f', 
        'vertical', 
        2, 
        'fa-regular fa-pen-to-square', 
        '#c9302c', 
        function() {     
            const service = services[index];
            document.getElementById('serviceName').value = service.name;
            document.getElementById('email').value = service.email;
            document.getElementById('password').value = service.password;
        
            // Optionally, remove the service from the array if you want to "replace" it upon form submission
            services.splice(index, 1); // This will delete the service without triggering a modal }, // Confirm deletion
        },
        closeModal    // Cancel deletion
    );


}

// Initial render of services
renderServices();

// eye funtion of the password input
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', function() {
    // Toggle the type attribute
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Toggle the eye icon
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});

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

// Event listener for input field
document.getElementById('searchService').addEventListener('input', filterServices);

// Event listener for "Enter" keypress
document.getElementById('searchService').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();  // Prevent the default form submission
        filterServices();        // Call the filter function when Enter is pressed
    }
});
