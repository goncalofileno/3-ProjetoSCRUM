package aor.paj.bean;

import aor.paj.dao.CategoryDao;
import aor.paj.dao.TaskDao;
import aor.paj.dto.CategoryDto;
import aor.paj.dto.TaskDto;
import aor.paj.entity.CategoryEntity;
import aor.paj.entity.TaskEntity;
import aor.paj.mapper.CategoryMapper;
import aor.paj.mapper.TaskMapper;
import jakarta.ejb.EJB;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class CategoryBean {

    @EJB
    CategoryDao categoryDao;

    @EJB
    TaskDao taskDao;

    //Function that gets all categories from database my sql
    public List<CategoryDto> getAllCategories() {
        List<CategoryEntity> categoryEntities = categoryDao.getAllCategories();
        List<CategoryDto> categoryDtos = new ArrayList<>();
        for (CategoryEntity categoryEntity : categoryEntities) {
            categoryDtos.add(CategoryMapper.convertCategoryEntityToCategoryDto(categoryEntity));
        }
        return categoryDtos;
    }

    //Function that returns the categories of tasks that are active in the database my sql, firts gets the tasks that are active and then gets the categories of those tasks
    public List<CategoryDto> getActiveCategories() {
        List<TaskEntity> taskEntities = taskDao.getActiveTasks();
        List<CategoryDto> categoryDtos = new ArrayList<>();
        for (TaskEntity taskEntity : taskEntities) {
            CategoryEntity categoryEntity = categoryDao.findCategoryByTitle(taskEntity.getCategory().getTitle());
            categoryDtos.add(CategoryMapper.convertCategoryEntityToCategoryDto(categoryEntity));
        }
        return categoryDtos;
    }

}
