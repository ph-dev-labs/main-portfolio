import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("react-pdf", () => ({ Document: () => null, Page: () => null, pdfjs: { GlobalWorkerOptions: {} } }));
jest.mock("react-github-calendar", () => () => null);
jest.mock("./components/Home/HeroScene", () => () => null);

window.scrollTo = () => {};

test("hero states the value proposition and offers a contact path", () => {
  render(<App />);
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/frontends that ship/i);
  expect(screen.getAllByRole("link", { name: /let's talk/i }).length).toBeGreaterThan(0);
});
