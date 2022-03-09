package com.ryan.module1.four;

public abstract class TwoDShape{
/**Class is abstract*/
    double width = 0;
    double height = 0;
    Color color;

    public TwoDShape(double width, double height, Color color) {
        /** Constructor of width, height, and color of the 2D shape
         */
        this.height = height;
        this.width = width;
        this.color = color;
    }

    public TwoDShape() {
        /** Set the height and width*/
        height = 0;
        width = 0;
    }

    abstract double getArea();

    public abstract void setHeight(double height);

    public abstract void setWidth(double width);


}
