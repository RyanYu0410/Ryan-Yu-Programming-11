import com.ryan.module1.four.Triangle;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class TriangleHeronsHeightTest {
    /** partition
     //* @param side1 is positive
     //* @param side2 is positive
     //* @param side3 is positive
     * @return double height positive
     */

    @Test
    public void number0Test() {
        //one of the sides is 0 in HeronsHeight
        double side1 = 0;
        double side2 = 32;
        double side3 = 99.29;
        assertEquals(0.0, new Triangle(side1,side2,side3).getHeronsHeight(),.1);
        side2 = 0;
        side3 = 32;
        side1 = 99.29;
        assertEquals(0.0, new Triangle(side1,side2,side3).getHeronsHeight(),.1);
        side3 = 0;
        side1 = 32;
        side2 = 99.29;
        assertEquals(0.0, new Triangle(side1,side2,side3).getHeronsHeight(),.1);
    }
}
