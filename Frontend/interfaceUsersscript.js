//TODO - Adicionar listeners às linhas da table.

// dev = Developer
// sm = Scrum Master
// po = Product Owner

//o id é o taskButton para usar o mesmo css
const addUserButton = document.getElementById("addUserButton");
addUserButton.style.display = "none";

window.onload = function () {
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
  getUsers();
};

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
      document.getElementById("tableContainer").innerHTML =
        generateDivTable(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

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

///////////////////////// TABLE //////////////////////////
function generateDivTable(data) {
  // Start of the table
  let table = [
    "<div class='table t-design'>",
    "<div class='row header'><div>Photo</div><div>Username</div><div>Firstname</div><div>Lastname</div><div>Email</div><div>Phone</div></div>",
  ];

  // Generate the rows
  let rows = data.map(
    (item) => `
    <div class="row element">
      <div class="row-img"><img src="${item.photoURL}"/></div>
      <div>${item.username}</div>
      <div>${item.firstname}</div>
      <div>${item.lastname}</div>
      <div>${item.email}</div>
      <div>${item.phone}</div>
    </div>
  `
  );

  // Add the rows to the table
  table.push(...rows);
  // End of the table
  table.push("</div>");
  // Join the table array into a string and return it
  let tableHTML = table.join("");
  // Add the table to the DOM
  tableContainer.innerHTML = tableHTML;
  // Now that the new rows are in the DOM, you can add event listeners to them
  let rowElement = tableContainer.querySelectorAll(".row.element");
  rowElement.forEach((row) => {
    row.addEventListener("contextmenu", function (e) {
      // This function will be called when a row is clicked
      // `this` refers to the clicked row
      e.preventDefault();
      const contextMenu = document.getElementById("contextMenu");
      contextMenu.style.top = e.clientY + "px";
      contextMenu.style.left = e.clientX + "px";
      contextMenu.style.display = "block";
    });
  });

  return tableHTML;
}
///////////////////////// TABLE //////////////////////////
