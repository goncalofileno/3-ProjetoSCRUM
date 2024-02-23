package aor.paj.service;

import java.util.List;

import aor.paj.bean.UserBean;
import aor.paj.dto.*;
import aor.paj.entity.UserEntity;
import aor.paj.responses.ResponseMessage;
import aor.paj.utils.JsonUtils;
import aor.paj.validator.UserValidator;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.mindrot.jbcrypt.BCrypt;

import java.util.stream.Collectors;

@Path("/user")
public class UserService {

    @Inject
    UserBean userBean;

    //Service that receives a user object and adds it to the list of users
    @POST
    @Path("/add")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response addUser(UserDto u) {
        // Check if any parameter is null or blank
        if (UserValidator.isNullorBlank(u)) {
            return Response.status(400).entity(JsonUtils.convertObjectToJson(new ResponseMessage("One or more parameters are null or blank"))).build();
        }

        // Validate email format
        if (!UserValidator.isValidEmail(u.getEmail())) {
            return Response.status(400).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Invalid email format"))).build();
        }

        // Validate phone number format
        if (!UserValidator.isValidPhoneNumber(u.getPhone())) {
            return Response.status(400).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Invalid phone number format"))).build();
        }

        // Validate URL format
        if (!UserValidator.isValidURL(u.getPhotoURL())) {
            return Response.status(400).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Invalid URL format"))).build();
        }

        // Check if username or email already exists
        if (userBean.userExists(u)) {
            return Response.status(409).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Invalid Username or Email"))).build();
        }

        // If all checks pass, add the user
        userBean.addUser(u);
        return Response.status(200).entity(JsonUtils.convertObjectToJson(new ResponseMessage("A new user is created"))).build();
    }


    //Service that manages the login of the user, sets the token for the user and sends the token and the role of the user
    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(@HeaderParam("username") String username, @HeaderParam("password") String password) {
        String token = userBean.login(username, password);
        System.out.println(token);
        if (token != null) {
            return Response.status(200).entity(JsonUtils.convertObjectToJson(new TokenAndRoleDto(token, userBean.getUserByUsername(username).getRole()))).build();
        }
        return Response.status(401).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Unauthorized"))).build();
    }

    //Service that receives a token and loggout setting the token to null
    @POST

    @Path("/logout")
    @Produces(MediaType.APPLICATION_JSON)
    public Response logout(@HeaderParam("token") String token) {
        System.out.println(token);
        if (userBean.isValidUserByToken(token)) {
            userBean.logout(token);
            return Response.status(200).entity(JsonUtils.convertObjectToJson(new ResponseMessage("User is logged out")).toString()).build();
        }
        return Response.status(401).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Unauthorized")).toString()).build();
    }

    //Service that receives the token to validate and sends the userPartialDto object
    @GET
    @Path("/getPartial")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserPartial(@HeaderParam("token") String token) {
        if (userBean.isValidUserByToken(token)) {
            UserDto userDto = userBean.getUserByToken(token);
            UserPartialDto userPartialDTO = userBean.mapUserToUserPartialDTO(userDto);
            return Response.status(200).entity(userPartialDTO).build();
        } else {
            return Response.status(401).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Unauthorized"))).build();
        }
    }

    //Service that receives username and password and sends the user object
//    @GET
//    @Path("/get")
//    @Produces(MediaType.APPLICATION_JSON)
//    public Response getUser(@HeaderParam("username") String username, @HeaderParam("password") String password) {
//        if (UserValidator.isValidUser(userBean.getUsers(), username, password)) {
//            return Response.status(200).entity(userBean.getUser(username)).build();
//        }
//        return Response.status(401).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Unauthorized"))).build();
//    }

    //Service that receives username and password and sends the user object without the password
//    @GET
//    @Path("/getDetails")
//    @Produces(MediaType.APPLICATION_JSON)
//    public Response getUserDetails(@HeaderParam("username") String username, @HeaderParam("password") String password) {
//        if (UserValidator.isValidUser(userBean.getUsers(), username, password)) {
//            UserDto userDto = userBean.getUser(username);
//            UserDetailsDto userDetails = new UserDetailsDto(
//                    userDto.getUsername(),
//                    userDto.getFirstname(),
//                    userDto.getLastname(),
//                    userDto.getEmail(),
//                    userDto.getPhotoURL(),
//                    userDto.getPhone()
//            );
//            return Response.status(200).entity(userDetails).build();
//        } else {
//            return Response.status(401).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Unauthorized"))).build();
//        }
//    }

