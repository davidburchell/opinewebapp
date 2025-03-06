package foundation.opine.controllers;

import foundation.opine.models.Case;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@CrossOrigin
@RestController
public class HomeController {

    private Connection connection = null;
    private Statement statement = null;
    private ResultSet resultSet = null;

    private List<Case> casesFromQuery(String query) throws SQLException, ClassNotFoundException {
        Class.forName("com.mysql.cj.jdbc.Driver");
        connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/supreme_court_cases", "root", "status6)Which");

        statement = connection.createStatement();
        resultSet = statement.executeQuery(query);

        List<Case> myCases = new ArrayList<>();

        while (resultSet.next()){
            Case newCase = new Case();
            newCase.setName(resultSet.getString("name").trim());
            newCase.setReport_number(resultSet.getString("report_number").trim());
            newCase.setDate_decided(resultSet.getString("date_decided").trim());
            newCase.setCase_text(resultSet.getString("case_text").trim());
            myCases.add(newCase);
        }

        for(int lcv = 0; lcv < myCases.size(); lcv ++){
            System.out.println(myCases.get(lcv).getReport_number());
        }

        resultSet.close();
        statement.close();
        connection.close();
        return myCases;
    }

    @GetMapping("/home")
    public ResponseEntity<?> getCases() throws ClassNotFoundException, SQLException, IOException {
        BufferedReader br = new BufferedReader(new FileReader("C:/Users/david/Desktop/opinewebapp-main/opine/resources/homePageCases.txt"));
        String [][] casesToDisplay = new String[8][2];
        try {
            StringBuilder sb = new StringBuilder();
            String line = br.readLine();

            while (line != null) {
                sb.append(line);
                sb.append(System.lineSeparator());
                line = br.readLine();
            }
            String everything = sb.toString();

            String [] cites = everything.split("\r\n");
            for(int lcv = 0; lcv < cites.length; lcv ++){
                String [] thisCite = cites[lcv].split(",");
                casesToDisplay[lcv][0] = thisCite[0];
                casesToDisplay[lcv][1] = thisCite[1];
            }
        } finally {
            br.close();
        }

        String whereClause = "";
        for(int lcv = 0; lcv < casesToDisplay.length; lcv ++){
            if(lcv+1 < casesToDisplay.length){
                whereClause += String.format("\"%s U.S. %s\" or report_number = ", casesToDisplay[lcv][0], casesToDisplay[lcv][1]);
            } else {
                whereClause += String.format("\"%s U.S. %s\"", casesToDisplay[lcv][0], casesToDisplay[lcv][1]);
            }
        }

        System.out.println(whereClause);

        return new ResponseEntity<>(casesFromQuery("select * from cases where report_number = "+whereClause), HttpStatus.OK);
    }

    @GetMapping("/casetext/{caseNumber}")
    public ResponseEntity<?> getCaseText(@PathVariable String caseNumber) throws ClassNotFoundException, SQLException {
        String [] parts = caseNumber.split("U.S.");
        String volume = parts[0];
        String page = parts[1];
        System.out.println("get case text " + volume + " " + page);
        String query = String.format("select * from cases where report_number = \"%s U.S. %s\"", volume, page);
        System.out.println(query);
        return new ResponseEntity<>(casesFromQuery(query), HttpStatus.OK);
    }

    @GetMapping("/outofcontext/{shouldContain}")
    public ResponseEntity<?> getOutOfContext(@PathVariable String shouldContain) throws SQLException, ClassNotFoundException {
        String query = String.format("select * from cases where case_text like '%s%s%s' limit 10", "%", shouldContain, "%");

        System.out.println("here i am");
        System.out.println(shouldContain);
        return new ResponseEntity<>(casesFromQuery(query), HttpStatus.OK);
    }


}
