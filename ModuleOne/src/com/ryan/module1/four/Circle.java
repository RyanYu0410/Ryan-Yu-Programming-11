package com.ryan.module1.four;

public class Circle extends TwoDShape {

    public final double PI = 3.14;
    private double radius;


    public Circle(double radius) {
        this.radius = radius;
    }

    @Override
    public double getArea() {
/** PI value is 3.14*/
        return radius * radius * PI;
    }
    @Override
    public void setHeight(double height) {
        this.height = height;
    }

    @Override
    public void setWidth(double width) {
        this.width = width;
    }

    public String toString() {
        /**@return String of   */
        String s = "The area of the circle is " + getArea() + " and the radius is " + radius;
        return s;
    }
}
