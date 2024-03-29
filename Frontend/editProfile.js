/**************************************/
/* on load , fill out the form with placeholders*/
/**************************************/
window.onload = async function () {
  await getUser();

  let ownerOptions = Array.from(document.getElementsByClassName("ownerOption"));
  if (
    localStorage.getItem("token") != null &&
    localStorage.getItem("role") == "po"
  ) {
    // If the user is a Product Owner, show the "Add User" button
    ownerOptions.forEach((element) => {
      element.style.display = "block";
      console.log(element.style.display.value);
    });
  } else {
    ownerOptions.forEach((element) => {
      element.style.display = "none";
      console.log(element.style.display.value);
    });
  }

  if (
    localStorage.getItem("username") != localStorage.getItem("selectedUser")
  ) {
    document.getElementById("changePassword").style.display = "none";
  }
  getUserDataDB();

  //document.getElementById("updatePassword").setAttribute("style", "display: none");
};

function getUserDataDB() {
  fetch("http://localhost:8080/demo-1.0-SNAPSHOT/rest/user/getDetails", {
    method: "GET",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      token: localStorage.getItem("token"),
      selectedUser: localStorage.getItem("selectedUser"),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      fillForm(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
function fillForm(data) {
  console.log(data + "fillForm");

  document.getElementById("username").placeholder = data.username;
  document.getElementById("email").placeholder = data.email;
  document.getElementById("firstname").placeholder = data.firstname;
  document.getElementById("lastname").placeholder = data.lastname;
  document.getElementById("phone").placeholder = data.phone;
  document.getElementById("photo").placeholder = data.photoURL;
  document.getElementById("photoPreview").src = data.photoURL;
  document.getElementById("role").value = data.role;
  // if (
  //   localStorage.getItem("username") !== localStorage.getItem("selectedUser") &&
  //   localStorage.getItem("role") === "po"
  // ) {
  //   document.getElementById("role").value = data.role;
  // }
}

// Get the modal and the cancel button
const modal = document.getElementById("updatePassword");
const cancelButtonPassword = document.getElementById("cancelChangePassword");
const backdrop = document.getElementById("backdrop");
const inputs = document.querySelectorAll("#updatePassword input");
const confirmButton = document.getElementById("confirmChangePassword");
const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");
const oldPassword = document.getElementById("oldPassword");

// Open the password modal when the "Change Password" button is clicked
document
  .getElementById("changePassword")
  .addEventListener("click", function () {
    document.getElementById("updatePassword").style.display = "block";
    backdrop.style.display = "block";
  });

// Update the photo URL when the input value changes
document.getElementById("photo").addEventListener("change", function () {
  document.getElementById("photoPreview").setAttribute("src", this.value);
});

// When the user clicks anywhere outside of the modal, check if it's the cancel button
window.onclick = function (event) {
  if (event.target == cancelButtonPassword) {
    modal.style.display = "none";
    backdrop.style.display = "none";
  }
};

inputs.forEach((input) => {
  input.addEventListener("input", () => {
    var allFilled = Array.from(inputs).every((input) => input.value !== "");
    confirmButton.disabled = !allFilled;
  });
});

confirmButton.addEventListener("click", async function () {
  if (newPassword.value === confirmPassword.value) {
    updatePassword(oldPassword.value, newPassword.value); // Call the function to update the password
  } else {
    newPassword.value = "";
    confirmPassword.value = "";
     await createModal("Passwords do not match.");
  }
});

/**************************************/
/* document listener - for the editProfileForm and submit "Save Changes" button */
/**************************************/
document
  .getElementById("editProfileForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); //*** dp a pull fix things and remove the prevent default */
    // generalize for multiple users
    // *** check if we don't need another UserfromForm class in backend
    updateUser();
  });

/**************************************/
/* function updateUser -  */
/**************************************/
function updateUser() {
  let userFromForm = getUserfromUpdatedFormValues();

  fetch("http://localhost:8080/demo-1.0-SNAPSHOT/rest/user/update", {
    method: "PUT",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      token: localStorage.getItem("token"),
      selectedUser: localStorage.getItem("selectedUser"),
    },
    body: JSON.stringify(userFromForm),
  })
    .then((response) => response.json())
    .then(async (data) => {
      if (data.message === "User is updated") {
         await createModal("User is updated successfully :)");
        if(localStorage.getItem("username") != localStorage.getItem("selectedUser")){
          window.location.href = "interfaceUsers.html";
        } else {
          window.location.href = "interface.html";
        }
      } else {
        if (data.message === "Invalid email format") {
          document.getElementById("email").value = "";
           await createModal("Invalid email format");
        }
        if (data.message === "Invalid phone number format") {
          document.getElementById("phone").value = "";
           await createModal("Invalid phone number format");
        }
        if (data.message === "Invalid URL format") {
          document.getElementById("photo").value = "";
           await createModal("Invalid URL format");
        }
        if (data.message === "Email already exists") {
          document.getElementById("email").value = "";
          await createModal("Email already exists");
        }
      }
    })
    .catch((error) => {
      console.log("There was a problem with the fetch operation", error);
    });
}

document.getElementById("cancelButton").addEventListener("click", function () {
  if (
    localStorage.getItem("role") === "po" &&
    localStorage.getItem("selectedButton") != 0
  ) {
    window.location.href = "interfaceUsers.html";
  } else window.location.href = "interface.html";
});

/**************************************/
/* function getUserfromUpdatedFormValues -  */
/**************************************/
function getUserfromUpdatedFormValues() {
  // gets values from Form
  let username = document.getElementById("username").placeholder; // unique case sends the placeholder
  let email = getValueOrPlaceholder("email");
  let firstname = getValueOrPlaceholder("firstname");
  let lastname = getValueOrPlaceholder("lastname");
  let phone = getValueOrPlaceholder("phone");
  let photoURL = getValueOrPlaceholder("photo");
  let role = document.getElementById("role").value;

  console.log(username, email, firstname, lastname, phone, photoURL, role);

  // get the role from the dropdown

  // turns it into a User
  let userFromForm = {
    username: username,
    email: email,
    firstname: firstname,
    lastname: lastname,
    phone: phone,
    photoURL: photoURL,
    role: role,
  };

  return userFromForm;
}
/**************************************/
/* function getValueOrPlaceholder(elementId) - checks if the elementId has an updated value, otherwise returns "" since it was only placeholder  */
/**************************************/
function getValueOrPlaceholder(elementId) {
  const element = document.getElementById(elementId);
  return element.value === "" ? element.placeholder : element.value;
}

async function getUser() {
  const response = await fetch(
    "http://localhost:8080/demo-1.0-SNAPSHOT/rest/user/getDetails",
    {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
        selectedUser: localStorage.getItem("selectedUser"),
      },
    }
  );

  if (!response.ok) {
    await await createModal("Failed to get user details");
    return;
  }

  const user = await response.json();
  console.log(user);

  // Store the user in the session storage
  sessionStorage.setItem("user", JSON.stringify(user));
}

function updatePassword(oldPassword, newPassword) {
  fetch("http://localhost:8080/demo-1.0-SNAPSHOT/rest/user/updatePassword", {
    method: "PUT",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      token: localStorage.getItem("token"),
    },
    body: JSON.stringify({
      oldPassword: oldPassword,
      newPassword: newPassword,
    }),
  })
    .then(async (response) => {
      if (response.ok) {
        await createModal("Password updated successfully");
        modal.style.display = "none";
        backdrop.style.display = "none";
        window.location.href = "index.html";
      } else {
        await createModal("Failed to update password");
      }
    })
    .catch((error) => {
      console.log("There was a problem with the fetch operation", error);
    });
}

function createModal(message) {
  return new Promise((resolve) => {
    // Add the 'modal-open' class to the body
    document.body.classList.add('modal-open');

    // Create the modal container
    const modal = document.createElement("div");
    modal.className = "modal";

    // Create the modal content
    const content = document.createElement("div");
    content.style.display = "flex";
    content.style.flexDirection = "column";
    content.style.alignItems = "center";
    content.style.justifyContent = "center";

    // Create the message element
    const messageElement = document.createElement("p");
    messageElement.textContent = message;

    // Create the "OK" button
    const button = document.createElement("button");
    button.textContent = "OK";

    // Add an event listener to the "OK" button to remove the modal when clicked
    button.addEventListener("click", () => {
      document.body.removeChild(modal);
      // Remove the 'modal-open' class from the body
      document.body.classList.remove('modal-open');
      resolve();
    });

    // Append the message and button to the content
    content.appendChild(messageElement);
    content.appendChild(button);

    // Append the content to the modal
    modal.appendChild(content);

    // Append the modal to the body
    document.body.appendChild(modal);

    // Display the modal
    modal.style.display = "flex";
  });
}