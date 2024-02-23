//package aor.paj.service;
//
//import aor.paj.bean.TaskBean;
//import aor.paj.dto.TaskDto;
//import aor.paj.responses.ResponseMessage;
//import aor.paj.utils.JsonUtils;
//import aor.paj.validator.TaskValidator;
//import aor.paj.validator.UserValidator;
//import jakarta.inject.Inject;
//import jakarta.json.bind.JsonbException;
//import jakarta.ws.rs.Consumes;
//import jakarta.ws.rs.DELETE;
//import jakarta.ws.rs.GET;
//import jakarta.ws.rs.HeaderParam;
//import jakarta.ws.rs.POST;
//import jakarta.ws.rs.PUT;
//import jakarta.ws.rs.Produces;
//import jakarta.ws.rs.QueryParam;
//import jakarta.ws.rs.core.MediaType;
//import jakarta.ws.rs.core.Response;
//import jakarta.ws.rs.Path;
//
//@Path("/task")
//public class TaskService {
//
//    @Inject
//    TaskBean taskBean;
//
//    //Service that receives a task object and adds it to the list of tasks of the user that is logged
//    @POST
//    @Path("/add")
//    @Consumes(MediaType.APPLICATION_JSON)
//    @Produces(MediaType.APPLICATION_JSON)
//    public Response addUserTask(@HeaderParam("username") String username, @HeaderParam("password") String password, TaskDto t) {
//        if (UserValidator.isValidUser(taskBean.getUsers(), username, password)) {
//            if (TaskValidator.isValidTask(t)) {
//                taskBean.addTask(username, t);
//                return Response.status(200).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Task is added"))).build();
//            } else {
//                return Response.status(400).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Invalid task"))).build();
//            }
//        } else {
//            if (username == null || password == null) {
//                return Response.status(401).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Unauthorized"))).build();
//            } else {
//                return Response.status(403).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Invalid Credentials"))).build();
//            }
//        }
//    }
//
//    //Service that receives a task and its id and updates the task
//    @PUT
//    @Path("/update")
//    @Consumes(MediaType.APPLICATION_JSON)
//    @Produces(MediaType.APPLICATION_JSON)
//    public Response updateTask(@HeaderParam("username") String username, @HeaderParam("password") String password, @QueryParam("id") int id, TaskDto t) {
//        if (UserValidator.isValidUser(taskBean.getUsers(), username, password) && taskBean.taskBelongsToUser(username, id)) {
//            if (TaskValidator.isValidTaskEdit(t)) {
//                taskBean.updateTask(id, t);
//                return Response.status(200).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Task is updated"))).build();
//            } else {
//                return Response.status(400).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Invalid task"))).build();
//            }
//        } else {
//            return getResponse(username, password, id);
//        }
//    }
//
//    //Service that receives a task id and status number and updates the task status
//    @PUT
//    @Path("/updateStatus")
//    @Consumes(MediaType.APPLICATION_JSON)
//    @Produces(MediaType.APPLICATION_JSON)
//    public Response updateTask(@HeaderParam("username") String username, @HeaderParam("password") String password, @QueryParam("id") int id, @QueryParam("status") int status) {
//        if (UserValidator.isValidUser(taskBean.getUsers(), username, password) && taskBean.taskBelongsToUser(username, id) && TaskValidator.isValidStatus(status)) {
//            taskBean.updateTaskStatus(username, id, status);
//            return Response.status(200).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Task is updated"))).build();
//        } else {
//            return getResponse(username, password, id);
//        }
//    }
//
//    //Service that sends the list of tasks of the user that is logged
//    @GET
//    @Path("/all")
//    @Consumes(MediaType.APPLICATION_JSON)
//    @Produces(MediaType.APPLICATION_JSON)
//    public Response getTasks(@HeaderParam("username") String username, @HeaderParam("password") String password) {
//        if (UserValidator.isValidUser(taskBean.getUsers(), username, password)) {
//            return Response.status(200).entity(taskBean.getTasks(username)).build();
//        } else {
//            return Response.status(401).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Unauthorized"))).build();
//        }
//    }
//
//    //Service that sends a task object that has the id that is received
//    @GET
//    @Path("/get")
//    @Consumes(MediaType.APPLICATION_JSON)
//    @Produces(MediaType.APPLICATION_JSON)
//    public Response getTask(@HeaderParam("username") String username, @HeaderParam("password") String password, @QueryParam("id") int id) {
//        if (UserValidator.isValidUser(taskBean.getUsers(), username, password) && taskBean.taskBelongsToUser(username, id)) {
//            return Response.status(200).entity(taskBean.getTask(username, id)).build();
//        } else {
//            return getResponse(username, password, id);
//        }
//    }
//
//    //Service that receives a task id and deletes the whole task from the user that is logged
//    @DELETE
//    @Path("/delete")
//    @Consumes(MediaType.APPLICATION_JSON)
//    @Produces(MediaType.APPLICATION_JSON)
//    public Response removeTask(@HeaderParam("username") String username, @HeaderParam("password") String password, @QueryParam("id") int id) {
//        if (UserValidator.isValidUser(taskBean.getUsers(), username, password) && taskBean.taskBelongsToUser(username, id)) {
//            taskBean.removeTask(username, id);
//            return Response.status(200).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Task is deleted"))).build();
//        } else {
//            return getResponse(username, password, id);
//        }
//    }
//
//    //Function to handle the response of some services
//    public Response getResponse(@HeaderParam("username") String username, @HeaderParam("password") String password, @QueryParam("id") int id) {
//        if (username == null || password == null) {
//            return Response.status(401).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Unauthorized"))).build();
//        } else if (!UserValidator.isValidUser(taskBean.getUsers(), username, password)) {
//            return Response.status(401).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Invalid Credentials"))).build();
//        } else if (!taskBean.taskBelongsToUser(username, id)) {
//            return Response.status(403).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Forbidden"))).build();
//        } else {
//            return Response.status(400).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Invalid status"))).build();
//        }
//    }
//}
