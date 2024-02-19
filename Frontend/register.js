window.onload = function () {
  const photoPreview = document.getElementById("photoPreviewRegister");
  // Set the initial image source
  photoPreview.src = "https://cdn-icons-png.flaticon.com/512/6388/6388000.png";
};

// Get the photo URL input field and the image
const photoInput = document.getElementById('photo');
const photoPreview = document.getElementById('photoPreviewRegister');

// Listen for changes to the photo URL input field
photoInput.addEventListener('input', function() {
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

    addUser(user);
    //Redireciona para a página de login
    //window.location.href = "index.html";
  });

async function addUser(user) {
  await fetch("http://localhost:8080/demo-1.0-SNAPSHOT/rest/user/add", {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then((response) => response.json()) // parse the response as JSON
    .then((data) => {
      if (data.message === "A new user is created") {
        alert("User is added successfully :)");
        window.location.href = "index.html";
      } else {
        alert(data.message); // show the error message
        if (data.message === "Invalid Username") {
          document.getElementById("username").value = "";
        } else if (data.message === "Email already exists") {
          document.getElementById("email").value = "";
        } else if (data.message === "Invalid email format" || data.message === "Invalid phone number format" || data.message === "Invalid URL format") {
          document.getElementById("email").value = "";
          document.getElementById("phone").value = "";
          document.getElementById("photoURL").value = "";
        }
      }
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}