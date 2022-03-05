package com.ryan.module1.three;

public abstract class TwoDShape{

    double width;
    double height;

    public TwoDShape(double width, double height) {
        this.height = height;
        this.width = width;
    }

    public TwoDShape() {
        height = 0;
        width = 0;
    }

    public double getArea() {
        return width * height;
    }

    public abstract void setHeight(double height);

    public abstract void setWidth(double width);
}
