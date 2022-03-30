package com.example.friendsbook;

public class Friends {
    private String name;
    private int age;
    private int phoneNum;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public int getPhoneNum() {
        return phoneNum;
    }

    public void setPhoneNum(int phoneNum) {
        this.phoneNum = phoneNum;
    }

    public Friends(String name, int age, int phoneNum) {
        this.name = name;
        this.age = age;
        this.phoneNum = phoneNum;
    }

    @Override
    public String toString() {
        return name;
    }
}
