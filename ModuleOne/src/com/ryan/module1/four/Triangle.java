package com.ryan.module1.four;

public class Triangle extends TwoDShape implements Rotate {

    double side1;
    double side2;
    double side3;

    public Triangle(double width, double height, Color color) {
        /** set width,height,color of triangle */
        super(width, height, color);
    }

    public Triangle(double side1, double side2, double side3) {
        /** set side1,side2,side3 of triangle */
        this.side1 = side1;
        this.side2 = side2;
        this.side3 = side3;
    }

    private double heronsHeight() {
        /**@return height of triangle*/
        if (side1 == 0 || side2 == 0 || side3 == 0) {
            System.out.println("0 exist");
            return 0;
        } else {
            double s = (side1 + side2 + side3) / 2;
            double area = Math.sqrt(s * (s - side1) * (s - side2) * (s - side3));
            return area / side1 * 2;
        }
    }

    public double getHeronsHeight() {
        /**@param method heronsHeight
         * @return height */
        height = heronsHeight();
        return height;
    }

    public double getArea() {
        return width * height / 2;
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
        return "The area of the triangle is " + getArea() + " and the height is " + height;
    }

    @Override
    public void rotate90() {
    }

    @Override
    public void rotate180() {

    }

    @Override
    public void rotate(double degree) {

    }
}

