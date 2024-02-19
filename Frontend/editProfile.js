/**************************************/
/* on load , fill out the form with placeholders*/
/**************************************/
window.onload = async function () {
  await getUser();
  const user = JSON.parse(sessionStorage.getItem("user"));
  let n_stars = 12;
  document.getElementById("username").placeholder = user.username;
  
  document.getElementById("email").placeholder = user.email;
  document.getElementById("firstname").placeholder = user.firstname;
  document.getElementById("lastname").placeholder = user.lastname;
  document.getElementById("phone").placeholder = user.phone;
  document.getElementById("photo").placeholder = user.photoURL;

  document.getElementById("photoPreview").src = user.photoURL;

  //document.getElementById("updatePassword").setAttribute("style", "display: none");
};

// Get the modal and the cancel button
const modal = document.getElementById('updatePassword');
const cancelButtonPassword = document.getElementById('cancelChangePassword');
const backdrop = document.getElementById('backdrop');
const inputs = document.querySelectorAll('#updatePassword input');
const confirmButton = document.getElementById('confirmChangePassword');
const newPassword = document.getElementById('newPassword');
const confirmPassword = document.getElementById('confirmPassword');
const oldPassword = document.getElementById('oldPassword');

// Open the password modal when the "Change Password" button is clicked
document.getElementById("changePassword").addEventListener("click", function() {
  document.getElementById("updatePassword").style.display = "block";
  backdrop.style.display = "block";
});

 // Update the photo URL when the input value changes
 document.getElementById("photo").addEventListener("change", function() {
  document.getElementById("photoPreview").setAttribute("src", this.value);
});

// When the user clicks anywhere outside of the modal, check if it's the cancel button
window.onclick = function(event) {
  if (event.target == cancelButtonPassword) {
    modal.style.display = "none";
    backdrop.style.display = "none";
  }
}

inputs.forEach(input => {
  input.addEventListener('input', () => {
    var allFilled = Array.from(inputs).every(input => input.value !== '');
    confirmButton.disabled = !allFilled;
  });
});

confirmButton.addEventListener('click', function() {
  if (newPassword.value === confirmPassword.value) {
    updatePassword(oldPassword.value, newPassword.value); // Call the function to update the password
  } else {
    newPassword.value = '';
    confirmPassword.value = '';
    alert('The new passwords do not match.');
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

    console.log(userFromForm);
    console.log("This data was in the form:\n" + JSON.stringify(userFromForm));

    fetch("http://localhost:8080/demo-1.0-SNAPSHOT/rest/user/update", {
        method: "PUT",
        headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            username: localStorage.getItem("username"),
            password: localStorage.getItem("password"),
        },
        body: JSON.stringify(userFromForm),
    })
    .then(response => response.json())
    .then(data => {
        console.log("This data was received:\n" + JSON.stringify(data));
        if (data.message === "User is updated") {
            alert("User updated successfully");
            window.location.href = "interface.html";
        } else {
            if(data.message === "Invalid email format"){
                document.getElementById("email").value = "";
                alert("Invalid email format");
            }
            if(data.message === "Invalid phone number format"){
                document.getElementById("phone").value = "";
                alert("Invalid phone number format");
            }
            if(data.message === "Invalid URL format"){
                document.getElementById("photo").value = "";
                alert("Invalid URL format");
            }
            if(data.message === "Email already exists"){
                document.getElementById("email").value = "";
                alert("Email already exists");
            }
        }

    })
    .catch(error => {
        console.log("There was a problem with the fetch operation", error);
    });
}

document.getElementById("cancelButton").addEventListener("click", function () {
  window.location.href = "interface.html";
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

  // turns it into a User
  let userFromForm = {
    username: username,
    email: email,
    firstname: firstname,
    lastname: lastname,
    phone: phone,
    photoURL: photoURL,
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
        username: localStorage.getItem("username"),
        password: localStorage.getItem("password"),
      },
    }
  );

  if (!response.ok) {
    alert("Failed to fetch user");
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
      username: localStorage.getItem("username"),
      password: localStorage.getItem("password"),
    },
    body: JSON.stringify({
      oldPassword: oldPassword,
      newPassword: newPassword,
    }),
  })
    .then((response) => {
      if (response.ok) {
        alert("Password updated successfully");
        modal.style.display = "none";
        backdrop.style.display = "none";
        window.location.href = "index.html";
      } else {
        alert("Failed to update password");
      }
    })
    .catch((error) => {
      console.log("There was a problem with the fetch operation", error);
    });
}
