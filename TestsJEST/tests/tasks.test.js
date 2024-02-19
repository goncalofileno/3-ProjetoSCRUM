const apiURL = "http://localhost:8080/demo-1.0-SNAPSHOT/rest";
const request = require("supertest");

describe("Add user task", () => {
  it("should add a task if valid username, password and task are provided", async () => {
    const task = {
        "title": "Task 10", 
        "description": "10101010", 
        "priority": 300, 
        "initialDate": "2024-02-20", 
        "finalDate": "2024-02-23"
    };
    const response = await request(apiURL)
      .post("/task/add")
      .set("Accept", "*/*")
      .set('Content-Type', 'application/json')
      .set({ username: "goncalo", password: "goncalo" })
      .send(task);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({message:"Task is added"});
  });

  it("should return 400 if invalid task is provided", async () => {
    const task = {
      title: "Task 2",
      description: "22222",
      priority: "100",
      initialDate: "2024-sadasda-12",
      finalDate: "2024-02-13",
    };
    const response = await request(apiURL)
      .post("/task/add")
      .set("Accept", "*/*")
      .set('Content-Type', 'application/json')
      .set({ username: "goncalo", password: "goncalo" })
      .send(task);
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({message:"Invalid task"});
  });

  it("should return 401 if username or password is not provided", async () => {
    const task = {
      title: "Task 56",
      description: "22222",
      priority: "100",
      initialDate: "2024-02-12",
      finalDate: "2024-02-13",
    };
    const response = await request(apiURL)
      .post("/task/add")
      .set("Accept", "*/*")
      .set('Content-Type', 'application/json')
      .send(task);
    expect(response.statusCode).toEqual(401);
    expect(response.body).toEqual({message:"Unauthorized"});
  });

  it("should return 403 if invalid username or password is provided", async () => {
    const task = {
      title: "Task 56",
      description: "22222",
      priority: "100",
      initialDate: "2024-02-12",
      finalDate: "2024-02-13",
    };
    const response = await request(apiURL)
      .post("/task/add")
      .set("Accept", "*/*")
      .set('Content-Type', 'application/json')
      .set({ username: "goncalo", password: "goncalo232" })
      .send(task);
    expect(response.statusCode).toEqual(403);
    expect(response.body).toEqual({message:"Invalid Credentials"});
  });
});

describe('Task update status', () => {
    it('should update the task status if valid username, password, id and status are provided', async () => {
      const response = await request(apiURL)
        .put('/task/updateStatus')
        .set({ username: "goncalo", password: "goncalo" })
        .query({ id: 1, status: 200 });
  
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ message: "Task is updated" });
    });
  
    it('should return an error if invalid username or password is provided', async () => {
      const response = await request(apiURL)
        .put('/task/updateStatus')
        .set({ username: "invalid", password: "invalid" })
        .query({ id: 1, status: 300 });
  
      // Replace 400 and "Unauthorized" with the actual status code and message your server returns
      expect(response.statusCode).toEqual(401);
      expect(response.body).toEqual({ message: "Invalid Credentials" });
    });

    it('should return an error if invalid task is provided', async () => {
        const response = await request(apiURL)
          .put('/task/updateStatus')
          .set({ username: "goncalo", password: "goncalo" })
          .query({ id: 10, status: 300 });
    
        // Replace 400 and "Unauthorized" with the actual status code and message your server returns
        expect(response.statusCode).toEqual(403);
        expect(response.body).toEqual({ message: "Forbidden" });
      });
  
    // Add more tests for other error conditions...
  });

  describe('Task delete', () => {
    it('should delete the task if valid username, password and id are provided', async () => {
      const response = await request(apiURL)
        .delete('/task/delete')
        .set({ username: "goncalo", password: "goncalo" })
        .query({ id: 1 });
  
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({ message: "Task is deleted" });
    });
  
    it('should return an error if invalid username or password is provided', async () => {
      const response = await request(apiURL)
        .delete('/task/delete')
        .set({ username: "invalid", password: "invalid" })
        .query({ id: 1 });
  
   
      expect(response.statusCode).toEqual(401);
      expect(response.body).toEqual({ message: "Invalid Credentials" });
    });

    it('should return an error if invalid task is provided', async () => {
        const response = await request(apiURL)
          .delete('/task/delete')
          .set({ username: "goncalo", password: "goncalo" })
          .query({ id: 112 });
    
        
        expect(response.statusCode).toEqual(403);
        expect(response.body).toEqual({ message: "Forbidden" });
      });
  
  });
