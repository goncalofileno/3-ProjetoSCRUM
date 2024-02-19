package com.scrum;

public class Task {
    private String title;
    private String description;
    private int priority;
    private String initialDate;
    private String finalDate;

    public Task() {
    }

    public Task(String title, String description, int priority, String initialDate, String finalDate) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.initialDate = initialDate;
        this.finalDate = finalDate;
    }

    @Override
    public String toString() {
        return "{" +
                "\"title\":\"" + title + "\"" +
                ", \"description\":\"" + description + "\"" +
                ", \"priority\":" + priority  +
                ", \"initialDate\":\"" + initialDate + "\"" +
                ", \"finalDate\":\"" + finalDate + "\"}";
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getPriority() {
        return priority;
    }

    public void setPriority(int priority) {
        this.priority = priority;
    }

    public String getInitialDate() {
        return initialDate;
    }

    public void setInitialDate(String initialDate) {
        this.initialDate = initialDate;
    }

    public String getFinalDate() {
        return finalDate;
    }

    public void setFinalDate(String finalDate) {
        this.finalDate = finalDate;
    }
}
