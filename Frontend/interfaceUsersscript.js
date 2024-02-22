document.getElementById("addTaskButton").addEventListener("click", getUsers());

function generateTable(data) {
  let table = "<table>";
  table +=
    "<th>Photo</th><th>Username</th><th>Nome</th><th>Lastname</th><th>Email</th><th>phone</th><tbody>";
  data.forEach((item) => {
    table += `<tr><div class="trow"><td><img src="${item.photoURL}"/></td><td>${item.username}</td><td>${item.firstname}</td><td>${item.lastname}</td><td>${item.email}</td><td>${item.phone}</td><div></tr>`;
  });
  table += "</tbody></table>";

  return table;
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

function getUsers() {
  fetch("http://localhost:8080/demo-1.0-SNAPSHOT/rest/user/all", {
    method: "GET",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      username: "admin",
      password: "admin",
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

window.onload = function () {
  getUsers();
};
