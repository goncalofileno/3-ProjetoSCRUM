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
