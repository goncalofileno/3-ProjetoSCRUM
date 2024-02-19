package aor.paj.bean;

import java.util.ArrayList;

import aor.paj.dto.UserDto;
import aor.paj.dto.UserPartialDto;
import aor.paj.dto.UserPasswordUpdateDto;
import aor.paj.dto.UserUpdateDto;
import aor.paj.utils.JsonUtils;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class UserBean {
    private ArrayList<UserDto> userDtos;

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
