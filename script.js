document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'http://54.202.218.249:9501/api/users';

  // Fetch all users when the page loads
  fetchUsers();

  // Form submission handler
  document.getElementById('userForm').addEventListener('submit', handleFormSubmit);

  let isEditing = false;
  let editingUserId = null;

  // Handle form submission
  function handleFormSubmit(event) {
    event.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      const formData = getFormData();
      if (isEditing) {
        updateUser(editingUserId, formData);
      } else {
        createUser(formData);
      }
    } else {
      alert('Please fill in all required fields and correct any validation errors.');
    }
  }

  // Validate form fields
  function validateForm() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address1 = document.getElementById('addressLine1').value.trim();
    const city = document.getElementById('city').value.trim();
    const zipCode = document.getElementById('zipCode').value.trim();
    const country = document.getElementById('country').value.trim();
    const qualification = document.getElementById('qualification').value.trim();
    const comment = document.getElementById('comment').value.trim();

    // Regular expressions for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const zipCodeRegex = /^\d{6}$/;
    const countryRegex = /^[a-zA-Z\s-]+$/;

    // Validation flags
    let isValid = true;

    // Function to show error message and highlight the field
    function showErrorMessage(inputField, message) {
      const errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.textContent = message;
      errorElement.style.color = 'red'; // Set error message color to red

      inputField.style.borderColor = 'red';

      // Check if error message already exists, if not add it
      if (!inputField.parentNode.querySelector('.error-message')) {
        inputField.parentNode.appendChild(errorElement);
      }
    }

    // Function to remove error message and remove highlight from the field
    function removeErrorMessage(inputField) {
      const errorElement = inputField.parentNode.querySelector('.error-message');
      if (errorElement) {
        errorElement.remove();
      }
      inputField.style.borderColor = '';
    }

    // Check if all required fields are filled
    function checkRequired(inputField, fieldName) {
      if (inputField.value === '') {
        showErrorMessage(inputField, `${fieldName} is required.`);
        isValid = false;
      } else {
        removeErrorMessage(inputField);
      }
    }

    // Validate email using regex
    function validateEmail(emailInput) {
      if (!emailRegex.test(emailInput.value)) {
        showErrorMessage(emailInput, 'Invalid email format.');
        isValid = false;
      } else {
        removeErrorMessage(emailInput);
      }
    }

    // Validate phone number using regex
    function validatePhone(phoneInput) {
      if (!phoneRegex.test(phoneInput.value)) {
        showErrorMessage(phoneInput, 'Phone number must be 10 digits.');
        isValid = false;
      } else {
        removeErrorMessage(phoneInput);
      }
    }

    // Validate zip code using regex
    function validateZipCode(zipCodeInput) {
      if (!zipCodeRegex.test(zipCodeInput.value)) {
        showErrorMessage(zipCodeInput, 'Zip code must be 6 digits.');
        isValid = false;
      } else {
        removeErrorMessage(zipCodeInput);
      }
    }


    // Check all required fields
    checkRequired(document.getElementById('firstName'), 'First Name');
    checkRequired(document.getElementById('lastName'), 'Last Name');
    checkRequired(document.getElementById('email'), 'Email');
    checkRequired(document.getElementById('phone'), 'Phone Number');
    checkRequired(document.getElementById('addressLine1'), 'Address Line 1');
    checkRequired(document.getElementById('city'), 'City');
    checkRequired(document.getElementById('zipCode'), 'Zip Code');
    checkRequired(document.getElementById('qualification'), 'Qualification');
    checkRequired(document.getElementById('comment'), 'Comment');

    // Validate specific fields
    validateEmail(document.getElementById('email'));
    validatePhone(document.getElementById('phone'));
    validateZipCode(document.getElementById('zipCode'));

    return isValid;
  }

  // Get form data
  function getFormData() {
    return {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      email: document.getElementById('email').value,
      phoneNumber: document.getElementById('phone').value,
      address1: document.getElementById('addressLine1').value,
      address2: document.getElementById('addressLine2').value,
      city: document.getElementById('city').value,
      state: document.getElementById('state').value,
      zipCode: document.getElementById('zipCode').value,
      country: document.getElementById('country').value,
      qualification: document.getElementById('qualification').value,
      comments: document.getElementById('comment').value
    };
  }

  // Create user
  function createUser(data) {
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(user => {
      appendUserToTable(user);
      alert('User created successfully!');
      fetchUsers(); // Refresh the data after creating a new user
      document.getElementById('userForm').reset(); // Reset the form after successful submission
    })
    .catch(error => console.error('Error:', error));
  }

  // Fetch all users
  function fetchUsers() {
    fetch(apiUrl)
      .then(response => response.json())
      .then(users => {
        const table = document.querySelector('.table tbody');
        table.innerHTML = ''; // Clear the table before appending new data
        users.forEach(user => {
          appendUserToTable(user);
        });
      })
      .catch(error => console.error('Error:', error));
  }

  // Append user to table
  function appendUserToTable(user) {
    const table = document.querySelector('.table tbody');
    const row = document.createElement('tr');
    row.setAttribute('data-id', user.id);
    row.innerHTML = `
      <td>${user.firstName} ${user.lastName}</td>
      <td>${user.email}</td>
      <td>${user.phoneNumber}</td>
      <td><button class="ed" onclick="editUser(${user.id})">Edit</button></td>
      <td><button class="ed" style="background: #f00" onclick="deleteUser(${user.id})">Delete</button></td>
      <td><button class="ed" style="background: #000" onclick="viewUser(${user.id})">View</button></td>
    `;
    table.appendChild(row);
  }

  // Edit user
  window.editUser = function(id) {
    // Fetch user details
    fetch(`${apiUrl}/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        return response.json();
      })
      .then(user => {
        // Populate form fields with user data
        document.getElementById('firstName').value = user.firstName;
        document.getElementById('lastName').value = user.lastName;
        document.getElementById('email').value = user.email;
        document.getElementById('phone').value = user.phoneNumber;
        document.getElementById('addressLine1').value = user.address1;
        document.getElementById('addressLine2').value = user.address2;
        document.getElementById('city').value = user.city;
        document.getElementById('state').value = user.state;
        document.getElementById('zipCode').value = user.zipCode;
        document.getElementById('country').value = user.country;
        document.getElementById('qualification').value = user.qualification;
        document.getElementById('comment').value = user.comments;

        // Change submit button to Update
        isEditing = true;
        editingUserId = id;
        const submitButton = document.querySelector('.submit');
        submitButton.textContent = 'Update';
      })
      .catch(error => console.error('Error:', error));
  };

  // Update user
  function updateUser(id, data) {
    fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.ok) {
        alert('User updated successfully!');
        fetchUsers(); // Refresh the data after updating a user
        resetForm(); // Reset the form after successful update
      } else {
        throw new Error('Failed to update the user');
      }
    })
    .catch(error => console.error('Error:', error));
  }

  // Reset form after successful update
  function resetForm() {
    isEditing = false;
    editingUserId = null;
    const submitButton = document.querySelector('.submit');
    submitButton.textContent = 'Submit';
    document.getElementById('userForm').reset();
  }

  // Delete user
  window.deleteUser = function(id) {
    fetch(`${apiUrl}/${id}`, {
      method: 'DELETE'
    })
    .then(response => {
      if (response.ok) {
        alert('User deleted successfully!');
        fetchUsers(); // Refresh the data after deleting a user
      } else {
        throw new Error('Failed to delete the user');
      }
    })
    .catch(error => console.error('Error:', error));
  };

  // View user
  window.viewUser = function(id) {
    fetch(`${apiUrl}/${id}`)
      .then(response => response.json())
      .then(user => {
        // Populate the modal with user details
        document.getElementById('viewFirstName').textContent = user.firstName;
        document.getElementById('viewLastName').textContent = user.lastName;
        document.getElementById('viewEmail').textContent = user.email;
        document.getElementById('viewPhoneNumber').textContent = user.phoneNumber;
        document.getElementById('viewAddress1').textContent = user.address1;
        document.getElementById('viewAddress2').textContent = user.address2;
        document.getElementById('viewCity').textContent = user.city;
        document.getElementById('viewState').textContent = user.state;
        document.getElementById('viewZipCode').textContent = user.zipCode;
        document.getElementById('viewCountry').textContent = user.country;
        document.getElementById('viewQualification').textContent = user.qualification;
        document.getElementById('viewComments').textContent = user.comments;

        // Show the modal
        const modal = document.getElementById('userModal');
        modal.style.display = 'block';

        // Close modal when 'x' is clicked
        const span = document.getElementsByClassName('close')[0];
        span.onclick = function() {
          modal.style.display = 'none';
        };

        // Close modal when clicking outside the modal content
        window.onclick = function(event) {
          if (event.target == modal) {
            modal.style.display = 'none';
          }
        };
      })
      .catch(error => console.error('Error fetching user details:', error));
  };
});
