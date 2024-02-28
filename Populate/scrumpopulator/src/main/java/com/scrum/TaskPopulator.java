package com.scrum;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.*;

public class TaskPopulator {

    private String token;
    private int numberOfTasks;

    public TaskPopulator() {
    }

    public TaskPopulator(String token, int numberOfTasks) {
        this.token = token;
        this.numberOfTasks = numberOfTasks;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public int getNumberOfTasks() {
        return numberOfTasks;
    }

    public void setNumberOfTasks(int numberOfTasks) {
        this.numberOfTasks = numberOfTasks;
    }

    //Function that populates the tasks
    public void populate(String token) {
        System.out.println("Populating " + numberOfTasks + " tasks");
        for (int i = 0; i < numberOfTasks; i++) {
            try {
                URL url = new URL("https://www.boredapi.com/api/activity");
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
                    String taskData = response.toString();
                    addTask(parseTask(taskData, token), token);
                } else {
                    System.out.println("Failed to fetch task data. Response code: " + responseCode);
                }
            } catch (IOException e) {
                System.out.println("Failed to fetch task data" + e.getMessage());
            }
            System.out.println("Task " + i + " populated");
        }
    }

    //Function that parses the task data
    public Task parseTask(String jsonData, String token){
        Task task = null;
        try {
            JSONObject jsonObject = new JSONObject(jsonData);
            String title = jsonObject.getString("activity");
            String description = jsonObject.getString("type");

            List<String> categories = getCategories(token);
            Random random = new Random();
            String category = categories.get(random.nextInt(categories.size()));

            int priority = generatePriority();
            String initialDate = generateDate();
            String finalDate = generateDate(initialDate);

            task = new Task(title, description, priority, initialDate, finalDate, category);

        } catch (JSONException e) {
            System.out.println("Failed to parse task data" + e.getMessage());
        }
        return task;
    }

    //Function that adds the task
    public void addTask(Task task, String token){
        try {
            URL url = new URL("http://localhost:8080/demo-1.0-SNAPSHOT/rest/task/add");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("token", token);
            connection.setDoOutput(true);
            System.out.println("Adding task: " + task + " for user with toke " + token);
            connection.getOutputStream().write(task.toString().getBytes());
            connection.getOutputStream().flush();
            connection.getOutputStream().close();

            int responseCode = connection.getResponseCode();
            BufferedReader reader;
            if (responseCode == HttpURLConnection.HTTP_OK) {
                reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                System.out.println("Task added successfully: " + task + " for user with toke " + token);
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
            System.out.println("Failed to fetch task data" + e.getMessage());
        }
    }

    //Function that returns random int, the int shoul be 100, 200 or 300
    public int generatePriority() {
        Random random = new Random();
        int priority = random.nextInt(3) + 1;
        priority *= 100;
        return priority;
    }

    //function that returns a date in the format "yyyy-MM-dd" starting from today and in format string
    public String generateDate() {
        Date date = new Date();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        return formatter.format(date);
    }

    //function that returns a date after the date passed as parameter in the format "yyyy-MM-dd" and in format string
    public String generateDate(String date) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        Calendar c = Calendar.getInstance();
        try {
            c.setTime(formatter.parse(date));
        } catch (Exception e) {
            e.printStackTrace();
        }
        c.add(Calendar.DATE, 1);
        return formatter.format(c.getTime());
    }

    public List<String> getCategories(String token) {
        List<String> categories = new ArrayList<>();
        try {
            URL url = new URL("http://localhost:8080/demo-1.0-SNAPSHOT/rest/category/all");
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("token", token);

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                String line;
                StringBuilder response = new StringBuilder();
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                reader.close();

                JSONArray jsonArray = new JSONArray(response.toString());
                for (int i = 0; i < jsonArray.length(); i++) {
                    JSONObject jsonObject = jsonArray.getJSONObject(i);
                    categories.add(jsonObject.getString("title"));
                }
            } else {
                System.out.println("Failed to fetch categories. Response code: " + responseCode);
            }
        } catch (Exception e) {
            System.out.println("Failed to fetch categories" + e.getMessage());
        }
        return categories;
    }
}
