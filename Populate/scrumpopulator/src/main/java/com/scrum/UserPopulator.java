package com.scrum;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;


public class UserPopulator {
    private int numberOfUsers;

    public UserPopulator(int numberOfUsers) {
        this.numberOfUsers = numberOfUsers;
    }

    //Function that populates the users
    public void populate() {
        System.out.println("Populating " + numberOfUsers + " users");
        for (int i = 0; i < numberOfUsers; i++) {
            // Make a request to randomuser.me API
            try {
                URL url = new URL("https://randomuser.me/api/");
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("GET");

                int responseCode = connection.getResponseCode();

                if (responseCode == HttpURLConnection.HTTP_OK) {
                    BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                    StringBuilder response = new StringBuilder();
                    String line;
                    while ((line = reader.readLine()) != null) {
                        response.append(line);
                    }
                    reader.close();

                    // Parse the JSON response to extract user data and add user
                    String userData = response.toString();
                    // Assuming you have a method parseUserData to extract user data from JSON
                    addUser(parseUser(userData));
                } else {
                    System.out.println("Failed to fetch user data. Response code: " + responseCode);
                }
            } catch (IOException e) {
                System.out.println("Failed to fetch user data" + e.getMessage());
            }
        }
    }

    //Function that parses the user data
    public User parseUser(String jsonData) {
        User user = null;
        try {
            JSONObject jsonObject = new JSONObject(jsonData);
            JSONArray results = jsonObject.getJSONArray("results");

            for (int i = 0; i < results.length(); i++) {
                JSONObject userObject = results.getJSONObject(i);

                String firstName = userObject.getJSONObject("name").getString("first");
                String lastName = userObject.getJSONObject("name").getString("last");
                String username = userObject.getJSONObject("login").getString("username");
                String password = userObject.getJSONObject("login").getString("password");
                String email = userObject.getString("email");
                String phone = userObject.getString("phone");
                String photoURL = userObject.getJSONObject("picture").getString("thumbnail");


                // Create a User object with the extracted data
                user = new User(username, password, email, firstName, lastName, phone, photoURL);
            }
        } catch (JSONException e) {
            System.out.println("Failed to parse user data" + e.getMessage());
        }

        return user;
    }

    //Function that adds the user
    public void addUser(User user) {
        try {
            URL url = new URL("http://localhost:8080/demo-1.0-SNAPSHOT/rest/user/add");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setDoOutput(true);
            connection.getOutputStream().write(user.toString().getBytes());
            connection.getOutputStream().flush();
            connection.getOutputStream().close();

            int responseCode = connection.getResponseCode();
            BufferedReader reader;
            if (responseCode == HttpURLConnection.HTTP_OK) {
                reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                System.out.println("User added successfully: " + user);
            } else {
                reader = new BufferedReader(new InputStreamReader(connection.getErrorStream()));
            }

            StringBuilder response = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();

            // Parse the JSON response to get the message
            JSONObject jsonResponse = new JSONObject(response.toString());
            String message = jsonResponse.getString("message");
            System.out.println("Response message: " + message);

        } catch (Exception e) {
            System.out.println("Failed to fetch user data" + e.getMessage());
        }
    }
}
