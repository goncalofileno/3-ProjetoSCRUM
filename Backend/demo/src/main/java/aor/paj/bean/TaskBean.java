package aor.paj.bean;

import aor.paj.dao.CategoryDao;
import aor.paj.dao.TaskDao;
import aor.paj.dao.UserDao;
import aor.paj.dto.TaskDto;
import aor.paj.dto.UserDto;
import aor.paj.entity.CategoryEntity;
import aor.paj.entity.TaskEntity;
import aor.paj.entity.UserEntity;
import aor.paj.mapper.TaskMapper;
import aor.paj.utils.JsonUtils;
import aor.paj.utils.State;
import jakarta.ejb.EJB;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class TaskBean {

    @EJB
    UserDao userDao;

    @EJB
    TaskDao taskDao;

    @EJB
    CategoryDao categoryDao;

    private ArrayList<UserDto> userDtos;

    public TaskBean() {
        this.userDtos = JsonUtils.getUsers();
    }


   //Function that receives a token and a taskdto and creates a task with the user token as owner and adds the task to the database mysql
    public boolean addTask(String token, TaskDto taskDto) {
        UserEntity userEntity = userDao.findUserByToken(token);
        CategoryEntity categoryEntity = categoryDao.findCategoryByTitle(taskDto.getCategory());
        TaskEntity taskEntity = TaskMapper.convertTaskDtoToTaskEntity(taskDto);

        taskEntity.setOwner(userEntity);
        taskEntity.setActive(true);
        taskEntity.setId(generateTaskId());
        taskEntity.setStatus(State.TODO.getValue());
        taskEntity.setCategory(categoryEntity);
        System.out.println("TaskEntity: " + taskEntity);
        taskDao.persist(taskEntity);
        return true;
    }

    //Function that receives a taskdto and checks in database mysql if a task with the same title already exists
    public boolean taskTitleExists(TaskDto taskDto) {
        TaskEntity taskEntity = taskDao.findTaskByTitle(taskDto.getTitle());
        if (taskEntity != null) {
            return true;
        }
        return false;
    }

    //Function that generates a unique id for new task checking in database mysql if the id already exists
    public int generateTaskId() {
        int id = 1;
        boolean idAlreadyExists;

        do {
            idAlreadyExists = false;
            TaskEntity taskEntity = taskDao.findTaskById(id);
            if (taskEntity != null) {
                id++;
                idAlreadyExists = true;
            }
        } while (idAlreadyExists);

        return id;
    }

    //Function that returns all tasks from the database mysql
    public List<TaskDto> getAllTasks() {
        List<TaskEntity> taskEntities = taskDao.getAllTasks();
        ArrayList<TaskDto> taskDtos = new ArrayList<>();
        for (TaskEntity taskEntity : taskEntities) {
            taskDtos.add(TaskMapper.convertTaskEntityToTaskDto(taskEntity));
        }
        return taskDtos;
    }

    //Function that receives a task id and a new task status and updates the task status in the database mysql
    public void updateTaskStatus(int id, int status) {
        TaskEntity taskEntity = taskDao.findTaskById(id);
        taskEntity.setStatus(status);
        taskDao.merge(taskEntity);
    }
    
    //Function that receives a task id and sets the task active to false in the database mysql
    public boolean desactivateTask(int id) {
        TaskEntity taskEntity = taskDao.findTaskById(id);
        taskEntity.setActive(false);
        taskDao.merge(taskEntity);
        return true;
    }
    
    //Function that receives a task id and a token and checks if the user its the owner of task with that id
    public boolean taskBelongsToUser(String token, int id) {
        UserEntity userEntity = userDao.findUserByToken(token);
        TaskEntity taskEntity = taskDao.findTaskById(id);
        if (taskEntity.getOwner().getId() == userEntity.getId()) {
            return true;
        }
        return false;
    }


    //Return the list of users in the json file
    public ArrayList<UserDto> getUsers() {
        userDtos = JsonUtils.getUsers();
        return userDtos;
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
