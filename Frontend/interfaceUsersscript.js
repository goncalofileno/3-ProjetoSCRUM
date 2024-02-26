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

const deleteUser = document.getElementById("deleteUser");
const deleteAllTasks = document.getElementById("deleteAllTasks");
const changeRole = document.getElementById("changeRole");

deleteUser.addEventListener("click", function (e) {
  const selectedUser = localStorage.getItem("selectedUser");
  console.log(selectedUser);
});
deleteAllTasks.addEventListener("click", function () {
  console.log("Delete all tasks");
});
changeRole.addEventListener("click", function () {
  console.log("Change role");
});

// Function to get the full role name from the role abbreviation
function getRoleFullName(role) {
  switch (role) {
    case "dev":
      return "Developer";
    case "po":
      return "Product Owner";
    case "sm":
      return "Scrum Master";
    default:
      return role; // return the original role if it's not one of the above
  }
}
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

  if (localStorage.getItem("role") === "po") {
    // Start of the table
    var table = [
      "<div class='table t-design'>",
      `<div class='row header'>
    <div>Photo</div>
    <div>Username</div>
    <div>First Name</div>
    <div>Last Name</div>
    <div>Email</div>
    <div>Phone</div>
    <div>Role</div>
    <div>Active</div>
    </div>`, // Change this to your user fields
    ];

    // Generate the rows
    var rows = users.map(
      (user) => `
    <div class="row element">
      <div><img src="${user.photoURL}" class="userPhoto"></div>
      <div>${user.username}</div>
      <div>${user.firstname}</div>
      <div>${user.lastname}</div>
      <div>${user.email}</div>
      <div>${user.phone}</div>
      <div>${getRoleFullName(user.role)}</div>
      <div>
        <input type="checkbox" id="active-${
          user.username
        }" class="active-slider" ${user.active ? "checked" : ""}>
      </div>
    </div>
  `
    );
  } else {
    // Get the only currently active users with the activeUsers
    var activeUsers = users.filter((user) => user.active === true);

    var table = [
      "<div class='table t-design'>",
      `<div class='row header'>
        <div>Photo</div>
        <div>Username</div>
        <div>First Name</div>
        <div>Last Name</div>
        <div>Email</div>
        <div>Phone</div>
        <div>Role</div>
      </div>`, // Change this to your user fields
    ];

    // Generate the rows
    var rows = activeUsers.map(
      (user) => `
    <div class="row element">
      <div><img src="${user.photoURL}" class="userPhoto"></div>
      <div>${user.username}</div>
      <div>${user.firstname}</div>
      <div>${user.lastname}</div>
      <div>${user.email}</div>
      <div>${user.phone}</div>
      <div>${getRoleFullName(user.role)}</div>
    </div>
  `
    );
  }

  // Add the rows to the table
  table.push(...rows);
  // End of the table
  table.push("</div>");
  // Join the table array into a string and return it
  let tableHTML = table.join("");
  // Add the table to the DOM
  tableContainer.innerHTML = tableHTML;
  // Add event listeners to the slider buttons
  let sliderButtons = tableContainer.querySelectorAll(".active-slider");
  sliderButtons.forEach((sliderButton) => {
    sliderButton.addEventListener("change", async function (e) {
      console.log("Slider button changed");
      //  id="active-${user.username}  remove active- and get the username
      let username = this.id.replace("active-", "");
      // Get the new active status from the slider button
      let newActiveStatus = this.checked;
      console.log(username, newActiveStatus);
      // Update the user's active status in the database
      // Replace this with your actual API endpoint and method to update a user's active status
      const response = await fetch(
        `http://localhost:8080/demo-1.0-SNAPSHOT/rest/user/updateactive/?username=${username}&active=${newActiveStatus}`,
        {
          method: "POST",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        }
      );

      if (!response.ok) {
        alert("Failed to update user's active status");
        // Revert the slider button to its original state
        this.checked = !newActiveStatus;
      }
    });
  });

  //tableContainer.innerHTML = tableHTML;
  // If the user is a Product Owner, add event listeners to the rows
  if (localStorage.getItem("role") === "po") {
    // Now that the new rows are in the DOM, you can add event listeners to them
    let rowElement = tableContainer.querySelectorAll(".row.element");
    rowElement.forEach((row) => {
      row.addEventListener("contextmenu", function (e) {
        // This function will be called when a row is clicked
        // `this` refers to the clicked row
        e.preventDefault();
        /////////////////////////////////////////////////
        // To get the main div with user info:
        // Identify the clicked element
        const clickedElement = e.target;
        // Get the user selected from the parent clicked element
        const userSelected = clickedElement.parentNode.children[1].textContent;
        localStorage.setItem("selectedUser", userSelected);
        console.log(userSelected);
        /////////////////////////////////////////////////

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
