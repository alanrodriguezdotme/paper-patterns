import { SVG } from "@svgdotjs/svg.js";
import jsPDF from "jspdf";
import "svg2pdf.js";
// import printJS from "print-js";
import { useEffect, useRef, useState } from "react";
import Button from "./components/Button";
import Dropdown from "./components/Dropdown";
import RadioButton from "./components/RadioButton";
import HorizontalLines from "./controls/HorizontalLines";
import VerticalLines from "./controls/VerticalLines";
import SquareGrid from "./controls/SquareGrid";
import DotGrid from "./controls/DotGrid";
import IsometricGrid from "./controls/IsometricGrid";
import { templates } from "./templates";
import Handwriting from "./controls/Handwriting";

const paperSizes = [
  { name: "Letter", ratio: 1.294, short: 612, long: 612 * 1.294 },
  { name: "A4", ratio: 1.4142, short: 595, long: 595 * 1.4142 },
];
const designs = [
  "Horizontal lines",
  "Vertical lines",
  "Square grid",
  "Dot grid",
  "Isometric grid",
  "Handwriting",
];

const templateNames = [
  "None",
  "College ruled",
  "Wide ruled",
  "Handwriting practice",
];

function App() {
  const [draw, setDraw] = useState(null);
  const [orientation, setOrientation] = useState("portrait");
  const [paperSize, setPaperSize] = useState(paperSizes[0]);
  const [size, setSize] = useState({
    width: paperSize.short,
    height: paperSize.long,
  });
  const [design, setDesign] = useState(
    designs[Math.floor(Math.random() * (designs.length - 1))]
  );
  const [template, setTemplate] = useState(null);
  const paperRef = useRef();

  useEffect(() => {
    if (!draw) {
      setDraw(
        SVG()
          .addTo(paperRef.current)
          .size(size.width, size.height)
          .addClass("svg")
      );
    }
  }, []);

  useEffect(() => {
    if (draw && template) {
      draw.clear();
      setDesign(template.design);
    }
  }, [template]);

  useEffect(() => {
    if (draw !== null) {
      if (orientation === "portrait") {
        setSize({ width: paperSize.short, height: paperSize.long });
        draw.size(paperSize.short, paperSize.long);
      } else {
        setSize({ width: paperSize.long, height: paperSize.short });
        draw.size(paperSize.long, paperSize.short);
      }
    }
  }, [orientation, paperSize]);

  useEffect(() => {
    // Hack to fix React from rendering a second SVG element
    let svgElements = document.getElementsByClassName("svg");
    svgElements?.length > 1 && svgElements[0].remove();
  }, [draw]);

  function renderDesign(type) {
    switch (type) {
      case "Horizontal lines":
        return (
          <HorizontalLines
            draw={draw}
            size={size}
            paperSize={paperSize}
            template={template}
          />
        );
      case "Vertical lines":
        return (
          <VerticalLines
            draw={draw}
            size={size}
            paperSize={paperSize}
            template={template}
          />
        );
      case "Square grid":
        return (
          <SquareGrid
            draw={draw}
            orientation={orientation}
            size={size}
            paperSize={paperSize}
            template={template}
          />
        );
      case "Dot grid":
        return (
          <DotGrid
            draw={draw}
            size={size}
            paperSize={paperSize}
            template={template}
          />
        );
      case "Isometric grid":
        return (
          <IsometricGrid
            draw={draw}
            size={size}
            paperSize={paperSize}
            template={template}
          />
        );
      case "Handwriting":
        return <Handwriting draw={draw} size={size} template={template} />;
      default:
        return;
    }
  }

  async function createPdf() {
    const svg = document.getElementsByClassName("svg")[0];
    const width = svg?.width.baseVal.value;
    const height = svg?.height.baseVal.value;
    const pdf = new jsPDF(orientation === "landscape" ? "l" : "p", "pt", [
      width,
      height,
    ]);
    await pdf.svg(svg, { width, height }).then(() => {
      pdf.save(`${design}.pdf`);
    });
  }

  return (
    <div
      id="app"
      className="w-screen h-screen flex items-center justify-center"
    >
      <div className="flex gap-12">
        <div
          className="flex justify-center items-start"
          style={{ width: size.width, height: size.height }}
        >
          <div
            ref={paperRef}
            id="paper"
            className="border border-zinc-400 bg-white"
          />
        </div>
        <div id="controls" className="flex flex-col" style={{ minWidth: 240 }}>
          <div className="flex flex-col gap-1 pb-4">
            <label htmlFor="type">Paper size</label>
            <Dropdown
              value={size.name}
              onChange={(e) =>
                setPaperSize(
                  paperSizes.find((size) => size.name === e.target.value)
                )
              }
              options={paperSizes.map((size) => size.name)}
            />
          </div>
          <div className="flex flex-col gap-1 py-4">
            <label htmlFor="orientation">Orientation</label>
            <div className="flex gap-4">
              <RadioButton
                label="Portrait"
                name="orientation"
                value="portrait"
                checked={orientation === "portrait"}
                onChange={(e) => setOrientation(e.target.value)}
              />
              <RadioButton
                label="Landscape"
                name="orientation"
                value="landscape"
                checked={orientation === "landscape"}
                onChange={(e) => setOrientation(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 py-4">
            <label htmlFor="template">Template</label>
            <Dropdown
              value={template === null ? "None" : template.name}
              onChange={(e) =>
                setTemplate(
                  e.target.value !== "None"
                    ? templates.find(
                        (template) => template.name === e.target.value
                      )
                    : null
                )
              }
              options={templateNames}
            />
          </div>
          <div className="flex flex-col gap-1 my-4 py-4 border-t border-slate-500">
            <div className="flex flex-col gap-1 py-4">
              <label htmlFor="design">Design</label>
              <Dropdown
                value={design}
                onChange={(e) => {
                  setDesign(e.target.value);
                  setTemplate(null);
                }}
                options={designs}
              />
            </div>
            {renderDesign(design)}
            <div className="flex gap-4 py-4">
              <Button onClick={() => createPdf()}>Download PDF</Button>
              {/* <Button
              onClick={() => printJS({ printable: "paper", type: "html" })}
            >
              Print
            </Button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
