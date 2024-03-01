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
        if (t != null) {
            if (t.getTitle() != null && !t.getTitle().isEmpty()) {
                System.out.println("Passou titulo");
                if (t.getDescription() != null && !t.getDescription().isEmpty()) {
                    System.out.println("Passou descricao");
                    if (t.getPriority() != null && t.getPriority() != 0) {
                        System.out.println("Passou prioridade");
                        if (isValidDates(t)) {
                            System.out.println("Passou datas");
                            if (t.getCategory() != null && !t.getCategory().isEmpty()) {
                                System.out.println("Passou categoria");
                                if (isValidCategory(t.getCategory())) {
                                    System.out.println("Passou categoria valida");
                                    return true;
                                }
                            }

                        }
                    }
                }
            }
        }
        return false;
    }


    //function that verifys the task to edit
    public static boolean isValidTaskEdit(TaskDto t) {
        System.out.println("Verifica a task a editar");
        if (t != null) {
            if (t.getTitle() != null && !t.getTitle().isEmpty()) {
                System.out.println("Passou titulo");
                if (t.getDescription() != null && !t.getDescription().isEmpty()) {
                    System.out.println("Passou descricao");
                    if (t.getPriority() != null && t.getPriority() != 0) {
                        System.out.println("Passou prioridade");
                        if (isValidDates(t)) {
                            System.out.println("Passou datas");
                            if (t.getStatus() != 0) {
                                System.out.println("Passou status");
                                if (t.getStatus() != null) {
                                    System.out.println("Passou status");
                                    if (isValidStatus(t.getStatus())) {
                                        System.out.println("Passou status valido");
                                        if (t.getCategory() != null && !t.getCategory().isEmpty()) {
                                            System.out.println("Passou categoria");
                                            if (isValidCategory(t.getCategory())) {
                                                System.out.println("Passou categoria valida");
                                                return true;
                                            }
                                        }

                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    public static boolean isValidDates(TaskDto t) {
        if (t.getInitialDate() != null && t.getFinalDate() != null) {
            return t.getInitialDate().isBefore(t.getFinalDate());
        } else if (t.getInitialDate() != null && t.getFinalDate() == null) {
            return true;
        } else if (t.getInitialDate() == null) {
            return false;
        } else {
            return true;
        }
    }

    public static boolean isValidStatus(int status) {
        return status == State.TODO.getValue() || status == State.DOING.getValue() || status == State.DONE.getValue();
    }

    public static boolean isValidCategory(String category) {
        CategoryDao categoryDao = new CategoryDao();
        return categoryDao.findCategoryByTitle(category) == null;
    }
}
