package com.ryan.module1.two;

public class Main {
    public static void main(String[] args) {
        int[] a = new int[]{1, 2, 3, 4, 5, 6};
        for (int i = 0; i < a.length; i++) {
            Triangle t = new Triangle(a[i],a[i]+1);
            System.out.println(t.toString());
            Circle c = new Circle(a[i]);
            System.out.println(c.toString());
        }
    }
}
