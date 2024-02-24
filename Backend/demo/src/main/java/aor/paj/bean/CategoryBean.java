package aor.paj.bean;

import aor.paj.dao.CategoryDao;
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

    //Function that gets all categories from database my sql
    public List<CategoryDto> getAllCategories() {
        List<CategoryEntity> categoryEntities = categoryDao.getAllCategories();
        List<CategoryDto> categoryDtos = new ArrayList<>();
        for (CategoryEntity categoryEntity : categoryEntities) {
            categoryDtos.add(CategoryMapper.convertCategoryEntityToCategoryDto(categoryEntity));
        }
        return categoryDtos;
    }
}
