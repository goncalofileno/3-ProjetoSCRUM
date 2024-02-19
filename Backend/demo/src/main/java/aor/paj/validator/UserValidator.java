package aor.paj.validator;

import aor.paj.dto.UserDto;
import aor.paj.dto.UserPasswordUpdateDto;
import aor.paj.dto.UserUpdateDto;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class UserValidator {

    // Regular expressions for email, phone number, and URL validation
    private static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
    private static final String PHONE_REGEX = "^[+\\d\\s()-]*$";
    private static final String URL_REGEX = "^(http|https)://.*$";

    //function that authenticates the user
    public static boolean isValidUser(List<UserDto> userDtos, String username, String password) {
        return userExists(userDtos, username) && userPasswordMatch(userDtos, username, password);
    }

    //Check if the user already exists with the same username
    public static boolean userExists(List<UserDto> userDtos, String username) {
        for (UserDto u : userDtos) {
            if (u.getUsername().equals(username)) {
                return true;
            }
        }
        return false;
    }

    //Checks if the user and password match
    public static boolean userPasswordMatch(List<UserDto> userDtos, String username, String password) {
        for (UserDto u : userDtos) {
            if (u.getUsername().equals(username) && u.getPassword().equals(password)) {
                return true;
            }
        }
        return false;
    }

    //Check if the user already exists with the same email
    public static boolean emailExists(List<UserDto> userDtos, String email) {
        for (UserDto u : userDtos) {
            if (u.getEmail().equals(email)) {
                return true;
            }
        }
        return false;
    }

    // Helper method to validate email format using regex
    public static boolean isValidEmail(String email) {
        Pattern pattern = Pattern.compile(EMAIL_REGEX);
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }

    // Helper method to validate phone number format using regex
    public static boolean isValidPhoneNumber(String phone) {
        Pattern pattern = Pattern.compile(PHONE_REGEX);
        Matcher matcher = pattern.matcher(phone);
        return matcher.matches();
    }

    // Helper method to validate URL format using regex
    public static boolean isValidURL(String url) {
        Pattern pattern = Pattern.compile(URL_REGEX);
        Matcher matcher = pattern.matcher(url);
        return matcher.matches();
    }

    //Function that verifys if user to add is null or blank
    public static boolean isNullorBlank(UserDto u) {
        return isNullOrBlank(u.getUsername()) || isNullOrBlank(u.getPassword()) || isNullOrBlank(u.getEmail())
                || isNullOrBlank(u.getFirstname()) || isNullOrBlank(u.getLastname())
                || isNullOrBlank(u.getPhone()) || isNullOrBlank(u.getPhotoURL());
    }

    //Function that verifys if user to update is null or blank
    public static boolean isNullorBlank(UserUpdateDto u) {
        return isNullOrBlank(u.getUsername()) || isNullOrBlank(u.getEmail())
                || isNullOrBlank(u.getFirstname()) || isNullOrBlank(u.getLastname())
                || isNullOrBlank(u.getPhone()) || isNullOrBlank(u.getPhotoURL());
    }

    //Function that verifys if user to update password is null or blank
    public static boolean isNullorBlank(UserPasswordUpdateDto u) {
        return isNullOrBlank(u.getOldPassword()) || isNullOrBlank(u.getNewPassword());
    }

    // Helper method to check if a string is null or blank
    public static boolean isNullOrBlank(String s) {
        return s == null || s.isBlank();
    }

}
