//TODO - Adicionar listeners aos btns editar e logout
//TODO - Adicionar liseners às linhas da table.
//TODO - Carregar a img e nome do user logado e data de hoje

// dev = Developer
// sm = Scrum Master
// po = Product Owner

//o id é o taskButton para usar o mesmo css
const addUserButton = document.getElementById("addUserButton");
addUserButton.style.display = "none";

window.onload = function () {
  getUsers();
  if (localStorage.getItem("token") == null) {
    window.location.href = "http://localhost:8080/demo-1.0-SNAPSHOT/";
    //se o user é Product Owner, o botão de adicionar user é mostrado.
  } else if (localStorage.getItem("role") == "po") {
    addUserButton.style.display = "block";
    addUserButton.addEventListener("click", function () {
      window.location.href = "register.html";
    });
  }

  //Vai buscar o userPartial do sessionStorage img e nome do user logado
  const userPartial = JSON.parse(sessionStorage.getItem("userPartial"));
  const firstname = userPartial.firstname;
  //Vai buscar o elemento que mostra o username
  const labelUsername = document.getElementById("displayUsername");
  //Coloca o username no elemento
  labelUsername.textContent = firstname;

  // Get the photoURL from the user and set it as the src of the userIcon element
  const photoURL = userPartial.photourl;
  const userIcon = document.getElementById("userIcon");
  userIcon.src = photoURL;

  //Mostra a data e hora
  displayDateTime(); // Adiciona a exibição da data e hora
  setInterval(displayDateTime, 1000); // Atualiza a cada segundo
};

function generateTable(data) {
  let table = "<table>";
  table +=
    "<th>Photo</th><th>Username</th><th>Firstname</th><th>Lastname</th><th>Email</th><th>Phone</th><tbody>";
  data.forEach((item) => {
    table += `
    <tr>
      <td><img src="${item.photoURL}"/></td>
      <td>${item.username}</td>
      <td>${item.firstname}</td>
      <td>${item.lastname}</td>
      <td>${item.email}</td>
      <td>${item.phone}</td>
    </tr>`;
  });
  table += "</tbody></table>";

  return table;
}

function getUsers() {
  fetch("http://localhost:8080/demo-1.0-SNAPSHOT/rest/user/all", {
    method: "GET",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      token: localStorage.getItem("token"),
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      document.getElementById("users").innerHTML = generateTable(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

let rows = document.getElementsByTagName("tr");
Array.from(rows).forEach((row) => {
  row.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    console.log("Right click");

    contextMenu.style.top = `${e.pageY}px`;
    contextMenu.style.left = `${e.pageX}px`;
    //Guarda o identificador e a prioridade da tarefa
    //contextMenu.setAttribute("data-task-id", task.id);

    //Guarda o identificador da tarefa no sessionStorage
    //sessionStorage.setItem("taskID", task.id);

    //Mostra o popup menu
    contextMenu.style.display = "block";
  });
});

// Function copied from interfacescript.js
//Função que mostra a data e hora
function displayDateTime() {
  const currentDate = new Date();

  //Formata a data e hora
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  };
  const dateTimeString = currentDate.toLocaleDateString("en-US", options);

  // Atualiza o conteúdo do elemento
  dateTimeDisplay.textContent = dateTimeString;
}

editProfileButton.addEventListener("click", function () {
  //Redireciona para a página de editar perfil
  window.location.href = "editProfile.html";
});
botaoLogout = document.getElementById("logoutButton");
botaoLogout.addEventListener("click", function () {
  logout();
});
async function logout() {
  fetch("http://localhost:8080/demo-1.0-SNAPSHOT/rest/user/logout", {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      token: localStorage.getItem("token"),
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      if (data.message === "User is logged out") {
        localStorage.clear();
        sessionStorage.clear();
        // Replace the current history entry
        window.history.replaceState(null, null, "index.html");
        // Reload the page to reflect the changes
        window.location.reload();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      if (error.message.includes("401")) {
        alert("Unauthorized");
      }
    });
}
