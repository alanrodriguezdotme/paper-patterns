import { useEffect, useState } from "react";
import { createContext } from "react";

export const paperSizes = [
  { name: "Letter", id: "letter", ratio: 1.294, short: 612, long: 612 * 1.294 },
  { name: "A4", id: "a4", ratio: 1.4142, short: 595, long: 595 * 1.4142 },
];

export const designs = [
  {
    name: "Horizontal lines",
    id: "horizontal-lines",
  },
  {
    name: "Vertical lines",
    id: "vertical-lines",
  },
  {
    name: "Handwriting",
    id: "handwriting",
  },
  {
    name: "Panels",
    id: "panels",
  },
  {
    name: "Square grid",
    id: "square-grid",
  },
  {
    name: "Dot grid",
    id: "dot-grid",
  },
  {
    name: "Isometric grid",
    id: "isometric-grid",
  },
  {
    name: "Triangular grid",
    id: "triangular-grid",
  },
  {
    name: "Circular grid",
    id: "circular-grid",
  },
];

export const GlobalContext = createContext();

export default function GlobalContextProvider({ children }) {
  const [selectedDesign, setSelectedDesign] = useState(
    // designs[3]
    designs[Math.floor(Math.random() * designs.length)]
  );
  const [orientation, setOrientation] = useState("portrait");
  const [paperSize, setPaperSize] = useState(paperSizes[0]);
  const [margin, setMargin] = useState(0);
  const [size, setSize] = useState({
    width: paperSizes[0].short,
    height: paperSizes[0].long,
  });

  return (
    <GlobalContext.Provider
      value={{
        selectedDesign,
        setSelectedDesign,
        orientation,
        setOrientation,
        paperSize,
        setPaperSize,
        margin,
        setMargin,
        size,
        setSize,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
