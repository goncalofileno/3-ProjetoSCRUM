//TODO - Adicioanar animação assim como no btn addtasks aos restantes btns
//Listener para quando todas as acções de quando a página carrega
window.onload = async function () {
  if (!localStorage.getItem("token")) {
    window.location.href = "index.html";
  }

  localStorage.setItem("selectedButton", 0);

  // Get the role from local storage
  const role = localStorage.getItem("role");

  nameButton(role);

  if (role === "dev") {
    document.getElementById("usersButton").style.display = "none";
    document.getElementById("deletedTasksButton").style.display = "none";
    document.getElementById("taskCategoryButton").style.display = "none";
    document.getElementById("filters").style.display = "none";
  } else if (role === "sm") {
    document.getElementById("taskCategoryButton").style.display = "none";
  }

  // Get the labelUser element
  const labelUser = document.getElementById("labelUser");

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

  await getUserPartial();

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

  displayDateTime(); // Adiciona a exibição da data e hora
  setInterval(displayDateTime, 1000); // Atualiza a cada segundo

  populateCategories();
  populateUsersOwners();
  populateActiveCategories();

  document.getElementById("categoryFilter").value = "";
  document.getElementById("ownerFilter").value = "";

  //Chama a função para mostrar as tarefas
  displayTasks();
};

window.onclose = function () {
  sessionStorage.clear();
  localStorage.clear();
};

//Obtem os trash icon
const trashIcon = document.getElementById("trashIcon");
//Obtem o botão Add Task
const addTaskButton = document.getElementById("addTaskButton");
//Obtem os Users
const usersButton = document.getElementById("usersButton");
//Obtem a modal para adicionar uma nova tarefa
const newTaskModal = document.getElementById("newTaskModal");
//Obtem o botao para cancelar a adição de uma nova tarefa
const cancelButtonAddTaskModal = document.getElementById("cancelTaskButton");

//Cria as 3 listas de objectos para as tarefas
const ToDoTasks = JSON.parse(localStorage.getItem("ToDoTasks")) || [];
const DoingTasks = JSON.parse(localStorage.getItem("DoingTasks")) || [];
const DoneTasks = JSON.parse(localStorage.getItem("DoneTasks")) || [];

//Obtem as 3 secções para as tarefas serem colocadas
const todoSection = document.getElementById("todo");
const doingSection = document.getElementById("doing");
const doneSection = document.getElementById("done");

//Obtem o modal de aviso de delete
const deleteWarning = document.getElementById("deleteWarning");
//Obtem os 2 botões do avisos de delete
const yesButton = document.getElementById("yesButtonDelete");
const noButton = document.getElementById("noButtonDelete");

//Obtem o popup menu que aparece com o click direito
const contextMenu = document.getElementById("contextMenu");
//Obtem a opcao de deconste do popup menu
const deleteTaskOption = document.getElementById("deleteTask");
//Obtem a opcao de editar do popup menu
const editTaskOption = document.getElementById("editTask");

//Obtem a modal que mostra os detalhes da tarefa
const taskDetailsModal = document.getElementById("taskDetailsModal");
//Obtem o label para o titulo da tarefa
const modalTaskTitle = document.getElementById("taskTitleinfo");
//Obtem o label para a descrição da tarefa
const modalTaskDescription = document.getElementById("taskDescriptioninfo");
//Obtem o botão para fechar a modal de detalhes da tarefa
const modalOkButton = document.getElementById("modalOkButton");

//Obtem o warning modal
const warningModal = document.getElementById("warningModal");
//Obtem o botão de ok do warning modal
const okButton = document.getElementById("modalWarningOkButton");

//Obtem o titulo e descrição do modal de adicionar uma nova tarefa
const taskTitle = document.getElementById("taskTitle").value;
const taskDescription = document.getElementById("taskDescription").value;

//Obtem o botão de logout
const botaoLogout = document.getElementById("logoutButton");

//Obtem a div que mostra a data e hora
const dateTimeDisplay = document.getElementById("dateTimeDisplay");

// const editProfileButton = document.getElementById("editProfileButton");
const taskInitialDateinfo = document.getElementById("taskInitialDateinfo");
const taskFinalDateinfo = document.getElementById("taskFinalDateinfo");
const taskCategoryinfo = document.getElementById("taskCategoryinfo");
const taskOwnerinfo = document.getElementById("taskOwnerinfo");

