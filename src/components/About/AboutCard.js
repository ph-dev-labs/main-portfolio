import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Hi there!!, I am <span className="purple">Nwosu Chimezie </span>
            from <span className="purple"> Nigeria.</span>
            <br />
             I am a dedicated and results-oriented front-end developer, with over 2 years of experience in creating user-focused products that deliver value.
            <br />
            I attended the prestigious Federal University of technology owerri, where I studied Enviromental. In Nigeria!
            <br />
            <br />
            Apart from coding, some other activities that I love to do!
          </p>
          <ul>
            <li className="about-activity">
              <ImPointRight /> Love Playing Video Games
            </li>
            <li className="about-activity">
              <ImPointRight /> Chess
            </li>
            <li className="about-activity">
              <ImPointRight /> Travelling
            </li>
            <li className="about-activity">
              <ImPointRight /> Learning
            </li>
          </ul>

          <p style={{ color: "rgb(155 126 172)" }}>
            "Create meaningful solutions, build impactful products, and focus on positive societal impact through your skills."{" "}
          </p>
          <footer className="blockquote-footer">Nwosu Chimezie Justice</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
