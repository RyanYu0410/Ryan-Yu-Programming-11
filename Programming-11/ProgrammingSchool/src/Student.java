public class Student {

//    set student firstname, lastname, Integer grade and generate a student number from 0
    public Student(String firstName, String lastName, int grade) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.grade = grade;
        idCounter ++;
        this.studentNumber = idCounter;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public int getGrade() {
        return grade;
    }

    public void setGrade(int  grade) {
        this.grade = grade;
    }

    String firstName;
    String lastName;
    int grade;
    int studentNumber;
    int idCounter = 0;

//    Will print student's name and grade
    public String printStudent() {
        return "Name=" + firstName + lastName +
                ", grade= " + grade +
                    ", student number= " + studentNumber;
    }
}
