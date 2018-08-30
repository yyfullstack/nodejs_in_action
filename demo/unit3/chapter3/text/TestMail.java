package cn.yyfullstack.mail;

import org.apache.commons.mail.EmailAttachment;

import java.util.ArrayList;
import java.util.List;

public class TestMail {
    public static void main(String[] args) {
        MailInfo mailInfo = new MailInfo();
        List<String> toList = new ArrayList<String>();
        toList.add("980050148@qq.com");

        List<String> ccList = new ArrayList<String>();
        ccList.add("980050148@qq.com");

        List<String> bccList = new ArrayList<String>();
        bccList.add("980050148@qq.com");

        EmailAttachment att = new EmailAttachment();
        att.setPath("C:\\aa.txt");
        att.setName("aa.txt");

        List<EmailAttachment> atts = new ArrayList<EmailAttachment>();
        atts.add(att);

        mailInfo.setAttachments(atts);

        mailInfo.setToAddress(toList);
        mailInfo.setCcAddress(ccList);
        mailInfo.setBccAddress(bccList);

        mailInfo.setSubject("测试主题");
        mailInfo.setContent("内容:<h1>测试内容</hl>");

        MailUtil.sendEmail(mailInfo);
    }
}
