import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import cryptoImg from "../../Assets/Projects/crypto app.jpg";
import todoImg from "../../Assets/Projects/grandma_wuraP.png";
import fruitionImg from "../../Assets/Projects/fruition.png";
import childImg from "../../Assets/Projects/grandma-wura-child.png";
import novaImg from "../../Assets/Projects/novacrust.png";
import novaBusinessImg from "../../Assets/Projects/business-nova.png";
import frexiqClImg from "../../Assets/Projects/frexiq-client.png";
import flood from "../../Assets/Projects/flood.png";

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
              title="Grandma Wura Parent and organisation interface"
              description="A content platform for children to watch lesson on the core values of the african society"
              // ghLink="https://github.com/ph-dev-labs/fruition-motors"
              demoLink="https://grandmawurahub.app"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={fruitionImg}
              isBlog={false}
              title="Fruition motors"
              description="A reliable agency for purchasing your vechiles"
              ghLink="https://github.com/ph-dev-labs/fruition-motors"
              demoLink="https://www.fruitionmotors.com/"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={childImg}
              isBlog={false}
              title="Grandma Wura child interface"
              description="A content platform for children to watch lesson on the core values of the african society"
              // ghLink="https://github.com/ph-dev-labs/fruition-motors"
              demoLink="https://watch.grandmawurahub.app/"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={novaImg}
              isBlog={false}
              title="Novacrust Simplifying Global PaymentsWith Virtual Cards"
              description="Unlock the freedom to shop at your favorite online stores worldwide with Novacrust's USD virtual cards. Easily make purchases on platforms like Amazon, eBay"
              // ghLink="https://github.com/ph-dev-labs/fruition-motors"
              demoLink="https://novacrust.com/"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={novaBusinessImg}
              isBlog={false}
              title="Novacrust Business App"
              description="Unlock the freedom to shop at your favorite online stores worldwide with Novacrust's USD virtual cards. Easily make purchases on platforms like Amazon, eBay"
              // ghLink="https://github.com/ph-dev-labs/fruition-motors"
              demoLink="https://dashboard.novacrust.com"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={frexiqClImg}
              isBlog={false}
              title="Frexiq"
              description="Book your Beauty Appointments in seconds, Our user-friendly platform connects you with top-rated salons, spas and beauty service providers in your area, offering you a wide range of services - all at your fingertips"
              // ghLink="https://github.com/ph-dev-labs/fruition-motors"
              demoLink="https://www.frexiq.com/"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={flood}
              isBlog={false}
              title="Flood Prediction app"
              description="FloodGuard is a sophisticated web application that leverages machine learning algorithms to predict and visualize flood risk for communities across various geographical regions. By integrating historical flood data, real-time weather information, topographical analysis, and climate models, FloodGuard provides stakeholders with actionable insights to mitigate flood-related disasters and enhance community resilience"
              // ghLink="https://github.com/ph-dev-labs/fruition-motors"
              demoLink="https://flood-control-navy.vercel.app/"
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
