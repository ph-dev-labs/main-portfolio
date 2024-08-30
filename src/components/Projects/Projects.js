import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import cryptoImg from "../../Assets/Projects/crypto app.jpg";
import todoImg from "../../Assets/Projects/todo.jpg";

function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Works </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few projects I've worked on recently.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={cryptoImg}
              isBlog={false}
              title="Crypto App"
              description="Explore my Crypto app created using React, Tailwind and Ant design! This project allows users to track current crypto currency price."
              ghLink="https://github.com/ph-dev-labs/cryto-app"
              demoLink="https://cryto-app-eight.vercel.app/"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={todoImg}
              isBlog={false}
              title="Todo list app"
              description="Explore my to list app , track and manage your activites, this was built with react and redux for state management"
              ghLink="https://github.com/ph-dev-labs/to-do-list"
              demoLink="https://to-do-list-sable-rho.vercel.app/"
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