const categoryFilter = document.getElementById("categoryFilter");
const ownerFilter = document.getElementById("ownerFilter");
const applyFiltersButton = document.getElementById("applyFilters");

const resetFiltersButton = document.getElementById("resetFilters");

const deletedTasksButton = document.getElementById("deletedTasksButton");
const categoryButton = document.getElementById("taskCategoryButton");

function nameButton(role) {
  if (role == "dev") {
  } else if (role == "sm") {
    document.getElementById("usersButton").innerHTML = "User List";
  } else if (role == "po") {
    document.getElementById("usersButton").innerHTML = "User Management";
    document.getElementById("taskCategoryButton").innerHTML =
      "Category Management";
  }
}
//Listener para quando se clica na em qualquer sitio da página
window.addEventListener("click", function (event) {
  //Se o popup menu estiver aberto e se clicar fora do popup menu, o popup menu é fechado
  if (contextMenu.style.display === "block") {
    contextMenu.style.display = "none";
  }
});

document.getElementById("displayUsername").addEventListener("click", () => {
  if (localStorage.setItem("selectedUser", localStorage.getItem("username")));
  window.location.href = "editProfile.html";
});

document.getElementById("logo").addEventListener("click", () => {
  window.location.href = "interface.html";
});

categoryFilter.addEventListener("change", function () {
  displayTasks(categoryFilter.value, ownerFilter.value);
});
ownerFilter.addEventListener("change", function () {
  displayTasks(categoryFilter.value, ownerFilter.value);
});

//Função que determina o que acontece quando o cursor está sobre trashIcon
trashIcon.ondragover = function (event) {
  //Permite que uma tarefa seja largada sobre o ícone do lixo
  allowDrop(event);
  //Atribui um highliht ao icone do lixo aberto
  trashIcon.classList.add("highlightTrash");
  //Muda a imagem do icone do lixo para o icone do lixo aberto
  trashIcon.src = "resources/Icons/trashOpen.png";
};

//Função que determina o que acontece quando o cursor sai de cima do trashIcon
trashIcon.ondragleave = function () {
  //Remove o highlight do icone do lixo aberto
  trashIcon.classList.remove("highlightTrash");
  //Muda a imagem do icone do lixo para o icone do lixo fechado
  trashIcon.src = "resources/Icons/trash.png";
};

//Função que determina o que acontece quando uma tarefa é largada sobre o trashIcon
trashIcon.ondrop = function (event) {
  //Permite que uma tarefa seja largada sobre o ícone do lixo, evitando o comportamento padrão
  event.preventDefault();

  //Obtem o id da tarefa que foi largada sobre o trashIcon
  const taskId = event.dataTransfer.getData("text/plain");

  //Guarda o id da tarefa no atributo data-task-id do deleteWarning modal
  deleteWarning.setAttribute("data-task-id", taskId);

  //Mostra o deleteWarning modal
  deleteWarning.style.display = "block";
  //Escura o fundo da página
  document.body.classList.add("modal-open");

  //Muda a imagem do icone do lixo para o icone do lixo fechado
  trashIcon.src = "resources/Icons/trash.png";
};

//Listener para quando o botão de logout é clicado
botaoLogout.addEventListener("click", function () {
  logout();
});

deletedTasksButton.addEventListener("click", () => {
  // Set deletedTasks to true in local storage
  localStorage.setItem("selectedButton", 2);
  // Open interfaceusers.html
  window.location.href = "interfaceUsers.html";
});

categoryButton.addEventListener("click", () => {
  localStorage.setItem("selectedButton", 3);

  window.location.href = "interfaceUsers.html";
});

//Listener para quando o botão Add Task é clicado
addTaskButton.addEventListener("click", function () {
  // Get today's date
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();

  // Format today's date
  var formattedToday = yyyy + "-" + mm + "-" + dd;
  console.log(formattedToday);

  // Clear the input fields of the modal
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("editTaskPriority").value = "low";
  document.getElementById("initialDate").value = formattedToday; // Set the initial date to today's date
  document.getElementById("finalDate").value = "";

  // Get the date inputs
  const initialDateInput = document.getElementById("initialDate");
  const finalDateInput = document.getElementById("finalDate");

  // Set the min attribute of the initialDate input to today's date
  initialDateInput.setAttribute("min", formattedToday);

  // Update the min attribute of the finalDate input when the initialDate changes
  initialDateInput.addEventListener("change", function () {
    // Create a new Date object from the initial date
    let initialDate = new Date(this.value);

    // Add one day to the initial date
    initialDate.setDate(initialDate.getDate() + 1);

    // Format the new date
    const nextDay = initialDate.toISOString().split("T")[0];

    // Set the min attribute of the finalDate input to the day after the initial date
    finalDateInput.setAttribute("min", nextDay);
  });

  //Mostra a modal
  newTaskModal.style.display = "block";
  //Escurece o fundo da página
  document.body.classList.add("modal-open");
});