    //Service that only sends the first name of user and photo for the header
//    @GET
//    @Path("/getPartial")
//    @Produces(MediaType.APPLICATION_JSON)
//    public Response getUserPartial(@HeaderParam("username") String username, @HeaderParam("password") String password) {
//        if (UserValidator.isValidUser(userBean.getUsers(), username, password)) {
//            UserDto userDto = userBean.getUser(username);
//            UserPartialDto userPartialDTO = userBean.mapUserToUserPartialDTO(userDto);
//            return Response.status(200).entity(userPartialDTO).build();
//        } else {
//            return Response.status(401).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Unauthorized"))).build();
//        }
//    }

    //Service that receives a UserUpdateDto object, authenticates the user, sees if the user that is logged is the same as the one that is being updated and updates the user checking the parameteres
//    @PUT
//    @Path("/update")
//    @Consumes(MediaType.APPLICATION_JSON)
//    @Produces(MediaType.APPLICATION_JSON)
//    public Response updateUser(UserUpdateDto u, @HeaderParam("username") String username, @HeaderParam("password") String password) {
//        if (!UserValidator.isNullorBlank(u)) {
//            if (UserValidator.isValidUser(userBean.getUsers(), username, password)) {
//                if (u.getUsername().equals(username)) {
//                    if (!UserValidator.isValidEmail(u.getEmail())) {
//                        System.out.println("Invalid email format");
//                        return Response.status(400).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Invalid email format"))).build();
//                    }
//                    if (!UserValidator.isValidPhoneNumber(u.getPhone())) {
//                        System.out.println("Invalid phone number format");
//                        return Response.status(400).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Invalid phone number format"))).build();
//                    }
//                    if (!UserValidator.isValidURL(u.getPhotoURL())) {
//                        System.out.println("Invalid URL format");
//                        return Response.status(400).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Invalid URL format"))).build();
//                    }
//                    if (!UserValidator.emailExists(userBean.getUsers(), u.getEmail()) || userBean.getUser(username).getEmail().equals(u.getEmail())) {
//                        userBean.updateUser(u);
//                        System.out.println("User is updated");
//                        return Response.status(200).entity(JsonUtils.convertObjectToJson(new ResponseMessage("User is updated"))).build();
//                    }
//                }
//            }
//            System.out.println("Email already exists");
//            return Response.status(409).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Email already exists"))).build();
//        }
//        System.out.println("One or more parameters are null or blank");
//        return Response.status(400).entity(JsonUtils.convertObjectToJson(new ResponseMessage("One or more parameters are null or blank"))).build();
//    }

    //Services tha receives a UserPasswordDto object, authenticates the user, sees if the user that is logged is the same as the one that is being updated and updates the user password
//    @PUT
//    @Path("/updatePassword")
//    @Consumes(MediaType.APPLICATION_JSON)
//    @Produces(MediaType.APPLICATION_JSON)
//    public Response updatePassword(UserPasswordUpdateDto u, @HeaderParam("username") String username, @HeaderParam("password") String password) {
//        if (!UserValidator.isNullorBlank(u)) {
//            if (UserValidator.isValidUser(userBean.getUsers(), username, password)) {
//                if (!userBean.getUser(username).getPassword().equals(password)) {
//                    return Response.status(401).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Unauthorized"))).build();
//                }
//                if(!u.getOldPassword().equals(userBean.getUser(username).getPassword())) {
//                    return Response.status(400).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Old password is incorrect"))).build();
//                }
//                if (u.getNewPassword().equals(u.getOldPassword())) {
//                    return Response.status(400).entity(JsonUtils.convertObjectToJson(new ResponseMessage("New password is the same as the old password"))).build();
//                }
//                userBean.updatePassword(u, username);
//                return Response.status(200).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Password is updated")).toString()).build();
//            }
//            return Response.status(401).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Unauthorized"))).build();
//        }
//        return Response.status(401).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Invalid Parameters"))).build();
//    }

    //Service that when logout its pressed, the file its updated
//    @POST
//    @Path("/logout")
//    @Produces(MediaType.APPLICATION_JSON)
//    public Response logout(@HeaderParam("username") String username, @HeaderParam("password") String password) {
//        if (UserValidator.isValidUser(userBean.getUsers(), username, password)) {
//            JsonUtils.writeIntoJsonFile(userBean.getUsers());
//            return Response.status(200).entity(JsonUtils.convertObjectToJson(new ResponseMessage("User is logged out")).toString()).build();
//        }
//        return Response.status(401).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Unauthorized")).toString()).build();
//    }

}



