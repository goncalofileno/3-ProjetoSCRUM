//Função chamada cada vez que a página é carregada
window.onload = async function () {
  if (!localStorage.getItem("token")) {
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

  await populateCategories();

  // Get the task id from session storage
  const taskId = sessionStorage.getItem("taskID");

  let task;

  await getTaskToEdit(taskId);  

  task = JSON.parse(sessionStorage.getItem("taskToEdit"));

  //Preenche os campos do formulário com os detalhes da tarefa a editar
  document.getElementById("editarTarefaTitulo").value = task.title;
  document.getElementById("editarTarefaDescricao").value = task.description;
  setPriorityAndStatus(task.priority, task.status);
  document.getElementById("initialDate").value = task.initialDate;
  document.getElementById("finalDate").value = task.finalDate;
  document.getElementById("editTaskCategory").value = task.category;

  // Get the initial date input field
  const initialDateInput = document.getElementById("initialDate");

  // Get the final date input field
  const finalDateInput = document.getElementById("finalDate");

  initialDateInput.addEventListener("change", function () {
    finalDateInput.min = this.value;

    // If the new initial date is after the current final date, set the final date to one day after the initial date
    if (new Date(this.value) > new Date(finalDateInput.value)) {
      const newFinalDate = new Date(this.value);
      newFinalDate.setDate(newFinalDate.getDate() + 1);
      finalDateInput.value = newFinalDate.toISOString().split("T")[0];
    }
  });

  //Mostra o modal de edição e escurece o fundo
  document.getElementById("editTaskModal").style.display = "block";
  document.body.classList.add("modal-open");

  displayDateTime(); // Adiciona a exibição da data e hora
  setInterval(displayDateTime, 1000); // Atualiza a cada segundo
  //Esconde o modal de confirmação
  confirmationModal.style.display = "none";
};

//DECLARAÇÃO DE VARIÁVEIS
//Obtem o botão de guardar a edição da tarefa
const guardaEditarTarefaButton = document.getElementById("GuardaEditarTarefa");
//Obtem o botão de confirmar a edição da tarefa
const confirmEditButton = document.getElementById("confirmEditButton");
//Obtem o botão de cancelar a edição da tarefa do modal de confirmação
const cancelEditButton = document.getElementById("cancelEditButton");
//Obtem o botão de cancelar a edição da tarefa
const cancelaEditarTarefaButton = document.getElementById(
  "CancelaEditarTarefa"
);
//Obtem o modal de edição da tarefa
const modal = document.getElementById("editTaskModal");
//Obtem o modal de confirmação
const confirmationModal = document.getElementById("confirmationModal");

//LISTENERS
//Adiciona um listener para o botão de cancelar a edição da tarefa
cancelaEditarTarefaButton.addEventListener("click", function () {
  // Redireciona para interface.html
  window.location.href = "interface.html";
});

//Adiciona um listener para o botão de cancelar a edição da tarefa do modal de confirmação
cancelEditButton.addEventListener("click", function () {
  //Esconde o modal de confirmação e mostra o modal de edição
  confirmationModal.style.display = "none";
  modal.style.display = "block";
});

//Adiciona um listener para o botão de guardar a edição da tarefa
guardaEditarTarefaButton.addEventListener("click", function () {
  //Obtem a tarefa a ser editada
  const task = JSON.parse(sessionStorage.getItem("taskToEdit"));

  //Guarda os valores originais dos campos que podem ser editados
  const originalTitulo = task.title;
  const originalDescricao = task.description;
  const originalPriority = setPriorityOriginal(task.priority);
  const originalSectionName = setStatusOriginal(task.status);
  const originalCategory = task.category;
  const originalInitialDate = task.initialDate;
  const originalFinalDate = task.finalDate;

  //Obtem os valores dos campos que podem ser editados
  const editedTitulo = document.getElementById("editarTarefaTitulo").value;
  const editedDescricao = document.getElementById(
    "editarTarefaDescricao"
  ).value;
  const selectedSectionName = document.getElementById("editTaskStatus").value;
  const selectedPriority = document.getElementById("editTaskPriority").value;
  const selectedCategory = document.getElementById("editTaskCategory").value;
  const editedInitialDate = document.getElementById("initialDate").value;
  const editedFinalDate = document.getElementById("finalDate").value;

  //Verifica se algum dos campos foi alterado
  if (
    editedTitulo !== originalTitulo ||
    editedDescricao !== originalDescricao ||
    selectedSectionName !== originalSectionName ||
    selectedPriority !== originalPriority ||
    editedInitialDate !== originalInitialDate ||
    editedFinalDate !== originalFinalDate ||
    selectedCategory !== originalCategory
  ) {
    //Se algum dos campos foi alterado, mostra o modal de confirmação e escurece o fundo
    const confirmationModal = document.getElementById("confirmationModal");
    confirmationModal.style.display = "block";
    modal.style.display = "none";
  }
});

confirmEditButton.addEventListener("click", function () {
  //Obtem os valores dos campos que podem ser editados
  const editedTitulo = document.getElementById("editarTarefaTitulo").value;
  const editedDescricao = document.getElementById(
    "editarTarefaDescricao"
  ).value;
  const selectedPriority = document.getElementById("editTaskPriority").value;
  const selectedSectionName = document.getElementById("editTaskStatus").value;
  const selectedCategory = document.getElementById("editTaskCategory").value;
  const editedInitialDate = document.getElementById("initialDate").value;
  const editedFinalDate = document.getElementById("finalDate").value;

  //Cria um objeto com os valores dos campos que podem ser editados
  let task = {
    title: editedTitulo,
    description: editedDescricao,
    priority: setIntPriority(selectedPriority),
    status: setIntStatus(selectedSectionName),
    category: selectedCategory,
    initialDate: editedInitialDate,
    finalDate: editedFinalDate,
  };

  let taskId = sessionStorage.getItem("taskID");

  updateTask(task, taskId);

  //Redireciona para interface.html
  window.location.href = "interface.html";
  //window.location.reload();
});
// Função para exibir a data e hora atuais
function displayDateTime() {
  const currentDate = new Date();

  // Formata a data e hora como string
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

//Função que recebe como int a prioridade e status, faz a conversão para string e coloca no campo correspondente
function setPriorityAndStatus(priority, status) {
  let priorityString;
  let statusString;
  switch (priority) {
    case 100:
      priorityString = "low";
      break;
    case 200:
      priorityString = "medium";
      break;
    case 300:
      priorityString = "high";
      break;
  }
  switch (status) {
    case 100:
      statusString = "ToDo";
      break;
    case 200:
      statusString = "Doing";
      break;
    case 300:
      statusString = "Done";
      break;
  }
  document.getElementById("editTaskPriority").value = priorityString;
  document.getElementById("editTaskStatus").value = statusString;
}

//Função que recebe como int a prioridade e status, faz a conversão para string e coloca no campo correspondente
function setPriorityOriginal(priority) {
  let priorityString;
  switch (priority) {
    case 100:
      priorityString = "low";
      break;
    case 200:
      priorityString = "medium";
      break;
    case 300:
      priorityString = "high";
      break;
  }
  return priorityString;
}

function setStatusOriginal(status) {
  let statusString;
  switch (status) {
    case 100:
      statusString = "ToDo";
      break;
    case 200:
      statusString = "Doing";
      break;
    case 300:
      statusString = "Done";
      break;
  }
  return statusString;
}

function setIntPriority(priority) {
  let intPriority;
  switch (priority) {
    case "low":
      intPriority = 100;
      break;
    case "medium":
      intPriority = 200;
      break;
    case "high":
      intPriority = 300;
      break;
  }
  return intPriority;
}

function setIntStatus(status) {
  let intStatus;
  switch (status) {
    case "ToDo":
      intStatus = 100;
      break;
    case "Doing":
      intStatus = 200;
      break;
    case "Done":
      intStatus = 300;
      break;
  }
  return intStatus;
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

  const dateTimeDisplay = document.getElementById("dateTimeDisplay");

  // Atualiza o conteúdo do elemento
  dateTimeDisplay.textContent = dateTimeString;
}

function updateTask(task, taskId) {
  console.log(task);
  console.log(taskId);
  fetch(
    `http://localhost:8080/demo-1.0-SNAPSHOT/rest/task/update?id=${taskId}`,
    {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
        "token": localStorage.getItem("token"),
      }),
      body: JSON.stringify(task),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (response.status === 200) {
        alert("Task is updated");
      } else if (response.status === 400) {
        alert("Invalid task");
      } else if (response.status === 401) {
        if (data.message === "Unauthorized") {
          alert("Unauthorized");
        } else {
          alert("Invalid Credentials");
        }
      } else if (response.status === 403) {
        alert("Forbidden");
      } else {
        alert("Invalid status");
      }
    })
    .catch((error) => {
      alert("Error: " + error);
    });
}

async function populateCategories() {
  const response = await fetch("http://localhost:8080/demo-1.0-SNAPSHOT/rest/category/all", {
    method: "GET",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      token: localStorage.getItem("token"),
    },
  });

  if (!response.ok) {
    alert("Failed to fetch categories");
    return;
  }

  const categories = await response.json();
  const select = document.getElementById("editTaskCategory");

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.title; // set the value to the category id
    option.text = category.title; // set the text to the category title
    select.appendChild(option);
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

async function getTaskToEdit(taskId) {
  await fetch(
    `http://localhost:8080/demo-1.0-SNAPSHOT/rest/task/get?id=${taskId}`,
    {
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      sessionStorage.setItem("taskToEdit", JSON.stringify(data));
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

}

