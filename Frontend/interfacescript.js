//Listener para quando todas as acções de quando a página carrega
window.onload = async function () {
  if (localStorage.getItem("username") === null) {
    window.location.href = "index.html";
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

const editProfileButton = document.getElementById("editProfileButton");
const taskInitialDateinfo = document.getElementById("taskInitialDateinfo");
const taskFinalDateinfo = document.getElementById("taskFinalDateinfo");

//Permite que uma tarefa seja largada sobre as secções
/*todoSection.addEventListener("drop", drop);*/
//doingSection.addEventListener("drop", drop);
//doneSection.addEventListener("drop", drop);

//Listener para quando se clica na em qualquer sitio da página
window.addEventListener("click", function (event) {
  //Se o popup menu estiver aberto e se clicar fora do popup menu, o popup menu é fechado
  if (contextMenu.style.display === "block") {
    contextMenu.style.display = "none";
  }
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

//Listener para quando o botão Add Task é clicado
addTaskButton.addEventListener("click", function () {
  // Clear the input fields of the modal
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("editTaskPriority").value = "low";
  document.getElementById("initialDate").value = "";
  document.getElementById("finalDate").value = "";

  // Get today's date
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  const yyyy = today.getFullYear();

  // Format today's date
  const formattedToday = yyyy + "-" + mm + "-" + dd;

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

//Listener para quando o botão de adicionar uma nova tarefa é clicado
submitTaskButton.addEventListener("click", async function () {
  let title = document.getElementById("taskTitle").value;
  let description = document.getElementById("taskDescription").value;
  let priority = document.getElementById("editTaskPriority").value;
  let initialDate = document.getElementById("initialDate").value;
  let finalDate = document.getElementById("finalDate").value;

  if (priority === "low") {
    priority = 100;
  } else if (priority === "medium") {
    priority = 200;
  } else {
    priority = 300;
  }

  if (
    title === "" ||
    description === "" ||
    priority === "" ||
    initialDate === "" ||
    finalDate === ""
  ) {
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
      finalDate: finalDate,
    };

    console.log(newTask);

    await addTask(newTask);
    // newTaskModal.style.display = "none"; // Comment this line
  }

  await displayTasks();
  console.log("Tasks are printed");

  // document.body.classList.remove("modal-open"); // Comment this line
});

//Listener para quando o botão de "Yes" do deleteWarning modal é clicado
yesButton.addEventListener("click", async function () {
  //Obtem o identificador da tarefa que foi guardado no atributo data-task-id do deleteWarning modal
  const taskId = deleteWarning.getAttribute("data-task-id");

  // Make a DELETE request to the server
  const response = await fetch(
    `http://localhost:8080/demo-1.0-SNAPSHOT/rest/task/delete?id=${taskId}`,
    {
      method: "DELETE",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
        username: localStorage.getItem("username"),
        password: localStorage.getItem("password"),
      },
    }
  );

  if (!response.ok) {
    alert("Failed to delete task");
    return;
  }

  // Call the function to display the tasks
  await displayTasks();

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
deleteTaskOption.addEventListener("click", () => {
  //Esconde o popup menu
  contextMenu.style.display = "none";

  //Obtem o identificador da tarefa que foi guardado no atributo data-task-id do popup menu
  const taskId = contextMenu.getAttribute("data-task-id");

  //Guarda o identificador da tarefa no atributo data-task-id do deleteWarning modal
  deleteWarning.setAttribute("data-task-id", taskId);

  //Mostra o deleteWarning modal e escurece o fundo da página
  deleteWarning.style.display = "block";
  document.body.classList.add("modal-open");
});

//Listener para quando o botão de "Edit" do popup menu é clicado
editTaskOption.addEventListener("click", () => {
  //Esconde o popup menu
  contextMenu.style.display = "none";

  //Redireciona para a página de editar tarefa
  window.location.href = "editTaskPage.html";
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

//Listener para quando o botão de "Edit Profile" é clicado
editProfileButton.addEventListener("click", function () {
  //Redireciona para a página de editar perfil
  window.location.href = "editProfile.html";
});

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
        username: localStorage.getItem("username"),
        password: localStorage.getItem("password"),
      },
    }
  );

  if (!response.ok) {
    alert("Failed to update task status");
    return;
  } else {
    await displayTasks();
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
async function displayTasks() {
  //Limpa todas as secções de tarefas
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
        username: localStorage.getItem("username"),
        password: localStorage.getItem("password"),
      },
    }
  );
  if (!response.ok) {
    alert("Failed to fetch tasks");
    return;
  }
  const tasks = await response.json();

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

  //Adiciona o icon da prioridade ao elemento div
  taskElement.appendChild(priorityIcon);

  //Define que a informação do elemento arrastável é o id da tarefa
  taskElement.addEventListener("dragstart", function (event) {
    event.dataTransfer.setData("text/plain", event.target.id);
    trashIcon.classList.add("show");
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

    //Mostra o modal escurecendo o fundo da página
    taskDetailsModal.style.display = "block";
    document.body.classList.add("modal-open");
  });

  //Adiciona um listener para quando o elemento div é clicado com o botão direito
  taskElement.addEventListener("contextmenu", (e) => {
    //Previnir o comportamento padrão do browser
    e.preventDefault();

    //Estiliza o popup menu para aparecer onde o cursor é clicado com o botão direito
    contextMenu.style.top = `${e.pageY}px`;
    contextMenu.style.left = `${e.pageX}px`;

    //Guarda o identificador e a prioridade da tarefa
    contextMenu.setAttribute("data-task-id", task.id);

    //Guarda o identificador da tarefa no sessionStorage
    sessionStorage.setItem("taskID", task.id);

    //Mostra o popup menu
    contextMenu.style.display = "block";
  });
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
  console.log("add task username: ", localStorage.getItem("username"));
  console.log("add task password: ", localStorage.getItem("password"));
  await fetch("http://localhost:8080/demo-1.0-SNAPSHOT/rest/task/add", {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      username: localStorage.getItem("username"),
      password: localStorage.getItem("password"),
    },
    body: JSON.stringify(task),
  }).then((response) => {
    if (response.status === 200) {
      alert("Task is added successfully :)");
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
        username: localStorage.getItem("username"),
        password: localStorage.getItem("password"),
      },
    }
  );

  if (!response.ok) {
    alert("Failed to fetch user partial data");
    return;
  }

  const userPartial = await response.json();
  console.log(userPartial);

  // Store the user partial data in the session storage
  sessionStorage.setItem("userPartial", JSON.stringify(userPartial));
}

async function logout() {
  fetch("http://localhost:8080/demo-1.0-SNAPSHOT/rest/user/logout", {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      username: localStorage.getItem("username"),
      password: localStorage.getItem("password"),
    },
  })
    .then((response) => {
      if (response.ok) {
        localStorage.clear();
        sessionStorage.clear();
        // Replace the current history entry
        window.history.replaceState(null, null, "index.html");
        // Reload the page to reflect the changes
        window.location.reload();
      } else {
        alert("Failed to logout");
      }
    })
    .catch((error) => console.error("Error:", error));
}
