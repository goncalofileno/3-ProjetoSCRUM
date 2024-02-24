package aor.paj.service;

import aor.paj.bean.CategoryBean;
import aor.paj.bean.UserBean;
import aor.paj.responses.ResponseMessage;
import aor.paj.utils.JsonUtils;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/category")
public class CategoryService {

    @Inject
    UserBean userBean;

    @Inject
    CategoryBean categoryBean;

    //Service that gets all categories from database
    @GET
    @Path("/all")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCategories(@HeaderParam("token") String token) {
        if (userBean.isValidUserByToken(token)) {
            return Response.status(200).entity(categoryBean.getAllCategories()).build();
        } else {
            return Response.status(401).entity(JsonUtils.convertObjectToJson(new ResponseMessage("Unauthorized"))).build();
        }
    }
}
