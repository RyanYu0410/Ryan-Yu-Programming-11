import java.sql.Connection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.httpclient.Cookie;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.cookie.CookiePolicy;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.Connection.Method;
import org.jsoup.Connection.Response;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
/**
 * 使用Jsoup模拟登陆CSDN
 *
 *
 * 大体思路如下:
 *
 * 第一次请求登陆页面，获取页面信息，包含表单信息，和cookie（这个很重要），拿不到，会模拟登陆不上
 *
 *
 * 第二次登陆，设置用户名，密码，把第一次的cooking，放进去，即可
 *
 * 怎么确定是否登陆成功？
 *
 * 登陆后，打印页面，会看到账户的详细信息。
 *
 *
 * @date 2018年 9/8
 * @author 空白
 *
 *
 * **/
public class LoginDemo {
    public static void main(String[] args) throws Exception {
        LoginDemo loginDemo = new LoginDemo();
        loginDemo.login("xxxx", "lxxxx");// 输入CSDN的用户名，和密码
// loginDemo.getIndex();  
    }
    /**
     * 模拟登陆CSDN
     *
     * @param userName
     *            用户名
     * @param pwd
     *            密码
     *
     * **/
    public String login(String userName, String pwd) throws Exception {
// 第一次请求  
        Connection con = Jsoup
                .connect("https://passport.csdn.net/account/login");// 获取连接
        con.header("User-Agent",
                "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0");// 配置模拟浏览器
        Response rs = con.execute();// 获取响应
        Document d1 = Jsoup.parse(rs.body());// 转换为Dom树
        List<Element> et = d1.select("#fm1");// 获取form表单，可以通过查看页面源码代码得知
// 获取，cooking和表单属性，下面map存放post时的数据  
        Map<String, String> datas = new HashMap<>();
        for (Element e : et.get(0).getAllElements()) {
            if (e.attr("name").equals("username")) {
                e.attr("value", userName);// 设置用户名
            }
            if (e.attr("name").equals("password")) {
                e.attr("value", pwd); // 设置用户密码
            }
            if (e.attr("name").length() > 0)  {// 排除空值表单属性
                datas.put(e.attr("name"), e.attr("value"));
            }
        }
/**
 * 第二次请求，post表单数据，以及cookie信息
 *
 * **/
        Thread.sleep(1000);//防止连续请求，造成请求频繁

        Connection con2 = Jsoup
                .connect("https://passport.csdn.net/account/login");
        con2.header("User-Agent",
                "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0");
// 设置cookie和post上面的map数据  
        Response login = con2.ignoreContentType(true).method(Method.POST)
                .data(datas).cookies(rs.cookies()).execute();
        System.out.println("login："+datas);
// 打印，登陆成功后的信息  
/*Thread.sleep(1000);//防止连续请求，造成请求频繁 
Connection con3 = Jsoup 
.connect("https://beacon.tingyun.com/xhr1?pvid=612d3f3b-f699-4bd3-977c-2e38cb2919d5&ref=https%3A%2F%2Fwww.csdn.net%2F&referrer=https%3A%2F%2Fpassport.csdn.net%2Faccount%2Fverify&key=5raC_g4Hadc&v=1.7.5&av=1.7.5&did=e7fad4d7-a49b-438d-9e62-72f1267ca64d&sid=73022add-13d3-4aea-9e98-ce17a83adc98&__r=1536397962777"); 
Response login2 = con3.ignoreContentType(true).method(Method.POST) 
.execute(); */
        System.out.println(login.body());
// System.out.println(login2.body());  
        String aString =login.body();
// 登陆成功后的cookie信息，可以保存到本地，以后登陆时，只需一次登陆即可  
        Map<String, String> map = login.cookies();
        for (String s : map.keySet()) {
            System.out.println(s + "      " + map.get(s));
        }
        return aString;
    }

}  