usersButton.addEventListener("click", function () {
  window.location.href = "interfaceUsers.html";
  localStorage.setItem("selectedButton", 1);
});

//Listener para quando o botão de cancelar da modal de adicionar uma nova tarefa é clicado
cancelButtonAddTaskModal.addEventListener("click", function () {
  //Fecha a modal
  newTaskModal.style.display = "none";
  //Remove o escurecimento do fundo da página
  document.body.classList.remove("modal-open");
});

//Previne o comportamento padrão do browser quando o cursor é arrastado sobre as secções
todoSection.addEventListener("dragover", function (event) {
  event.preventDefault();
});
doingSection.addEventListener("dragover", function (event) {
  event.preventDefault();
});
doneSection.addEventListener("dragover", function (event) {
  event.preventDefault();
});

todoSection.addEventListener("drop", drop);
doingSection.addEventListener("drop", drop);
doneSection.addEventListener("drop", drop);

resetFiltersButton.addEventListener("click", () => {
  // Reset the selected filter values
  categoryFilter.value = "";
  ownerFilter.value = "";

  // Call displayTasks without any filter values
  displayTasks();
});

//Listener para quando o botão de adicionar uma nova tarefa é clicado
submitTaskButton.addEventListener("click", async function () {
  let title = document.getElementById("taskTitle").value;
  let description = document.getElementById("taskDescription").value;
  let priority = document.getElementById("editTaskPriority").value;
  let initialDate = document.getElementById("initialDate").value;
  let finalDate = document.getElementById("finalDate").value;
  let category = document.getElementById("taskCategory").value;

  if (priority === "low") {
    priority = 100;
  } else if (priority === "medium") {
    priority = 200;
  } else {
    priority = 300;
  }
  // Remove dates from the input fields
  if (
    title === "" ||
    description === "" ||
    priority === "" ||
    category === ""
  ) {
    // If the initial date is empty, set it to today's date
    if (initialDate === "") {
      initialDate = formattedToday;
    }
    // If the final date is empty, set it to null
    else if (finalDate === "") {
      finalDate = null;
    }
    // Show the warning modal
    warningModal.style.display = "block";
    warningModal.style.zIndex = "1000"; // Add this line
    // Add the darkening of the page background
    document.getElementById("modalOverlay2").style.display = "block";
  } else if (new Date(finalDate) < new Date(initialDate)) {
    alert("The final date must be after the initial date");
  } else {
    let newTask = {
      title: title,
      description: description,
      priority: priority,
      initialDate: initialDate,
      finalDate: finalDate ? finalDate : null,
      category: category,
    };

    console.log(newTask);

    await addTask(newTask);
  }

  await displayTasks();
  await populateUsersOwners();
  await populateActiveCategories();
  categoryFilter.value = "";
  ownerFilter.value = "";
  console.log("Tasks are printed");
});

//Listener para quando o botão de "Yes" do deleteWarning modal é clicado
yesButton.addEventListener("click", async function () {
  //Obtem o identificador da tarefa que foi guardado no atributo data-task-id do deleteWarning modal
  const taskId = deleteWarning.getAttribute("data-task-id");

  // Make a DELETE request to the server
  const response = await fetch(
    `http://localhost:8080/demo-1.0-SNAPSHOT/rest/task/desactivate?id=${taskId}&role=${localStorage.getItem(
      "role"
    )}`,
    {
      method: "PUT",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    }
  );

  const data = await response.json(); // parse the response body

  if (!response.ok) {
    alert(`Failed to deactivate task: ${data.message}`); // display the message from the service
    return;
  }

  // Call the function to display the tasks
  const category = categoryFilter.value;
  const owner = ownerFilter.value;
  await displayTasks(category, owner);
  await populateUsersOwners();
  await populateActiveCategories();

  // Hide the deleteWarning modal and remove the darkening of the page background
  deleteWarning.style.display = "none";
  document.body.classList.remove("modal-open");
});

