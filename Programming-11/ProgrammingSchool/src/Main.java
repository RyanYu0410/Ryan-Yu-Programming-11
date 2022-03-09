public class Main {
    public static void main(String[] args) {
        School school = new School("UHill", 39,10000);
        school.addStudent("Aa","Bb",1);
        school.addStudent("Cc","Dd",2);
        school.addStudent("Ee","Ff",3);
        school.addStudent("Gg","Hh",4);
        school.addStudent("Ii","Jj",5);
        school.addStudent("Kk","Ll",6);
        school.addStudent("Mm","Oo",7);
        school.addStudent("Pp","Qq",8);
        school.addStudent("Rr","Ss",9);
        school.addStudent("Tt","Uu",10);
        school.addTeacher("A", "B","Math");
        school.addTeacher("C", "D","Science");
        school.addTeacher("E", "F","English");
        school.printStudent();
        school.printTeacher();
        school.deleteStudent("Aa","Bb",1);
        school.deleteStudent("Tt","Uu",10);
        school.deleteTeacher("A", "B","Math");
        school.printStudent();
        school.printTeacher();
    }
}
