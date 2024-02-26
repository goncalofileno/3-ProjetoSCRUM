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

  if (localStorage.getItem("deletedTasks") === "true") {
    document.getElementById("tableContainer").innerHTML = displayDeletedTasks();
  } else {
    document.getElementById("tableContainer").innerHTML = displayUsers();
  }
};

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

async function displayUsers() {
  // Fetch users from the server
  const response = await fetch(
    "http://localhost:8080/demo-1.0-SNAPSHOT/rest/user/all", // Change this to your users API endpoint
    {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    }
  );
  if (!response.ok) {
    alert("Failed to fetch users");
    return;
  }
  let users = await response.json();

  // Get the tableContainer element
  const tableContainer = document.getElementById("tableContainer");

  // Start of the table
  let table = [
    "<div class='table t-design'>",
    "<div class='row header'><div>Photo</div><div>Username</div><div>First Name</div><div>Last Name</div><div>Email</div><div>Phone</div></div>", // Change this to your user fields
  ];

  // Generate the rows
  let rows = users.map(
    (user) => `
    <div class="row element">
      <div><img src="${user.photoURL}" class="userPhoto"></div>
      <div>${user.username}</div>
      <div>${user.firstname}</div>
      <div>${user.lastname}</div>
      <div>${user.email}</div>
      <div>${user.phone}</div>
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
  // If the user is a Product Owner, add event listeners to the rows
  if (localStorage.getItem("role") === "po") {
    // Now that the new rows are in the DOM, you can add event listeners to them
    let rowElement = tableContainer.querySelectorAll(".row.element");
    rowElement.forEach((row) => {
      row.addEventListener("contextmenu", function (e) {
        // This function will be called when a row is clicked
        // `this` refers to the clicked row
        e.preventDefault();
        // Show the context menu
        const contextMenu1 = document.getElementById("contextMenu1");
        contextMenu1.style.top = `${e.clientY}px`;
        contextMenu1.style.left = `${e.clientX}px`;
        contextMenu1.style.display = "block";
      });
    });
  }
  return tableHTML;
}
///////////////////////// TABLE //////////////////////////

async function displayDeletedTasks() {
  // Fetch tasks from the server
  const response = await fetch(
    "http://localhost:8080/demo-1.0-SNAPSHOT/rest/task/all",
    {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    }
  );
  if (!response.ok) {
    alert("Failed to fetch tasks");
    return;
  }
  let tasks = await response.json();

  // Filter out tasks that are active
  tasks = tasks.filter((task) => task.active === false);

  // Get the tableContainer element
  const tableContainer = document.getElementById("tableContainer");

  // Start of the table
  let table = [
    "<div class='table t-design'>",
    "<div class='row header'><div>Title</div><div>Description</div><div>Initial Date</div><div>Final Date</div><div>Owner</div><div>Priority</div><div>Category</div></div>",
  ];

  // Generate the rows
  let rows = tasks.map(
    (task) => `
    <div class="row element">
      <div>${task.title}</div>
      <div>${task.description}</div>
      <div>${task.initialDate}</div>
      <div>${task.finalDate}</div>
      <div>${task.owner}</div>
      <div>${task.priority}</div>
      <div>${task.category}</div>
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
      // Show the context menu
      const contextMenu = document.getElementById("contextMenu");
      contextMenu.style.top = `${e.clientY}px`;
      contextMenu.style.left = `${e.clientX}px`;
      contextMenu.style.display = "block";
    });
  });

  return tableHTML;
}

window.addEventListener("click", function (event) {
  //Se o popup menu estiver aberto e se clicar fora do popup menu, o popup menu é fechado
  if (contextMenu.style.display === "block") {
    contextMenu.style.display = "none";
  }
  if (contextMenu1.style.display === "block") {
    contextMenu1.style.display = "none";
  }
});
