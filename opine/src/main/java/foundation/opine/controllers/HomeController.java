package foundation.opine.controllers;

import foundation.opine.models.Case;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@RestController
public class HomeController {

    private Connection connection = null;
    private Statement statement = null;
    private ResultSet resultSet = null;

    @GetMapping("/home")
    public ResponseEntity<?> getCases() throws ClassNotFoundException, SQLException {
        System.out.println("here I am\n");

        Class.forName("com.mysql.cj.jdbc.Driver");
        connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/cases", "root", "status6)Which");

        statement = connection.createStatement();
        resultSet = statement.executeQuery("select * from supreme_court_cases limit 10");

        List<Case> myCases = new ArrayList<>();

        while (resultSet.next()){
            Case newCase = new Case();
            newCase.setName(resultSet.getString("name").trim());
            newCase.setReport_number(resultSet.getString("report_number").trim());
            newCase.setDate_decided(resultSet.getString("date_decided").trim());
            newCase.setCase_text(resultSet.getString("case_text").trim());
            myCases.add(newCase);
        }

        resultSet.close();
        statement.close();
        connection.close();

        return new ResponseEntity<>(myCases, HttpStatus.OK);
    }


}
