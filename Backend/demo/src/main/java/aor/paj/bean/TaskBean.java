package aor.paj.bean;

import aor.paj.dto.TaskDto;
import aor.paj.dto.UserDto;
import aor.paj.utils.JsonUtils;
import aor.paj.utils.State;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.ArrayList;

@ApplicationScoped
public class TaskBean {
    private ArrayList<UserDto> userDtos;

    public TaskBean() {
        this.userDtos = JsonUtils.getUsers();
    }

    //Return the list of users in the json file
    public ArrayList<UserDto> getUsers() {
        userDtos = JsonUtils.getUsers();
        return userDtos;
    }
    //generate a unique id for tasks checking if the id already exists
    public int generateTaskId() {
        int id = 1;
        boolean idAlreadyExists;
        do {
            idAlreadyExists = false;
            for (UserDto userDto : userDtos) {
                for (TaskDto taskDto : userDto.getTasks()) {
                    if (taskDto.getId() == id) {
                        id++;
                        idAlreadyExists = true;
                        break;
                    }
                }
            }
        } while (idAlreadyExists);
        return id;
    }

    //Receives the username and task id and removes the task from the user
    public boolean removeTask(String username, int taskId) {
        for (UserDto u : userDtos) {
            if (u.getUsername().equals(username)) {
                for (TaskDto t : u.getTasks()) {
                    if (t.getId() == taskId) {
                        u.getTasks().remove(t);
                        JsonUtils.writeIntoJsonFile(userDtos);
                        return true;
                    }
                }
            }
        }
        return false;
    }

    //Receives the username, task id and new status and updates the status of the task
    public boolean updateTaskStatus(String username, int taskId, int status) {
        for (UserDto u : userDtos) {
            if (u.getUsername().equals(username)) {
                for (TaskDto t : u.getTasks()) {
                    if (t.getId() == taskId) {
                        t.setStatus(status);
                        JsonUtils.writeIntoJsonFile(userDtos);
                        return true;
                    }
                }
            }
        }
        return false;
    }

    //Receives the username and task id and sees if task belongs to the user
    public boolean taskBelongsToUser(String username, int taskId) {
        for (UserDto u : userDtos) {
            if (u.getUsername().equals(username)) {
                for (TaskDto t : u.getTasks()) {
                    if (t.getId() == taskId) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    //Receives the username and task object and adds the task to the user
    public boolean addTask(String username, TaskDto taskDto) {
        for (UserDto u : userDtos) {
            if (u.getUsername().equals(username)) {
                taskDto.setId(generateTaskId());
                taskDto.setStatus(State.TODO.getValue());
                u.getTasks().add(taskDto);
                JsonUtils.writeIntoJsonFile(userDtos);
                return true;
            }
        }
        return false;
    }

    //Function that returns the list of tasks of the user by username
    public ArrayList<TaskDto> getTasks(String username) {
        for (UserDto u : userDtos) {
            if (u.getUsername().equals(username)) {
                return u.getTasks();
            }
        }
        return null;
    }

    //Function that receives the username and id of the task and returns the task
    public TaskDto getTask(String username, int id) {
        for (UserDto u : userDtos) {
            if (u.getUsername().equals(username)) {
                for (TaskDto t : u.getTasks()) {
                    if (t.getId() == id) {
                        return t;
                    }
                }
            }
        }
        return null;
    }

    //function that receives the id and task and uptades the task
    public boolean updateTask(int id, TaskDto taskDto) {
        for (UserDto u : userDtos) {
            for (TaskDto t : u.getTasks()) {
                if (t.getId() == id) {
                    t.setTitle(taskDto.getTitle());
                    t.setDescription(taskDto.getDescription());
                    t.setInitialDate(taskDto.getInitialDate());
                    t.setFinalDate(taskDto.getFinalDate());
                    t.setPriority(taskDto.getPriority());
                    t.setStatus(taskDto.getStatus());
                    JsonUtils.writeIntoJsonFile(userDtos);
                    return true;
                }
            }
        }
        return false;
    }


}
