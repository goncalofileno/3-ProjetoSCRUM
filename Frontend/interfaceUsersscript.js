//TODO - Adicionar listeners às linhas da table.

// dev = Developer
// sm = Scrum Master
// po = Product Owner

//o id é o taskButton para usar o mesmo css
const addUserButton = document.getElementById("addUserButton");
const restoreAllTasksButton = document.getElementById("restoreAllTasksButton");
const deleteAllTasksButton = document.getElementById("deleteAllTasksButton");
const restoreTask = document.getElementById("restoreTask");
const deleteTask = document.getElementById("deleteTask");
const addCategoryButton = document.getElementById("addCategoryButton");
const deleteCategoryoption = document.getElementById("deleteCategory");
const editCategory = document.getElementById("editCategory");
const newTaskModal = document.getElementById("newTaskModal");
const cancelCategoryButton = document.getElementById("cancelTaskButton");
const submitCategoryButton = document.getElementById("submitTaskButton");
const backButton = document.getElementById("backButton");

addUserButton.style.display = "none";

window.onload = async function () {
  if (localStorage.getItem("token") == null) {
    window.location.href = "http://localhost:8080/demo-1.0-SNAPSHOT/";
    //se o user é Product Owner, o botão de adicionar user é mostrado.
  }

  // let selectedButton = await localStorage.getItem("selectedButton");
  // console.log("Selected button: " + selectedButton);

  if (localStorage.getItem("selectedButton") == 2) {
    await displayDeletedTasks();

    let numTasks = document.querySelectorAll(
      "#tableContainer .row.element"
    ).length;

    console.log("Numero de tasks: " + numTasks);

    if (localStorage.getItem("role") === "sm") {
      restoreAllTasksButton.style.display = numTasks > 1 ? "block" : "none";
      deleteAllTasksButton.style.display = "none";
      addUserButton.style.display = "none";
      addCategoryButton.style.display = "none";
    } else if (localStorage.getItem("role") === "po") {
      restoreAllTasksButton.style.display = numTasks > 1 ? "block" : "none";
      deleteAllTasksButton.style.display = numTasks > 1 ? "block" : "none";
      addUserButton.style.display = "none";
      addCategoryButton.style.display = "none";
    }
  } else if (localStorage.getItem("selectedButton") == 1) {
    document.getElementById("tableContainer").innerHTML = displayUsers();

    if (localStorage.getItem("role") === "po") {
      addUserButton.style.display = "block";
    }

    restoreAllTasksButton.style.display = "none";
    deleteAllTasksButton.style.display = "none";
    addCategoryButton.style.display = "none";
  } else if (localStorage.getItem("selectedButton") == 3) {
    displayCategories();
    addUserButton.style.display = "none";
    restoreAllTasksButton.style.display = "none";
    deleteAllTasksButton.style.display = "none";
    addCategoryButton.style.display = "block";
  }
  // Get the labelUser element
  const labelUser = document.getElementById("labelUser");
  const role = localStorage.getItem("role");
  // Update the welcome message based on the role
  switch (role) {
    case "dev":
      labelUser.textContent = "Welcome Developer, ";
      break;
    case "sm":
      labelUser.textContent = "Welcome Scrum Master, ";
      break;
    case "po":
      labelUser.textContent = "Welcome Product Owner, ";
      break;
    default:
      labelUser.textContent = "Welcome, ";
      break;
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

  localStorage.setItem("optionDelete", 0);
};
addUserButton.addEventListener("click", function () {
  window.location.href = "register.html";
});

addCategoryButton.addEventListener("click", function () {
  document.getElementById("modalTitle").innerText = "New Category";
  document.getElementById("submitTaskButton").innerText = "Add Category";
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
  localStorage.setItem("editCategory", "false");

  newTaskModal.style.display = "block";

  document.body.classList.add("modal-open");
});

cancelCategoryButton.addEventListener("click", function () {
  newTaskModal.style.display = "none";
  document.body.classList.remove("modal-open");
});

submitCategoryButton.addEventListener("click", async function () {
  if (localStorage.getItem("editCategory") === "true") {
    await updateCategory();
  } else {
    await createCategory();
  }
});

restoreTask.addEventListener("click", async function () {
  const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
  const taskName = localStorage.getItem("selectedTask"); // Replace this with the actual task name

  await fetch(
    `http://localhost:8080/demo-1.0-SNAPSHOT/rest/task/restore?name=${encodeURIComponent(
      taskName
    )}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (response.status === 200) {
        console.log(data.message);
        // You can add code here to update the UI after successfully restoring the task
      } else if (response.status === 400) {
        console.error(data.message);
        // Handle the error when the task cannot be restored
      } else if (response.status === 403) {
        console.error(data.message);
        // Handle the error when the user is forbidden to restore the task
      } else if (response.status === 401) {
        console.error(data.message);
        // Handle the error when the user is unauthorized
      }
    })
    .catch((error) => console.error("Error:", error));

  await displayDeletedTasks();

  let numTasks = document.querySelectorAll(
    "#tableContainer .row.element"
  ).length;

  if (numTasks < 1) {
    restoreAllTasksButton.style.display = "none";
    deleteAllTasksButton.style.display = "none";
  }
});

deleteTask.addEventListener("click", function () {
  // Open the modal
  document.getElementById("deleteWarning").style.display = "block";

  localStorage.setItem("optionDelete", 2);
});

document
  .getElementById("yesButtonDelete")
  .addEventListener("click", async function () {
    // Close the modal
    document.getElementById("deleteWarning").style.display = "none";

    if (localStorage.getItem("optionDelete") == 2) {
      await deleteOneTask();
    } else if (localStorage.getItem("optionDelete") == 1) {
      await deleteCategory();
    } else if (localStorage.getItem("optionDelete") == 3) {
      await deleteAllTasks();
    } else if (localStorage.getItem("optionDelete") == 4) {
      await deleteUserPermanently();
    } else if (localStorage.getItem("optionDelete") == 5) {
      await deleteAllTasksUser();
    }

    let numTasks = await document.querySelectorAll(
      "#tableContainer .row.element"
    ).length;

    if (numTasks <= 1) {
      restoreAllTasksButton.style.display = "none";
      deleteAllTasksButton.style.display = "none";
    }

    localStorage.setItem("optionDelete", 0);
  });

document.getElementById("logo").addEventListener("click", () => {
  window.location.href = "interface.html";
});
document
  .getElementById("noButtonDelete")
  .addEventListener("click", function () {
    // Close the modal
    document.getElementById("deleteWarning").style.display = "none";
  });

deleteCategoryoption.addEventListener("click", async function () {
  localStorage.setItem("optionDelete", 1);

  deleteWarning.style.display = "block";
});

editCategory.addEventListener("click", function () {
  const titleElement = document.getElementById("taskTitle");
  const descriptionElement = document.getElementById("taskDescription");

  // Populate the input fields with the category data
  titleElement.value = localStorage.getItem("selectedCategoryTitle");
  descriptionElement.value = localStorage.getItem(
    "selectedCategoryDescription"
  );

  // Change the modal title and button text
  document.getElementById("modalTitle").innerText = "Edit Category";
  document.getElementById("submitTaskButton").innerText = "Update Category";

  localStorage.setItem("editCategory", "true");

  newTaskModal.style.display = "block";
  document.body.classList.add("modal-open");
});

restoreAllTasksButton.addEventListener("click", async function () {
  const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage

  await fetch("http://localhost:8080/demo-1.0-SNAPSHOT/rest/task/restoreAll", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      token: token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (response.status === 200) {
        console.log(data.message);
        // You can add code here to update the UI after successfully restoring all tasks
      } else if (response.status === 400) {
        console.error(data.message);
        // Handle the error when tasks cannot be restored
      } else if (response.status === 403) {
        console.error(data.message);
        // Handle the error when the user is forbidden to restore tasks
      } else if (response.status === 401) {
        console.error(data.message);
        // Handle the error when the user is unauthorized
      }
    })
    .catch((error) => console.error("Error:", error));

  await displayDeletedTasks();

  let numTasks = document.querySelectorAll(
    "#tableContainer .row.element"
  ).length;

  if (numTasks === 0) {
    restoreAllTasksButton.style.display = "none";
    deleteAllTasksButton.style.display = "none";
  }
});

deleteAllTasksButton.addEventListener("click", async function () {
  document.getElementById("deleteWarning").style.display = "block";
  localStorage.setItem("optionDelete", 3);
});

window.addEventListener("click", function (event) {
  //Se o popup menu estiver aberto e se clicar fora do popup menu, o popup menu é fechado
  if (contextMenu.style.display === "block") {
    contextMenu.style.display = "none";
  }
  if (contextMenu1.style.display === "block") {
    contextMenu1.style.display = "none";
  }
  if (contextMenu2.style.display === "block") {
    contextMenu2.style.display = "none";
  }
});

// document
//   .getElementById("editProfileButton")
//   .addEventListener("click", function () {
//     localStorage.setItem("selectedUser", localStorage.getItem("username"));
//     window.location.href = "editProfile.html";
//   });

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
    .catch(async (error) => {
      console.error("Error:", error);
      if (error.message.includes("401")) {
        await createModal("Unauthorized access.");
      }
    });
}

async function deleteOneTask() {
  const taskName = localStorage.getItem("selectedTask"); // Assuming the task name is stored in local storage
  const response = await fetch(
    `http://localhost:8080/demo-1.0-SNAPSHOT/rest/task/delete?name=${taskName}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    }
  );

  if (response.ok) {
    const data = await response.json();
    console.log(data);
    // Handle successful deletion of the task here
  } else {
    console.error("Failed to delete the task");
    // Handle failure to delete the task here
  }

  await displayDeletedTasks();

  let numTasks = document.querySelectorAll(
    "#tableContainer .row.element"
  ).length;

  if (numTasks < 1) {
    restoreAllTasksButton.style.display = "none";
    deleteAllTasksButton.style.display = "none";
  }
}

async function deleteAllTasks() {
  const response = await fetch(
    "http://localhost:8080/demo-1.0-SNAPSHOT/rest/task/deleteAll",
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    }
  );

  if (response.ok) {
    const data = await response.json();
    console.log(data);
    // Handle successful deletion of all tasks here
  } else {
    console.error("Failed to delete all tasks");
    // Handle failure to delete all tasks here
  }

  await displayDeletedTasks();

  let numTasks = document.querySelectorAll(
    "#tableContainer .row.element"
  ).length;

  if (numTasks < 1) {
    restoreAllTasksButton.style.display = "none";
    deleteAllTasksButton.style.display = "none";
  }
}

///////////////////////// TABLE //////////////////////////
// contextMenu --
const deleteUser = document.getElementById("deleteUser");
const deleteAllTasksContext = document.getElementById("deleteAllTasksContext");
const editUser = document.getElementById("editUser");
const selectedUser = localStorage.getItem("selectedUser");

restoreAllTasksButton.addEventListener("click", function () {});

// getItem for use the selectedUser actual
editUser.addEventListener("click", function () {
  window.location.href = "editProfile.html";
  console.log(localStorage.getItem("selectedUser") + " foi editado");
});
deleteUser.addEventListener("click", function () {
  document.getElementById("deleteWarning").style.display = "block";
  localStorage.setItem("optionDelete", 4);
});
deleteAllTasksContext.addEventListener("click", function () {
  document.getElementById("deleteWarning").style.display = "block";
  localStorage.setItem("optionDelete", 5);
});
document.getElementById("displayUsername").addEventListener("click", () => {
  if (localStorage.setItem("selectedUser", localStorage.getItem("username")));
  window.location.href = "editProfile.html";
});

// -- -- -- -- -- -- -- -- --
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

let users = []; // Define users at the top level of your script

async function fetchUsers() {
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
    await createModal("Failed to fetch users");
    return;
  }
  users = await response.json();
}

