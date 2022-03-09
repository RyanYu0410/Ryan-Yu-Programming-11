public class Teacher {

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

    String firstName;
    String lastName;
    String subject;

//    set teacher firstname, lastname, and subject
    public Teacher(String firstName, String lastName, String subject) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.subject = subject;
    }

    //Will print teacher's name and subject
    public String printTeacher() {
        return "Name=" + firstName + lastName + '\'' +
                ", subject= " + subject;
    }
}
