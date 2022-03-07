package com.ryan.module1.four;

import static com.ryan.module1.four.Color.RED;

public class Main {
    public static void main(String[] args) {
        /**@param List of number*/

        int[] a = new int[]{1, 2, 3, 4, 5, 6};
        for (int i = 0; i < a.length; i++) {
            Triangle t = new Triangle(a[i],a[i]+1, RED);
            System.out.println(t.toString());
            Circle c = new Circle(a[i]);
            System.out.println(c.toString());
        }
    }
}
