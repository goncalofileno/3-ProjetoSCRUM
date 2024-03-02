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
  dateTimeDisplay.textContent = dateTimeString;
}

function verifyFields(form, messageElement) {
  let temp = false;
  if (
    form.usernameRegister.value.trim() == "" ||
    form.passwordRegister.value.trim() == "" ||
    form.emailRegister.value.trim() == "" ||
    form.firstNameRegister.value.trim() == "" ||
    form.lastNameRegister.value.trim() == "" ||
    form.phoneRegister.value.trim() == "" ||
    form.photoRegister.value.trim() == ""
  ) {
    temp = false;
    messageElement.textContent = "Fill all fields";
    messageElement.style.color = "blue";
  } else {
    temp = true;
  }
  return temp;
}

function loginUser(username, password) {
  fetch("http://localhost:8080/demo-1.0-SNAPSHOT/rest/user/login", {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      username: username,
      password: password,
    },
    credentials: "include",
  })
    .then((response) => {
      if (response.ok) {
        alert("Valid Login");
      } else if (!response.ok) {
        alert("Invalid Login");
      }
      return response.json(); // parse the response as JSON
    })
    .then((data) => {
      console.log(data); // log the data
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", username);
      window.location.href = "interface.html";
    })
    .catch((error) => {
      //   console.error("Error:", error);
      if (error.message.includes("401")) {
        alert("Unauthorized");
      } else if (error.message.includes("403")) {
        alert("Forbidden user. Please contact the administrator.");
      }
    });
}

module.exports = { getRoleFullName, displayDateTime, verifyFields, loginUser }; // export the function so it can be used in other files
