package com.scrum;

public class Main {
    public static void main(String[] args) {
        System.out.println("SCRUM POPULATOR");
        String generatorType = args.length != 0 ? args[0] : null;

        if (generatorType == null) {
            System.out.println("Please provide a generator type");
        } else if (generatorType.equals("add_users")) {

            try {
                boolean isNumberOfUsersProvided = args.length > 1;
                if (!isNumberOfUsersProvided) {
                    System.out.println("Please provide the number of users to be added");
                    return;
                } else if (args.length > 2) {
                    System.out.println("Too many arguments");
                    return;
                }
                int numberOfUsers = Integer.parseInt(args[1]);

                UserPopulator userPopulator = new UserPopulator(numberOfUsers);
                userPopulator.populate();

            } catch (NumberFormatException e) {
                System.out.println("Invalid number of users");
            }
        } else if (generatorType.equals("add_tasks")) {
            try {
                boolean isNumberOfArgsTasksProvided = args.length == 3;
                if (!isNumberOfArgsTasksProvided) {
                    System.out.println("Please provide the username, password and number of tasks to be added");
                }
                String username = args[1];
                String password = args[2];
                int numberOfTasks = Integer.parseInt(args[3]);

                TaskPopulator taskPopulator = new TaskPopulator(username, password, numberOfTasks);
                taskPopulator.populate();

            } catch (NumberFormatException e) {
                System.out.println("Invalid number of tasks");
            }
        } else {
            System.out.println("Invalid generator type");
        }

    }
}