noButton.addEventListener("click", function () {
  //Esconde o deleteWarning modal e remove o escurecimento do fundo da página
  deleteWarning.style.display = "none";
  document.body.classList.remove("modal-open");
});

//Listener para quando o botão de "Delete" do popup menu é clicado

//Listener para quando o botão de "Edit" do popup menu é clicado
editTaskOption.addEventListener("click", async () => {
  //Esconde o popup menu
  contextMenu.style.display = "none";
  const taskId = contextMenu.getAttribute("data-task-id");

  // Fetch permission from the server
  const response = await fetch(
    "http://localhost:8080/demo-1.0-SNAPSHOT/rest/user/hasPermissionToEdit",
    {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
        taskId: taskId,
      },
    }
  );

  if (response.ok) {
    //Redireciona para a página de editar tarefa
    window.location.href = "editTaskPage.html";
  } else {
    alert("You do not have permission to edit this task");
  }
});

deleteTaskOption.addEventListener("click", async () => {
  //Obtem o id da tarefa que foi largada sobre o trashIcon
  const taskId = sessionStorage.getItem("taskID");

  //Guarda o id da tarefa no atributo data-task-id do deleteWarning modal
  deleteWarning.setAttribute("data-task-id", taskId);

  //Mostra o deleteWarning modal
  deleteWarning.style.display = "block";
  //Escura o fundo da página
  document.body.classList.add("modal-open");
});

//Listener para quando o botão de "Ok" do modal de detalhes da tarefa é clicado
modalOkButton.addEventListener("click", function () {
  //Esconde o modal de detalhes da tarefa e remove o escurecimento do fundo da página
  taskDetailsModal.style.display = "none";
  document.body.classList.remove("modal-open");
});

//Listener para quando o botão de "Ok" do modal de aviso é clicado
okButton.addEventListener("click", function (event) {
  event.preventDefault();
  //Esconde o modal de aviso e remove o escurecimento do fundo da página
  warningModal.style.display = "none";
  //Remove o escurecimento do fundo da página
  document.getElementById("modalOverlay2").style.display = "none";
});

// //Listener para quando o botão de "Edit Profile" é clicado
// editProfileButton.addEventListener("click", function () {
//   localStorage.setItem("selectedUser", localStorage.getItem("username"));
//   window.location.href = "editProfile.html";
// });

//Função que permite que um elemento seja largado sobre outro elemento, prevenindo o comportamento padrão do browser
function allowDrop(event) {
  event.preventDefault();
}

async function drop(event) {
  console.log("drop event");
  // Prevent default behavior
  event.preventDefault();
  event.stopPropagation();

  // Get the task ID that was dropped onto the section
  const taskId = event.dataTransfer.getData("text/plain");

  // Get the target section where the task was dropped
  let targetSection = event.target;

  // If the target does not have the class 'taskArea', find the closest 'task-element' and then its parent section
  if (!targetSection.classList.contains("taskArea")) {
    targetSection = targetSection.closest(".task-element").closest(".taskArea");
  }

  // Determine the new status based on the target section
  let newStatus;
  if (targetSection.id === "todo") {
    newStatus = 100;
  } else if (targetSection.id === "doing") {
    newStatus = 200;
  } else if (targetSection.id === "done") {
    newStatus = 300;
  } else {
    alert("Invalid drop target");
    return;
  }

  // Make a PUT request to update the task status
  const response = await fetch(
    `http://localhost:8080/demo-1.0-SNAPSHOT/rest/task/updateStatus?id=${taskId}&status=${newStatus}`,
    {
      method: "PUT",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    }
  );

  if (!response.ok) {
    alert("Failed to update task status");
    return;
  } else {
    const category = categoryFilter.value;
    const owner = ownerFilter.value;
    await displayTasks(category, owner);
  }

  // Call displayTasks() to update the task lists
}

//Função que gera um id único para uma tarefa
function generateUniqueID() {
  let id;
  //Gera um id aleatório e verifica se esse id já existe nas 3 listas de tarefas
  do {
    id = Math.floor(Math.random() * 1000000);
  } while (
    ToDoTasks.some((task) => task.identificador === id) ||
    DoingTasks.some((task) => task.identificador === id) ||
    DoneTasks.some((task) => task.identificador === id)
  );
  return id;
}

