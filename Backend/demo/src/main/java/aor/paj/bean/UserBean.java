package aor.paj.bean;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import aor.paj.dto.UserDto;
import aor.paj.dto.UserPartialDto;
import aor.paj.dto.UserPasswordUpdateDto;
import aor.paj.dto.UserUpdateDto;
import aor.paj.entity.UserEntity;
import aor.paj.utils.JsonUtils;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@ApplicationScoped
public class UserBean {
    private ArrayList<UserDto> userDtos;

    @PersistenceContext
    EntityManager em;

    public void addUser(UserEntity user) {
        user.setRole("dev");
        user.setId(generateIdDataBase());
        user.setToken(null);
        user.setActive(true);
        em.persist(user);
    }

    //Function that generates a unique id for new user checking in database mysql if the id already exists
    public int generateIdDataBase() {
        int id = 1;
        boolean idAlreadyExists;
        do {
            idAlreadyExists = false;
            UserEntity user = em.find(UserEntity.class, id);
            if (user != null) {
                id++;
                idAlreadyExists = true;
            }
        } while (idAlreadyExists);
        return id;
    }

    //Function that receives a UserEntity and checks in database mysql if username or email already exists
    public  boolean userExists(UserEntity user) {

        List<UserEntity> usersByUsername = em.createNamedQuery("User.findUserByUsername", UserEntity.class)
                .setParameter("username", user.getUsername()).getResultList();
        List<UserEntity> usersByEmail = em.createNamedQuery("User.findUserByEmail", UserEntity.class)
                .setParameter("email", user.getEmail()).getResultList();

        return !((List<?>) usersByUsername).isEmpty() || !usersByEmail.isEmpty();
    }

    public String generateToken(String username) {
        // Generate a token. This is a simple example, you should use a more secure way to generate tokens.
        String token = UUID.randomUUID().toString();

        // Get the user from the database
        UserEntity user = em.createNamedQuery("User.findUserByUsername", UserEntity.class)
                .setParameter("username", username).getSingleResult();

        // Set the token to the user
        user.setToken(token);

        // Update the user in the database
        em.persist(user);

        // Return the generated token
        return token;
    }

    public UserBean() {
        this.userDtos = JsonUtils.getUsers();
    }

    //Add a user to the list of users
    public void addUser(UserDto u) {

        u.setId(generateId());
        u.setTasks(new ArrayList<>());

        userDtos.add(u);
        JsonUtils.writeIntoJsonFile(userDtos);
    }

    //generate a unique id for users checking if the id already exists
    public int generateId() {

        int id = 1;
        boolean idAlreadyExists;

        do {
            idAlreadyExists = false;
            for (UserDto userDto : userDtos) {
                if (userDto.getId() == id) {

                    id++;
                    idAlreadyExists = true;
                    break;
                }
            }
        } while (idAlreadyExists);
        return id;
    }

    //get the user by id
    public UserDto getUser(int i) {
        for (UserDto u : userDtos) {
            if (u.getId() == i)
                return u;
        }
        return null;
    }

    //get the user by username
    public UserDto getUser(String username) {
        for (UserDto u : userDtos) {
            if (u.getUsername().equals(username))
                return u;
        }
        return null;
    }

    //Return the list of users in the json file
    public ArrayList<UserDto> getUsers() {
        userDtos = JsonUtils.getUsers();
        return userDtos;
    }

    //Function that receives a UserUpdateDto and updates the corresponding user
    public void updateUser(UserUpdateDto userUpdateDto) {
        for (UserDto u : userDtos) {
            if (u.getUsername().equals(userUpdateDto.getUsername())) {
                u.setFirstname(userUpdateDto.getFirstname());
                u.setLastname(userUpdateDto.getLastname());
                u.setEmail(userUpdateDto.getEmail());
                u.setPhone(userUpdateDto.getPhone());
                u.setPhotoURL(userUpdateDto.getPhotoURL());
                JsonUtils.writeIntoJsonFile(userDtos);
                break;
            }
        }
    }

    //Function that receives a UserPasswordUpdateDto and updates the corresponding user
    public void updatePassword(UserPasswordUpdateDto userPasswordUpdateDto, String username) {
        for (UserDto u : userDtos) {
            if (u.getUsername().equals(username)) {
                u.setPassword(userPasswordUpdateDto.getNewPassword());
                JsonUtils.writeIntoJsonFile(userDtos);
                break;
            }
        }

    }

    //Function that receives a UserDto and converts it to a UserPartialDto
    public UserPartialDto mapUserToUserPartialDTO(UserDto userDto) {
        return new UserPartialDto(userDto.getFirstname(), userDto.getPhotoURL());
    }

//    public UserPartialDto getUserPartial(String username, String password) {
//        UserDto userDto = getUsers().stream()
//                .filter(u -> u.getUsername().equals(username) && u.getPassword().equals(password))
//                .findFirst()
//                .orElse(null);
//
//        if (userDto != null) {
//            return mapUserToUserPartialDTO(userDto);
//        } else {
//            return null;
//        }
//    }
}
