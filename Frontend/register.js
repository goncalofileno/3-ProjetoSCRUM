window.onload = function () {
  const photoPreview = document.getElementById("photoPreviewRegister");
  // Set the initial image source
  photoPreview.src = "https://cdn-icons-png.flaticon.com/512/6388/6388000.png";

  // Check if the user is logged in and is a Product Owner
  if (
    localStorage.getItem("token") != null &&
    localStorage.getItem("role") == "po"
  ) {
    // If the user is a Product Owner, show the "Add User" button
    Array.from(document.getElementsByClassName("ownerOption")).forEach(
      (element) => {
        element.style.display = "block";
      }
    );
  }
};

// Get the photo URL input field and the image
const photoInput = document.getElementById("photo");
const photoPreview = document.getElementById("photoPreviewRegister");

// Listen for changes to the photo URL input field
photoInput.addEventListener("input", function () {
  // When the field's value changes, update the image source
  photoPreview.src = photoInput.value;
});

document
  .getElementById("cancelButtonRegister")
  .addEventListener("click", function (event) {
    event.preventDefault();
    //Redireciona para a página de login
    window.location.href = "index.html";
  });

document
  .getElementById("registerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let email = document.getElementById("email").value;
    let firstname = document.getElementById("firstname").value;
    let lastname = document.getElementById("lastname").value;
    let phone = document.getElementById("phone").value;
    let photoURL = document.getElementById("photo").value;

    let user = {
      username: username,
      password: password,
      email: email,
      firstname: firstname,
      lastname: lastname,
      phone: phone,
      photoURL: photoURL,
    };

    if (
      localStorage.getItem("role") == "po" &&
      localStorage.getItem("token") != null
    ) {
      let roleChoice = document.getElementById("role").value;
      addUserPO(user, roleChoice);
    } else addUser(user);
    //Redireciona para a página de login
    //window.location.href = "index.html";
  });

async function addUser(user) {
  const response = await fetch(
    "http://localhost:8080/demo-1.0-SNAPSHOT/rest/user/add",
    {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }
  );

  const data = await response.json();

  if (response.status === 200 && data.message === "A new user is created") {
    alert("User is added successfully :)");
    window.location.href = "index.html";
  } else {
    alert(data.message); // show the error message
    if (response.status === 400) {
      if (data.message === "One or more parameters are null or blank") {
        // clear all fields
        document.getElementById("username").value = "";
        document.getElementById("email").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("photoURL").value = "";
      } else if (data.message === "Invalid email format") {
        document.getElementById("email").value = "";
      } else if (data.message === "Invalid phone number format") {
        document.getElementById("phone").value = "";
      } else if (data.message === "Invalid URL format") {
        document.getElementById("photoURL").value = "";
      }
    } else if (
      response.status === 409 &&
      data.message === "Invalid Username or Email"
    ) {
      document.getElementById("username").value = "";
      document.getElementById("email").value = "";
    }
  }
}

async function addUserPO(user, roleChoice) {
  const response = await fetch(
    "http://localhost:8080/demo-1.0-SNAPSHOT/rest/user/add",
    {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
        role: roleChoice,
      },
      body: JSON.stringify(user),
    }
  );

  const data = await response.json();

  if (response.status === 200 && data.message === "A new user is created") {
    alert("User is added successfully :)");
    window.location.href = "index.html";
  } else {
    alert(data.message); // show the error message
    if (response.status === 400) {
      if (data.message === "One or more parameters are null or blank") {
        // clear all fields
        document.getElementById("username").value = "";
        document.getElementById("email").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("photoURL").value = "";
      } else if (data.message === "Invalid email format") {
        document.getElementById("email").value = "";
      } else if (data.message === "Invalid phone number format") {
        document.getElementById("phone").value = "";
      } else if (data.message === "Invalid URL format") {
        document.getElementById("photoURL").value = "";
      }
    } else if (
      response.status === 409 &&
      data.message === "Invalid Username or Email"
    ) {
      document.getElementById("username").value = "";
      document.getElementById("email").value = "";
    }
  }
}
