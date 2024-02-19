package com.scrum;

public class User {

    private String username;
    private String password;
    private String email;
    private String firstname;
    private String lastname;
    private String phone;
    private String photoURL;

    public User() {
    }

    public User(String username, String password, String email, String firstname, String lastname, String phone, String photoURL) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.firstname = firstname;
        this.lastname = lastname;
        this.phone = phone;
        this.photoURL = photoURL;
    }

    @Override
    public String toString() {
        return "{" +
                "\"username\":\"" + username + "\"" +
                ", \"password\":\"" + password + "\"" +
                ", \"email\":\"" + email + "\"" +
                ", \"firstname\":\"" + firstname + "\"" +
                ", \"lastname\":\"" + lastname + "\"" +
                ", \"phone\":\"" + phone + "\"" +
                ", \"photoURL\":\"" + photoURL + "\"" +
                '}';
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPhotoURL() {
        return photoURL;
    }

    public void setPhotoURL(String photoURL) {
        this.photoURL = photoURL;
    }


}
