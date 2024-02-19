package aor.paj.validator;

import aor.paj.dto.TaskDto;
import aor.paj.utils.Priority;
import aor.paj.utils.State;

import java.time.LocalDate;

public class TaskValidator {
    //function that verifys if atributes of a new task are not null or empty, then verifys if initial date is before final date
    public static boolean isValidTask(TaskDto t) {
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
                t.getInitialDate().isBefore(t.getFinalDate());
    }

    //function that verifys the task to edit
    public static boolean isValidTaskEdit(TaskDto t) {
        System.out.println("Verifica a task a editar");
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
                isValidStatus(t.getStatus());
    }

    public static boolean isValidStatus(int status) {
        return status == State.TODO.getValue() || status == State.DOING.getValue() || status == State.DONE.getValue();
    }
}
