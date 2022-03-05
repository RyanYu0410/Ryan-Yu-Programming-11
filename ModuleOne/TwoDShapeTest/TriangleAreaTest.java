import com.ryan.module1.four.Color;
import com.ryan.module1.four.Triangle;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class TriangleAreaTest {

    /** @return width * height area positive
     * */
    @Test
    public void num0AreaTest() {
        double width = 0;
        double height = 19.2;
        assertEquals(width * height/2, new Triangle(width, height, Color.RED).getArea(),.1);
        height = 0;
        width = 19.2;
        assertEquals(width * height/2, new Triangle(width, height, Color.RED).getArea(),.1);
    }
}