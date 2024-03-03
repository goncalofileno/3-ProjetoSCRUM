window.onload = function () {
  sessionStorage.clear();
  localStorage.clear();
};
//Ao clicar no botão de login, o username é armazenado na sessionStorage e o usuário é redirecionado para a página de interfacedocument
document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    //Armazena o username na sessionStorage
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    loginUser(username, password);
  });

window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    var form = document.getElementById("loginForm");
    form.reset();
  }
});

document
  .getElementById("registerButton")
  .addEventListener("click", function (event) {
    event.preventDefault();
    //Redireciona para a página de registro
    window.location.href = "register.html";
  });

function loginUser(username, password) {
  fetch("http://localhost:8080/demo-1.0-SNAPSHOT/rest/user/login", {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      username: username,
      password: password,
    },
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json(); // parse the response as JSON
    })
    .then((data) => {
      console.log(data); // log the data
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", username);
      window.location.href = "interface.html";
    })
    .catch((error) => {
      if (error.message.includes("401")) {
        createModal("Invalid username or password.");
      } else if (error.message.includes("403")) {
        createModal("User is desactivated, please contact the admin.");
      }
    });
}

function createModal(message) {
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
}