let lastClickedIndex = null;
let sortOrder = 1;

async function displayUsers() {
  // Call fetchUsers if users is empty
  if (users.length === 0) {
    await fetchUsers();
  }

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
    // Generate the rows
    var rows = users
      .filter(
        (user) =>
          user.username !== "admin" &&
          user.username !== "User deleted" &&
          user.username !== localStorage.getItem("username")
      )
      .map(
        (user) => `
  <div class="row element">
    <div><img src="${user.photoURL}" class="userPhoto"></div>
    <div>${user.username}</div>
    <div>${user.firstname}</div>
    <div>${user.lastname}</div>
    <div class="email">${user.email}</div>
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

    var rows = users
      .filter(
        (user) =>
          user.username !== "admin" &&
          user.username !== "deleted" &&
          user.username !== localStorage.getItem("username")
      )
      .map(
        (user) => `
    <div class="row element">
      <div><img src="${user.photoURL}" class="userPhoto"></div>
      <div>${user.username}</div>
      <div>${user.firstname}</div>
      <div>${user.lastname}</div>
      <div class="email">${user.email}</div>
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

  // Add event listeners to the table headers
  let headers = tableContainer.querySelectorAll(".row.header div");

  headers.forEach((header, index) => {
    header.addEventListener("click", async function () {
      if (index === 7) { // If the "Active" column is clicked
        users = []; // Clear the users array
        await fetchUsers(); // Fetch the users again
      }
      if (lastClickedIndex === index) {
        sortOrder *= -1; // Reverse the sort order
      } else {
        sortOrder = 1; // Reset the sort order
      }
      lastClickedIndex = index;
      
      sortUsers(users, index, sortOrder);
      displayUsers(); // Don't pass users
    });
    // Add mouseover and mouseout event listeners
    header.addEventListener("mouseover", function () {
      this.style.cursor = "pointer";
    });
    header.addEventListener("mouseout", function () {
      this.style.cursor = "default";
    });
  });
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
        await createModal("Failed to update the user's active status");
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
  document.getElementById("tableContainer").innerHTML = "";
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
    await createModal("Failed to fetch tasks");
    return;
  }
  let tasks = await response.json();
  tasks = tasks.filter((task) => task.active === false);

  // Sort tasks by the last sorted field, if any
  if (lastSortedField !== null) {
    tasks = sortTasks(tasks, lastSortedField, isAscending);
  }

  const tableContainer = document.getElementById("tableContainer");
  let table = [
    "<div class='table t-design'>",
    "<div class='row header'><div>Title</div><div>Description</div><div>Initial Date</div><div>Final Date</div><div>Owner</div><div>Priority</div><div>Category</div></div>",
  ];

  let rows = await Promise.all(
    tasks.map(async (task) => {
      let priorityString;
      let priorityIcon;
      if (task.priority === 300) {
        priorityString = "High";
        priorityIcon = "resources/Icons/high_priority.png";
      } else if (task.priority === 200) {
        priorityString = "Medium";
        priorityIcon = "resources/Icons/medium_priority.png";
      } else if (task.priority === 100) {
        priorityString = "Low";
        priorityIcon = "resources/Icons/low_priority.png";
      } else {
        priorityString = "Unknown";
        priorityIcon = "resources/Icons/unknown_priority.png";
      }

      const photoUrl = await getUserPhoto(
        localStorage.getItem("token"),
        task.owner
      );

      return `
        <div class="row element">
          <div>${task.title}</div>
          <div>${task.description}</div>
          <div>${task.initialDate}</div>
          <div>${task.finalDate}</div>
          <div><img src="${photoUrl}" alt="User Photo" style="border-radius: 50%; border: 1px solid black; width: 30px; height: 30px; margin-right: 0.4rem"> ${task.owner}</div>
          <div>${priorityString} <img src="${priorityIcon}" alt="Priority Icon" style="height: 20px; width: 20px; margin-left: 0.3rem"></div>
          <div>${task.category}</div>
        </div>
      `;
    })
  );

  table.push(...rows);
  table.push("</div>");
  let tableHTML = table.join("");
  tableContainer.innerHTML = tableHTML;

  // Add event listeners to the headers
  // Add event listeners to the headers
  const headers = tableContainer.querySelectorAll(".row.header div");
  headers.forEach((header, index) => {
    header.addEventListener("click", () => {
      // Determine the field to sort by
      let field = header.textContent.toLowerCase();

      // Create a mapping between display names and actual property names
      const fieldMapping = {
        "initial date": "initialDate",
        "final date": "finalDate",
        // Add other mappings as needed
      };

      // Use the mapping if it exists
      if (fieldMapping[field]) {
        field = fieldMapping[field];
      }

      // Check if the same field is being sorted again
      if (lastSortedField === field) {
        // If so, reverse the sort direction
        isAscending = !isAscending;
      } else {
        // If a different field is being sorted, sort in ascending order
        isAscending = true;
        lastSortedField = field;
      }

      // Redisplay the tasks
      displayDeletedTasks();
    });

    header.addEventListener("mouseover", function () {
      this.style.cursor = "pointer";
    });

    header.addEventListener("mouseout", function () {
      this.style.cursor = "default";
    });
  });

  let rowElement = tableContainer.querySelectorAll(".row.element");
  rowElement.forEach((row, index) => {
    row.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      localStorage.setItem("selectedTask", tasks[index].title);
      const contextMenu = document.getElementById("contextMenu");
      const restoreTaskOption = document.getElementById("restoreTask");
      const deleteTaskOption = document.getElementById("deleteTask");

      if (localStorage.getItem("role") === "sm") {
        deleteTaskOption.style.display = "none";
      } else {
        deleteTaskOption.style.display = "block";
      }

      contextMenu.style.top = `${e.clientY}px`;
      contextMenu.style.left = `${e.clientX}px`;
      contextMenu.style.display = "block";
    });
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

var categories = null;

async function displayCategories() {
  document.getElementById("tableContainer").innerHTML = "";
  // Fetch categories from the server only if they haven't been provided
  if (!categories) {
    const response = await fetch(
      "http://localhost:8080/demo-1.0-SNAPSHOT/rest/category/all",
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
      await createModal("Failed to fetch categories");
      return;
    }
    categories = await response.json();
  }

  // Get the tableContainer element
  const tableContainer = document.getElementById("tableContainer");

  // After defining the table headers
  let table = [
    "<div class='table t-design'>",
    "<div class='row header'><div id='titleHeader'>Title</div><div id='descriptionHeader'>Description</div><div id='ownerHeader' class='small-collumn'>Owner</div><div id='tasksHeader' class='small-collumn'>Number of Tasks</div></div>",
  ];

  // Generate the rows
  let rows = await Promise.all(
    categories.map(async (category) => {
      const tasks = await getTasksByCategory(category.title);
      category.numTasks = tasks; // Update numTasks property

      // Fetch the user photo
      const photoUrl = await getUserPhoto(
        localStorage.getItem("token"),
        category.owner
      );

      return `
      <div class="row element">
        <div>${category.title}</div>
        <div>${category.description}</div>
        <div class="small-collumn"> <img src="${photoUrl}" alt="User Photo" style="border-radius: 50%; border: 1px solid black; width: 30px; height: 30px; margin-right: 0.3rem"> ${category.owner}</div>
        <div class="small-collumn">${category.numTasks}</div> <!-- Display numTasks instead of tasks -->
      </div>
    `;
    })
  );

  // Add the rows to the table
  table.push(...rows);
  // End of the table
  table.push("</div>");
  // Join the table array into a string and return it
  let tableHTML = table.join("");
  // Add the table to the DOM
  tableContainer.innerHTML = tableHTML;

  // Add event listeners to the headers
  const headers = [
    "titleHeader",
    "descriptionHeader",
    "ownerHeader",
    "tasksHeader",
  ];
  headers.forEach((header) => {
    const element = document.getElementById(header);
    element.addEventListener("click", () =>
      sortTable(header.replace("Header", ""))
    );
    element.addEventListener("mouseover", function () {
      this.style.cursor = "pointer";
    });
    element.addEventListener("mouseout", function () {
      this.style.cursor = "default";
    });
  });

  // Now that the new rows are in the DOM, you can add event listeners to them
  let rowElement = tableContainer.querySelectorAll(".row.element");
  rowElement.forEach((row, index) => {
    row.addEventListener("contextmenu", function (e) {
      // This function will be called when a row is clicked
      // `this` refers to the clicked row
      e.preventDefault();
      // Save the category title and description in local storage
      localStorage.setItem("selectedCategoryTitle", categories[index].title);
      localStorage.setItem(
        "selectedCategoryDescription",
        categories[index].description
      );
      // Show the context menu
      const contextMenu = document.getElementById("contextMenu2");
      contextMenu.style.top = `${e.clientY}px`;
      contextMenu.style.left = `${e.clientX}px`;
      contextMenu.style.display = "block";
    });
  });
}

async function deleteCategory() {
  const title = localStorage.getItem("selectedCategoryTitle");
  const response = await fetch(
    "http://localhost:8080/demo-1.0-SNAPSHOT/rest/category/delete?title=" +
      title,
    {
      method: "DELETE",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    }
  );

  const data = await response.json();

  await createModal(data.message);

  await (window.location.href = "interfaceUsers.html");

  await displayCategories();
}
//Functio to update category
async function updateCategory() {
  const titleElement = document.getElementById("taskTitle");
  const descriptionElement = document.getElementById("taskDescription");

  const title = titleElement.value.trim();
  const description = descriptionElement.value.trim();

  // Only send the request if the title or description has changed
  if (
    title !== localStorage.getItem("selecteCategoryTitle") ||
    description !== localStorage.getItem("selecteCategoryDescription")
  ) {
    const category = {
      title: title,
      description: description,
      owner: localStorage.getItem("username"),
    };

    const response = await fetch(
      "http://localhost:8080/demo-1.0-SNAPSHOT/rest/category/update?title=" +
        localStorage.getItem("selectedCategoryTitle"),
      {
        method: "PUT",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify(category),
      }
    );

    const data = await response.json();

    await createModal(data.message);

    newTaskModal.style.display = "none";
    document.body.classList.remove("modal-open");
    localStorage.setItem("editCategory", "false");
    window.location.reload();
  }
}

async function createCategory() {
  const title = document.getElementById("taskTitle").value.trim();
  const description = document.getElementById("taskDescription").value.trim();
  const owner = localStorage.getItem("username");

  console.log(title);
  console.log(description);
  console.log(owner);

  const category = {
    id: 0, // Assuming the ID is generated on the server side
    title: title,
    description: description,
    owner: owner,
  };

  const response = await fetch(
    "http://localhost:8080/demo-1.0-SNAPSHOT/rest/category/add",
    {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
      body: JSON.stringify(category),
    }
  );

  const data = await response.json();

  await createModal(data.message);

  newTaskModal.style.display = "none";
  document.body.classList.remove("modal-open");
  window.location.reload();
}

async function getTasksByCategory(title) {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `http://localhost:8080/demo-1.0-SNAPSHOT/rest/category/tasksNumber?title=${title}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        token: token,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch number of tasks");
  }

  const data = await response.json();
  return data;
}

function deleteAllTasksUser() {
  fetch("http://localhost:8080/demo-1.0-SNAPSHOT/rest/user/deleteTasks", {
    method: "DELETE",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      token: localStorage.getItem("token"),
      selectedUser: localStorage.getItem("selectedUser"),
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      return response.json();
    })
    .then(async (data) => {
      if (data.message === "All tasks deleted") {
        await createModal("All tasks deleted");
      }
    })
    .catch(async (error) => {
      console.error("Error:", error);
      if (error.message.includes("401")) {
        await createModal("Unauthorized access.");
      }
    });
}

async function deleteUserPermanently() {
  fetch("http://localhost:8080/demo-1.0-SNAPSHOT/rest/user/delete", {
    method: "DELETE",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      token: localStorage.getItem("token"),
      selectedUser: localStorage.getItem("selectedUser"),
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      // remove child from the table
      displayUsers();
      return response.json();
    })
    .then((data) => {
      if (data.message === "User deleted") {
        // alert("User deleted");
        location.reload();
      }
    })
    .catch(async (error) => {
      console.error("Error:", error);
      if (error.message.includes("401")) {
        await createModal("Unauthorized access.");
      } else if (error.message.includes("403")) {
        await createModal("Forbidden access.");
      } else if (error.message.includes("400")) {
        await createModal("Bad request.");
      }
    });
}

async function getUserPhoto(token, username) {
  const response = await fetch(
    "http://localhost:8080/demo-1.0-SNAPSHOT/rest/user/getPhoto",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        token: token,
        username: username,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user photo");
  }

  const data = await response.json();
  return data;
}

backButton.addEventListener("click", function () {
  window.location.href = "interface.html";
});

let lastSortedField = null;
let isAscending = true;

async function sortTable(field) {
  // Check if the same field is being sorted again
  if (lastSortedField === field) {
    // If so, reverse the sort direction
    isAscending = !isAscending;
  } else {
    // If a different field is being sorted, sort in ascending order
    isAscending = true;
    lastSortedField = field;
  }

  // Check if the field is "tasks"
  if (field === "tasks") {
    // If so, sort by the number of tasks
    categories.sort(
      (a, b) => (a.numTasks - b.numTasks) * (isAscending ? 1 : -1)
    );
  } else if (typeof categories[0][field] === "string") {
    // If the values are strings, sort alphabetically
    categories.sort(
      (a, b) => a[field].localeCompare(b[field]) * (isAscending ? 1 : -1)
    );
  } else {
    // If the values are not strings (assuming numbers), sort numerically
    categories.sort(
      (a, b) => (Number(a[field]) - Number(b[field])) * (isAscending ? 1 : -1)
    );
  }
  // Redisplay the categories
  await displayCategories();
}

function sortTasks(tasks, field, ascending = true) {
  return tasks.sort((a, b) => {
    let aValue = a[field];
    let bValue = b[field];

    // Check if the values are date strings in the "yyyy-mm-dd" format
    if (
      /^\d{4}-\d{2}-\d{2}$/.test(aValue) &&
      /^\d{4}-\d{2}-\d{2}$/.test(bValue)
    ) {
      // If so, convert them to Date objects
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    } else if (typeof aValue === "string") {
      // If the values are strings, convert them to lowercase for case-insensitive sorting
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    // Compare the values
    if (aValue < bValue) {
      return ascending ? -1 : 1;
    } else if (aValue > bValue) {
      return ascending ? 1 : -1;
    } else {
      return 0;
    }
  });
}

function sortUsers(users, index, sortOrder) {
  // Assuming that users is an array of objects and index corresponds to the object keys
  const keys = [
    "photoURL",
    "username",
    "firstname",
    "lastname",
    "email",
    "phone",
    "role",
    "active",
  ];
  users.sort((a, b) => {
    if (a[keys[index]] < b[keys[index]]) {
      return -1 * sortOrder;
    }
    if (a[keys[index]] > b[keys[index]]) {
      return 1 * sortOrder;
    }
    return 0;
  });
}

function createModal(message) {
  return new Promise((resolve) => {
    // Add the 'modal-open' class to the body
    document.body.classList.add("modal-open");

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
      document.body.classList.remove("modal-open");
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
