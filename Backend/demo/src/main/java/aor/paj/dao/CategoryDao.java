package aor.paj.dao;

import aor.paj.entity.CategoryEntity;
import aor.paj.entity.UserEntity;
import jakarta.ejb.Stateless;

import java.util.List;

@Stateless
public class CategoryDao extends AbstractDao<CategoryEntity> {

    private static final long serialVersionUID = 1L;

    public CategoryDao() {
        super(CategoryEntity.class);
    }

    public CategoryEntity findCategoryByTitle(String title) {
        try {
            return (CategoryEntity) em.createNamedQuery("Category.findCategoryByTitle").setParameter("title", title)
                    .getSingleResult();

        } catch (Exception e) {
            return null;
        }
    }

    //Function that gets all categories from database my sql
    public List<CategoryEntity> getAllCategories() {
        try {
            return em.createNamedQuery("Category.getAllCategories").getResultList();
        } catch (Exception e) {
            return null;
        }
    }
}
