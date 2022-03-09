import java.util.ArrayList;

public class School {
    ArrayList<String> teachers = new ArrayList<>();
    ArrayList<String> students = new ArrayList<>();
    String name;
    int district;
    int capacity;

// set school name, Integer district, and Integer capacity
    public School(String name, int district, int capacity) {
        this.name = name;
        this.district = district;
        this.capacity = capacity;
    }

    /**  Add a teacher to the arraylist teachers
 * @param firstName
 * @param lastName
 * @param subject
 */
    public void addTeacher(String firstName, String lastName, String subject) {
        Teacher teacher = new Teacher(firstName, lastName, subject);
        String add = teacher.firstName + " " + teacher.lastName + ": " + teacher.subject;
        teachers.add(add);
    }

/**  Add a student to the arraylist students
 * @param firstName
 * @param lastName
 * @param grade
 */
    public void addStudent(String firstName, String lastName, int grade) {
        Student student = new Student(firstName, lastName, grade);
        String add = student.firstName + " " + student.lastName + ": " + student.grade;
        students.add(add);
    }

/**  Delete a teacher from the arraylist teachers
 * @param firstName
 * @param lastName
 * @param subject
 */
    public void deleteTeacher(String firstName, String lastName, String subject) {
        String add = firstName + " " + lastName + ": " + subject;
        teachers.remove(add);
    }

/**  Delete a student from the arraylist students
 * @param firstName
 * @param lastName
 * @param grade
 */
    public void deleteStudent(String firstName, String lastName, int grade) {
        String add = firstName + " " + lastName + ": " + grade;
        students.remove(add);
    }

    //    print out all teachers in the teachers list
    public void printTeacher() {
        for (String teacher : teachers) {
            System.out.println(teacher);
        }
    }

    //    print out all teachers in the teachers list
    public void printStudent() {
        for (String student : students) {
            System.out.println(student);
        }
    }
}
