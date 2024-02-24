package aor.paj.service;

import aor.paj.bean.TaskBean;
import aor.paj.bean.UserBean;
import aor.paj.dto.TaskDto;
import aor.paj.responses.ResponseMessage;
import aor.paj.utils.JsonUtils;
import aor.paj.validator.TaskValidator;
import aor.paj.validator.UserValidator;
import jakarta.inject.Inject;
import jakarta.json.bind.JsonbException;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.Path;

import java.util.Objects;

@Path("/task")
public class TaskService {
    //
    @Inject
    TaskBean taskBean;

    @Inject
    UserBean userBean;

    //Service that receives a taskdto and a token and creates a new task with the user in token and adds the task to the task table in the database mysql
    @POST
    @Path("/add")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addTask(@HeaderParam("token") String token, TaskDto t) {
        if (userBean.isValidUserByToken(token)) {
            if (TaskValidator.isValidTask(t) && !taskBean.taskTitleExists(t)) {
                if (taskBean.addTask(token, t)) {
                    return Response.status(200).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Task is added"))).build();
                } else {
                    return Response.status(400).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Cannot add task"))).build();
                }
            } else {
                return Response.status(400).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Invalid task"))).build();
            }
        } else {
            return Response.status(401).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Unauthorized"))).build();
        }
    }

    //Service that gets all tasks from database
    @GET
    @Path("/all")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTasks(@HeaderParam("token") String token) {
        if (userBean.isValidUserByToken(token)) {
            return Response.status(200).entity(taskBean.getAllTasks()).build();
        } else {
            return Response.status(401).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Unauthorized"))).build();
        }
    }

    //Service that updates the task status
    @PUT
    @Path("/updateStatus")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateTask(@HeaderParam("token") String token, @QueryParam("id") int id, @QueryParam("status") int status) {
        if (userBean.isValidUserByToken(token) && TaskValidator.isValidStatus(status)) {
            taskBean.updateTaskStatus(id, status);
            return Response.status(200).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Task is updated"))).build();
        } else {
            return Response.status(400).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Invalid status"))).build();
        }
    }

    //Service that receives a task id, a token and a role, and checls if the user has the role to desactivate the task, and if its owner of task to desactivate it
    @PUT
    @Path("/desactivate")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response desactivateTask(@HeaderParam("token") String token, @QueryParam("id") int id, @QueryParam("role") String role) {
        if (userBean.isValidUserByToken(token)){
            if(taskBean.taskBelongsToUser(token, id)){
                if (taskBean.desactivateTask(id)) {
                    return Response.status(200).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Task is desactivated"))).build();
                } else {
                    return Response.status(400).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Cannot desactivate task"))).build();
                }
            } else if(!Objects.equals(role, "dev")){
                if (taskBean.desactivateTask(id)) {
                    return Response.status(200).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Task is desactivated"))).build();
                } else {
                    return Response.status(400).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Cannot desactivate task"))).build();
                }
            } else {
                return Response.status(403).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Forbidden"))).build();
            }
        } else {
            return Response.status(401).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Unauthorized"))).build();
        }
    }


//
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
}
