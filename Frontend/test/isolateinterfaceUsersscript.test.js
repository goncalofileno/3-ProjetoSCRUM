const {
  getRoleFullName,
  displayDateTime,
  verifyFields,
  loginUser,
} = require("./isolateinterfaceUsersscript");

test('getRoleFullName("dev") returns "Developer"', () => {
  expect(getRoleFullName("dev")).toBe("Developer");
});

test("getRoleFullName('po') returns 'Product Owner'", () => {
  expect(getRoleFullName("po")).toBe("Product Owner");
});

test("getRoleFullName('sm') returns 'Scrum Master'", () => {
  expect(getRoleFullName("sm")).toBe("Scrum Master");
});
test("getRoleFullName('test') returns 'test'", () => {
  expect(getRoleFullName("test")).toBe("test");
});

// Import jest-dom
require("@testing-library/jest-dom");
global.document = {
  createElement: jest.fn().mockReturnValue({
    id: "dateTimeDisplay",
    textContent: "",
  }),
};

describe("displayDateTime", () => {
  it("should update dateTimeDisplay textContent with the current date and time", () => {
    // Mock dateTimeDisplay element
    const dateTimeDisplay = document.createElement("div");
    dateTimeDisplay.id = "dateTimeDisplay";

    // Mock document.getElementById
    document.getElementById = jest.fn().mockReturnValue(dateTimeDisplay);

    // Call the function
    displayDateTime();

    // Check if dateTimeDisplay textContent was updated
    const currentDate = new Date();
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
    const expectedDateTimeString = currentDate.toLocaleDateString(
      "en-US",
      options
    );
    expect(dateTimeDisplay.textContent).toBe(expectedDateTimeString);
  });
});

describe("displayDateTime", () => {
  it("should update dateTimeDisplay textContent with the current date and time in a different format", () => {
    // Mock dateTimeDisplay element
    const dateTimeDisplay = document.createElement("div");
    dateTimeDisplay.id = "dateTimeDisplay";

    // Mock document.getElementById
    document.getElementById = jest.fn().mockReturnValue(dateTimeDisplay);

    // Call the function
    displayDateTime();

    // Check if dateTimeDisplay textContent was updated
    const currentDate = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "short", // Change to short month name
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    };
    const expectedDateTimeString = currentDate.toLocaleDateString(
      "en-GB", // Change to British English locale
      options
    );
    expect(dateTimeDisplay.textContent).not.toBe(expectedDateTimeString);
  });
});

describe("verifyFields", () => {
  it("should return false and set messageElement textContent if any field is empty", () => {
    // Mock form and messageElement
    const form = {
      usernameRegister: { value: " " },
      passwordRegister: { value: "password" },
      emailRegister: { value: "email@example.com" },
      firstNameRegister: { value: "First" },
      lastNameRegister: { value: "Last" },
      phoneRegister: { value: "1234567890" },
      photoRegister: { value: "photo.jpg" },
    };
    const messageElement = { textContent: "", style: { color: "" } };

    // Call the function
    const result = verifyFields(form, messageElement);

    // Check the result and messageElement
    expect(result).toBe(false);
    expect(messageElement.textContent).toBe("Fill all fields");
    expect(messageElement.style.color).toBe("blue");
  });

  it("should return true if all fields are filled", () => {
    // Mock form and messageElement
    const form = {
      usernameRegister: { value: "username" },
      passwordRegister: { value: "password" },
      emailRegister: { value: "email@example.com" },
      firstNameRegister: { value: "First" },
      lastNameRegister: { value: "Last" },
      phoneRegister: { value: "1234567890" },
      photoRegister: { value: "photo.jpg" },
    };
    const messageElement = { textContent: "", style: { color: "" } };

    // Call the function
    const result = verifyFields(form, messageElement);

    // Check the result
    expect(result).toBe(true);
  });
});

const apiURL = "http://localhost:8080/demo-1.0-SNAPSHOT/rest";

test("loginUser should send a POST request to /user/login", () => {
  // Mock fetch
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({ message: "Valid Login" }),
  });

  // Call the function
  loginUser("admin", "admin");

  // Check if fetch was called with the correct arguments
  expect(fetch).toHaveBeenCalledWith(`${apiURL}/user/login`, {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      username: "admin",
      password: "admin",
    },
    credentials: "include",
  });
});

test("loginUser should send a POST request to /user/login", () => {
  // Mock fetch
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({ message: "Valid Login" }),
  });

  username = "admin1";
  password = "admin1";
  // Call the function
  loginUser("admin1", "admin1");

  // Check if fetch was called with the correct arguments
  expect(fetch).toHaveBeenCalledWith(`${apiURL}/user/login`, {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      username: username,
      password: password,
    },
    credentials: "include",
  });
  expect(fetch).toHaveBeenCalledTimes(1);
});
