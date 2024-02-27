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

    public void deleteCategory(CategoryEntity categoryEntity) {
        try {
            em.createQuery("DELETE FROM CategoryEntity c WHERE c.id = :id")
                    .setParameter("id", categoryEntity.getId())
                    .executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void addCategory(CategoryEntity categoryEntity) {
        try {
            em.persist(categoryEntity);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public CategoryEntity findCategoryById(int id) {
        try {
            return (CategoryEntity) em.createNamedQuery("Category.findCategoryById").setParameter("id", id)
                    .getSingleResult();

        } catch (Exception e) {
            return null;
        }
    }

}
