package com.scrum;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class CategoryPopulator {

    private String token;
    private int numberOfCategories;

    public CategoryPopulator() {
    }

    public CategoryPopulator(String token, int numberOfCategories) {
        this.token = token;
        this.numberOfCategories = numberOfCategories;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public int getNumberOfCategories() {
        return numberOfCategories;
    }

    public void setNumberOfCategories(int numberOfCategories) {
        this.numberOfCategories = numberOfCategories;
    }

    //Function that populates the categories
    public void populate(String token) {
        System.out.println("Populating " + numberOfCategories + " categories");
        for (int i = 0; i < numberOfCategories; i++) {
            try {
                URL url = new URL("https://www.boredapi.com/api/activity"); // Replace with your API URL
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
                    String categoryData = response.toString();
                    addCategory(parseCategory(categoryData,token), token);
                } else {
                    System.out.println("Failed to fetch category data. Response code: " + responseCode);
                }
            } catch (IOException e) {
                System.out.println("Failed to fetch category data" + e.getMessage());
            }
            System.out.println("Category " + i + " populated");
        }
    }


    //Function that adds the category
    //Function that parses the category data
    public Category parseCategory(String jsonData, String token){
        Category category = null;
        System.out.println("Parsing category data: " + jsonData + " for user with token " + token);
        try {
            JSONObject jsonObject = new JSONObject(jsonData);
            String description = jsonObject.getString("activity");
            String title = jsonObject.getString("type");

            title = title.substring(0, 1).toUpperCase() + title.substring(1);

            category = new Category(0, title, description, "admin");

            System.out.println("category: " + category + " for user with token " + token);
        } catch (JSONException e) {
            System.out.println("Failed to parse category data" + e.getMessage());
        }
        return category;
    }

    //Function that adds the category
    public void addCategory(Category category, String token){
        try {
            URL url = new URL("http://localhost:8080/demo-1.0-SNAPSHOT/rest/category/add");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("token", token);
            connection.setDoOutput(true);
            System.out.println("Adding category: " + category + " for user with token " + token);
            connection.getOutputStream().write(category.toString().getBytes());
            connection.getOutputStream().flush();
            connection.getOutputStream().close();

            int responseCode = connection.getResponseCode();
            BufferedReader reader;
            if (responseCode == HttpURLConnection.HTTP_OK) {
                reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                System.out.println("Category added successfully: " + category + " for user with token " + token);
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
            System.out.println("Failed to add category" + e.getMessage());
        }
    }
}