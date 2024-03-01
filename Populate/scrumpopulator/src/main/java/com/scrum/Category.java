package com.scrum;

//private int id;
//private String title;
//private String description;
//private String owner;
public class Category {

    private int id;
    private String title;
    private String description;
    private String owner;

    public Category() {
    }

    public Category(int id, String title, String description, String owner) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.owner = owner;
    }

    @Override
    public String toString() {
        return "{" +
                "\"id\":" + id +
                ", \"title\":\"" + title + "\"" +
                ", \"description\":\"" + description + "\"" +
                ", \"owner\":\"" + owner + "\"" +
                '}';
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }
}
