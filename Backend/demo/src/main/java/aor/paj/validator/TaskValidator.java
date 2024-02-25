package aor.paj.validator;

import aor.paj.dao.CategoryDao;
import aor.paj.dto.TaskDto;
import aor.paj.utils.Priority;
import aor.paj.utils.State;
import jakarta.ejb.EJB;

import java.time.LocalDate;

public class TaskValidator {

    //function that verifys if atributes of a new task are not null or empty, then verifys if initial date is before final date
    public static boolean isValidTask(TaskDto t) {
        System.out.println("Verifica a task: " + t.getTitle() + " " + t.getDescription() + " " + t.getPriority() + " " + t.getInitialDate() + " " + t.getFinalDate() + " " + t.getCategory());
        return t != null &&
                t.getTitle() != null &&
                !t.getTitle().isEmpty() &&
                t.getDescription() != null &&
                !t.getDescription().isEmpty() &&
                t.getPriority() != null &&
                t.getPriority() != 0 &&
                (t.getPriority() == Priority.LOW.getValue() || t.getPriority() == Priority.MEDIUM.getValue() || t.getPriority() == Priority.HIGH.getValue()) &&
                t.getInitialDate() != null &&
                (t.getInitialDate().isEqual(LocalDate.now()) || t.getInitialDate().isAfter(LocalDate.now())) && //initial date must be today or in the future
                t.getFinalDate() != null &&
                t.getInitialDate().isBefore(t.getFinalDate()) &&
                t.getCategory() != null &&
                !t.getCategory().isEmpty() &&
                isValidCategory(t.getCategory());
    }

    //function that verifys the task to edit
    public static boolean isValidTaskEdit(TaskDto t) {
        System.out.println("Verifica a task a editar");
        System.out.println(t.toString());
        return t != null &&
                t.getTitle() != null &&
                !t.getTitle().isEmpty() &&
                t.getDescription() != null &&
                !t.getDescription().isEmpty() &&
                t.getPriority() != null &&
                t.getPriority() != 0 &&
                (t.getPriority() == Priority.LOW.getValue() || t.getPriority() == Priority.MEDIUM.getValue() || t.getPriority() == Priority.HIGH.getValue()) &&
                t.getInitialDate() != null &&
                t.getFinalDate() != null &&
                t.getInitialDate().isBefore(t.getFinalDate()) &&
                t.getStatus() != null &&
                t.getStatus() != 0 &&
                isValidStatus(t.getStatus()) &&
                t.getCategory() != null &&
                !t.getCategory().isEmpty() &&
                isValidCategory(t.getCategory());
    }

    public static boolean isValidStatus(int status) {
        return status == State.TODO.getValue() || status == State.DOING.getValue() || status == State.DONE.getValue();
    }

    public static boolean isValidCategory(String category) {
        CategoryDao categoryDao = new CategoryDao();
        return categoryDao.findCategoryByTitle(category) == null;
    }
}
