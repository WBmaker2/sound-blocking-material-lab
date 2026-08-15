import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SoundLabApp } from "../app/components/SoundLabApp";
import "../app/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SoundLabApp />
  </StrictMode>,
);
