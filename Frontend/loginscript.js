window.onload = function () {
  sessionStorage.clear();
  localStorage.clear();
}
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

  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      var form = document.getElementById('loginForm');
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
    localStorage.removeItem("username");
    localStorage.removeItem("password");
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
      .then((response) => response.json()) // parse the response as JSON
      .then((data) => {
        console.log(data); // log the data
        if (data.message === "Valid Login") {
          localStorage.setItem("username", username);
          localStorage.setItem("password", password);
          window.location.href = "interface.html";
        } else {
          alert(data.message);
        }
      })
      .catch((error) => console.error("Error:", error));
  }