//Função que imprime as tarefas nas secções correspondentes
async function displayTasks(selectedCategory = "", selectedOwner = "") {
  // Clear all task sections
  todoSection.innerHTML = "";
  doingSection.innerHTML = "";
  doneSection.innerHTML = "";

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

  tasks = tasks.filter((task) => task.active === true);

  // Filter tasks based on the selected filter values
  tasks = tasks.filter((task) => {
    return (
      (selectedCategory === "" || task.category === selectedCategory) &&
      (selectedOwner === "" || task.owner === selectedOwner)
    );
  });

  tasks.sort((a, b) => {
    // Sort by priority first
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }

    // If priority is the same, sort by initialDate
    if (a.initialDate !== b.initialDate) {
      return new Date(a.initialDate) - new Date(b.initialDate);
    }

    // If initialDate is also the same, sort by finalDate
    return new Date(a.finalDate) - new Date(b.finalDate);
  });

  //Adiciona as tarefas à secção ToDo
  tasks
    .filter((task) => task.status === 100)
    .forEach((task) => {
      todoSection.appendChild(createTaskElement(task));
    });

  //Adiciona as tarefas à secção Doing
  tasks
    .filter((task) => task.status === 200)
    .forEach((task) => {
      doingSection.appendChild(createTaskElement(task));
    });

  //Adiciona as tarefas à secção Done
  tasks
    .filter((task) => task.status === 300)
    .forEach((task) => {
      doneSection.appendChild(createTaskElement(task));
    });
}

//Função que cria um elemento para uma tarefa na secção correspondente
function createTaskElement(task) {
  //Cria um elemento div para a tarefa
  const taskElement = document.createElement("div");
  taskElement.classList.add("task-element");

  //Cria um elemento div para o titulo da tarefa para que o mesmo possa ser estilizado
  const titleContainer = document.createElement("div");
  titleContainer.classList.add("title");
  titleContainer.textContent = task.title;
  taskElement.appendChild(titleContainer);
  //Atribui o id ao elemento div pelo identificador da tarefa
  taskElement.id = task.id;
  //Define que o elemento div é arrastável
  taskElement.draggable = true;

  //Cria um elemento img para o icon da prioridade
  const priorityIcon = document.createElement("img");
  priorityIcon.classList.add("priority-icon");

  //Define o icon da prioridade de acordo com a prioridade da tarefa
  switch (task.priority) {
    case 100:
      priorityIcon.src = "resources/Icons/low_priority.png";
      break;
    case 200:
      priorityIcon.src = "resources/Icons/medium_priority.png";
      break;
    case 300:
      priorityIcon.src = "resources/Icons/high_priority.png";
      break;
    default:
      break;
  }
  const infoBlock = document.createElement("div");
  infoBlock.classList.add("info-block");
  //Owner & Category
  const owner = document.createElement("div");
  owner.textContent = task.owner;
  owner.classList.add("owner-label");
  infoBlock.appendChild(owner);

  const category = document.createElement("div");
  category.textContent = task.category;
  category.textContent = task.category;
  document.querySelectorAll(".category-label").forEach(function (label) {
    if (label.textContent.length > 14) {
      label.textContent = label.textContent.substring(0, 14) + "...";
    }
  });
  category.classList.add("category-label");
  infoBlock.appendChild(category);

  taskElement.appendChild(infoBlock);
  //Adiciona o icon da prioridade ao elemento div
  taskElement.appendChild(priorityIcon);

  //Define que a informação do elemento arrastável é o id da tarefa
  taskElement.addEventListener("dragstart", function (event) {
    // This will happen for all tasks
    event.dataTransfer.setData("text/plain", event.target.id);

    // If the role is 'dev' and the task owner is the logged in user, or the role is not 'dev', show the trash icon
    if (
      (localStorage.getItem("role") === "dev" &&
        task.owner === localStorage.getItem("username")) ||
      localStorage.getItem("role") !== "dev"
    ) {
      trashIcon.classList.add("show");
    }
  });

  //Define que o icon do lixo é escondido quando o elemento arrastável é largado
  taskElement.addEventListener("dragend", function (e) {
    trashIcon.classList.remove("show");
  });

  //Adiciona um listener para quando o elemento div é clicado duas vezes
  taskElement.addEventListener("dblclick", function () {
    //Coloca no modal os detalhes da tarefa o titulo e a descrição
    modalTaskTitle.textContent = task.title;
    modalTaskDescription.textContent = task.description;
    taskInitialDateinfo.textContent = task.initialDate;
    taskFinalDateinfo.textContent = task.finalDate;
    taskCategoryinfo.textContent = task.category;
    taskOwnerinfo.textContent = task.owner;

    //Mostra o modal escurecendo o fundo da página
    taskDetailsModal.style.display = "block";
    document.body.classList.add("modal-open");
  });

  //Adiciona um listener para quando o elemento div é clicado com o botão direito
  taskElement.addEventListener("contextmenu", (e) => {
    // Prevent the default browser context menu
    e.preventDefault();

    // If the role is 'dev' and the task owner is the logged in user, or the role is not 'dev', show custom context menu
    if (
      (localStorage.getItem("role") === "dev" &&
        task.owner === localStorage.getItem("username")) ||
      localStorage.getItem("role") !== "dev"
    ) {
      // Style the popup menu to appear where the cursor is right-clicked
      contextMenu.style.top = `${e.pageY}px`;
      contextMenu.style.left = `${e.pageX}px`;

      // Store the task identifier and priority
      contextMenu.setAttribute("data-task-id", task.id);

      // Store the task identifier in sessionStorage
      sessionStorage.setItem("taskID", task.id);

      // Show the popup menu
      contextMenu.style.display = "block";
    }
  });

  // taskElement.addEventListener("dragover", function (event) {
  //   event.stopPropagation(); // Prevent the event from bubbling up to the parent
  // });

  // taskElement.addEventListener("drop", function (event) {
  //   event.stopPropagation(); // Prevent the event from bubbling up to the parent
  // });
  //Retorna o elemento div
  return taskElement;
}

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

