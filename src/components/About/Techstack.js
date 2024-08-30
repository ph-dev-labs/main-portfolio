import React from "react";
import { Col, Row } from "react-bootstrap";
import {
  DiJavascript1,
  DiReact,
  DiGit,
  DiNodejs,
} from "react-icons/di";
import {
  SiNextdotjs,
  SiTypescript,
  SiExpress,
  SiExpo,
} from "react-icons/si";

function Techstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      <Col xs={4} md={2} className="tech-icons">
        <DiReact />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <DiJavascript1 />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiTypescript />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <DiGit />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiNextdotjs />
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <DiNodejs/>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiExpress/>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <SiExpo/>
      </Col>
    </Row>
  );
}

export default Techstack;
