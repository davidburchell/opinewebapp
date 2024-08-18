package foundation.opine.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Case {
    private String report_number;
    private String name;
    private String date_decided;
    private String justices;
    private String author;
    private int number_of_citations;
    private String [] citations;
    private String subject_matter;
    private String case_text;
}
