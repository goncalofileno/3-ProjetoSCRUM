package aor.paj.bean;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import aor.paj.dao.UserDao;
import aor.paj.dto.UserDto;
import aor.paj.dto.UserPartialDto;
import aor.paj.dto.UserPasswordUpdateDto;
import aor.paj.dto.UserUpdateDto;
import aor.paj.entity.UserEntity;
import aor.paj.mapper.UserMapper;
import aor.paj.utils.JsonUtils;
import jakarta.ejb.EJB;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.mindrot.jbcrypt.BCrypt;

@ApplicationScoped
public class UserBean {
    private ArrayList<UserDto> userDtos;

    @EJB
    UserDao userDao;


    //Function that generates a unique id for new user checking in database mysql if the id already exists
    public int generateIdDataBase() {
        int id = 1;
        boolean idAlreadyExists;

        do {
            idAlreadyExists = false;
            UserEntity userEntity = userDao.findUserById(id);
            if (userEntity != null) {
                id++;
                idAlreadyExists = true;
            }
        } while (idAlreadyExists);
        return id;
    }
    public UserBean() {
        this.userDtos = JsonUtils.getUsers();
    }

    //Add a user to the database mysql, encrypting the password, role to "dev" and generating a id
    public boolean addUser(UserDto user) {

            UserEntity userEntity = UserMapper.convertUserDtoToUserEntity(user);
            //Encrypt the password
            userEntity.setPassword(BCrypt.hashpw(userEntity.getPassword(), BCrypt.gensalt()));
            userEntity.setId(generateIdDataBase());
            userEntity.setRole("dev");
            userEntity.setActive(true);
            userDao.persist(userEntity);

            return true;
    }
    public boolean addUserPO(UserDto user, String role) {
        UserEntity userEntity = UserMapper.convertUserDtoToUserEntity(user);
        //Encrypt the password
        userEntity.setPassword(BCrypt.hashpw(userEntity.getPassword(), BCrypt.gensalt()));
        userEntity.setId(generateIdDataBase());
        userEntity.setRole("dev");
        userEntity.setActive(true);
        userEntity.setRole(role);
        userDao.persist(userEntity);

        return true;
    }

    //Function that validates a user in database by token
    public boolean isValidUserByToken(String token) {
        return userDao.findUserByToken(token) != null;
    }

    //Function that receives a UserDto and checks in database mysql if the username and email already exists
    public boolean userExists(UserDto user) {
        UserEntity userEntity = userDao.findUserByUsername(user.getUsername());
        if (userEntity != null) {
            return true;
        }
        userEntity = userDao.findUserByEmail(user.getEmail());
        if (userEntity != null) {
            return true;
        }
        return false;
    }

    //Function that receives the username and password and checks in database mysql if the user exists and if the password is correct, then if so returns the token generated
    public String login(String username, String password) {
        UserEntity userEntity = userDao.findUserByUsername(username);
        if (userEntity != null) {
            System.out.println(userEntity.getPassword() + " UserBean password");
            if (BCrypt.checkpw(password, userEntity.getPassword())) {
                System.out.println("password correct");
                String token = generateNewToken();
                userEntity.setToken(token);
                userDao.merge(userEntity);
                userDao.flush();
                return token;
            }
        }
        return null;
    }

    //Fubction that receives username, retrieves the user from the database and returns the userDto object
    public UserDto getUserByUsername(String username) {
        UserEntity userEntity = userDao.findUserByUsername(username);
        if (userEntity != null) {
            return UserMapper.convertUserEntityToUserDto(userEntity);
        }
        return null;
    }
    //Function that receives the token and retrieves the user from the database and returns the userDto object
    public UserDto getUserByToken(String token) {
        UserEntity userEntity = userDao.findUserByToken(token);
        if (userEntity != null) {
            return UserMapper.convertUserEntityToUserDto(userEntity);
        }
        return null;
    }

    //Function that receives the token and sets it to null, logging out the user
    public void logout(String token) {
        UserEntity userEntity = userDao.findUserByToken(token);
        System.out.println(userEntity.toString());
        if (userEntity != null) {
            userEntity.setToken(null);
            userDao.merge(userEntity);
        }
    }

    //Function that generates a new token
    private String generateNewToken() {
        return UUID.randomUUID().toString();
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