async function addTask(task) {
  await fetch("http://localhost:8080/demo-1.0-SNAPSHOT/rest/task/add", {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      token: localStorage.getItem("token"),
    },
    body: JSON.stringify(task),
  }).then((response) => {
    if (response.status === 200) {
      console.log(JSON.stringify(task));
      // alert("Task is added successfully :)");
      document.body.classList.remove("modal-open"); // Comment this line
      newTaskModal.style.display = "none"; // Comment this line
    } else {
      return response.text(); // read the response body as text
    }
  });
}

async function getUserPartial() {
  const response = await fetch(
    "http://localhost:8080/demo-1.0-SNAPSHOT/rest/user/getPartial",
    {
      method: "GET",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    }
  );

  if (response.status === 401) {
    alert("Unauthorized");
    return;
  }

  const userPartial = await response.json();
  console.log(userPartial);

  // Store the user partial data in the session storage
  sessionStorage.setItem("userPartial", JSON.stringify(userPartial));
}

async function logout(token) {
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

async function populateCategories() {
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
    alert("Failed to fetch categories");
    return;
  }

  const categories = await response.json();
  const select = document.getElementById("taskCategory");

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.title; // set the value to the category id
    option.text = category.title; // set the text to the category title
    select.appendChild(option);
  });
}

async function populateUsersOwners() {
  fetch("http://localhost:8080/demo-1.0-SNAPSHOT/rest/user/getUsersOwners", {
    method: "GET",
    headers: new Headers({
      token: localStorage.getItem("token"),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const ownerFilter = document.getElementById("ownerFilter");
      // Clear the options
      ownerFilter.innerHTML = "";

      // Add default option
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.text = "Please select";
      ownerFilter.add(defaultOption);

      const addedUsernames = new Set();
      data.forEach((user) => {
        if (!addedUsernames.has(user.username)) {
          const option = document.createElement("option");
          option.value = user.username;
          option.text = user.username;
          ownerFilter.add(option);
          addedUsernames.add(user.username);
        }
      });
    })
    .catch((error) => console.error("Error:", error));
}

async function populateActiveCategories() {
  fetch("http://localhost:8080/demo-1.0-SNAPSHOT/rest/category/active", {
    method: "GET",
    headers: new Headers({
      token: localStorage.getItem("token"),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      const categoryFilter = document.getElementById("categoryFilter");
      // Clear the options
      categoryFilter.innerHTML = "";

      // Add default option
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.text = "Please select";
      categoryFilter.add(defaultOption);

      const addedCategories = new Set();
      data.forEach((category) => {
        if (!addedCategories.has(category.title)) {
          const option = document.createElement("option");
          option.value = category.title;
          option.text = category.title;
          categoryFilter.add(option);
          addedCategories.add(category.title);
        }
      });
    })
    .catch((error) => console.error("Error:", error));
}
