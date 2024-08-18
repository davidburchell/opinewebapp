CREATE TABLE supreme_court_cases
(
  id INT unsigned NOT NULL AUTO_INCREMENT,
  report_number VARCHAR(150) NOT NULL,
  name VARCHAR(150) NOT NULL,
  date_decided DATE NOT NULL,
  justices TEXT,
  author VARCHAR(150),
  number_of_citations INT,
  citations TEXT,
  subject_matter TEXT,
  case_text TEXT,
  PRIMARY KEY (id)
);