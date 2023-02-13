import { SVG } from "@svgdotjs/svg.js";
import jsPDF from "jspdf";
import "svg2pdf.js";
import printJS from "print-js";
import { useEffect, useRef, useState } from "react";
import Button from "./components/Button";
import Dropdown from "./components/Dropdown";
import RadioButton from "./components/RadioButton";

const initialColor = "#" + ((Math.random() * 0xffffff) << 0).toString(16);
const paperSizes = [
  { name: "Letter", ratio: 1.294, short: 612, long: 612 * 1.294 },
  { name: "A4", ratio: 1.4142, short: 595, long: 595 * 1.4142 },
];
const designs = [
  "Horizontal lines",
  "Vertical lines",
  "Square grid",
  "Isometric grid",
];

function App() {
  const [draw, setDraw] = useState(null);
  const [orientation, setOrientation] = useState("portrait");
  const [design, setDesign] = useState("Horizontal lines");
  const [gap, setGap] = useState(15);
  const [size, setSize] = useState(paperSizes[0]);
  const [lineColor, setLineColor] = useState(initialColor);
  const paperRef = useRef();

  useEffect(() => {
    if (!draw) {
      setDraw(
        SVG()
          .addTo(paperRef.current)
          .size(size.short, size.long)
          .addClass("svg")
      );
    }
  }, []);

  useEffect(() => {
    if (draw !== null) {
      if (orientation === "portrait") {
        draw.size(size.short, size.long);
      } else {
        draw.size(size.long, size.short);
      }
    }
  }, [orientation, size]);

  useEffect(() => {
    // Hack to fix React from rendering a second SVG element
    let svgElements = document.getElementsByClassName("svg");
    svgElements?.length > 1 && svgElements[0].remove();

    draw && renderShapes(design);
  }, [draw]);

  useEffect(() => {
    if (draw !== null) {
      draw.clear();
      renderShapes(design);
    }
  }, [design, gap, lineColor, size]);

  function renderShapes(type) {
    switch (type) {
      case "Horizontal lines":
        for (let i = 0; i < size.long; i += gap) {
          draw.line(0, i, size.long, i).stroke({ color: lineColor, width: 1 });
        }
        break;
      case "Vertical lines":
        for (let i = 0; i < size.long; i += gap) {
          draw.line(i, 0, i, size.long).stroke({ color: lineColor, width: 1 });
        }
        break;
      case "Square grid":
        for (let i = 0; i < size.long; i += gap) {
          draw.line(0, i, size.long, i).stroke({ color: lineColor, width: 1 });
          draw.line(i, 0, i, size.long).stroke({ color: lineColor, width: 1 });
        }
        break;
      case "Isometric grid":
        for (let i = 0; i < size.long * 2; i += gap) {
          draw
            .line(0, i, Math.hypot(size.short, size.long), i)
            .stroke({ color: lineColor, width: 1 })
            .transform({ origin: { x: 0, y: i }, rotate: -30 });
          draw
            .line(
              0,
              i - size.long,
              Math.hypot(size.short, size.long),
              i - size.long
            )
            .stroke({ color: lineColor, width: 1 })
            .transform({
              origin: { x: 0, y: i - size.long },
              rotate: 30,
            });
        }
        break;
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
    console.log({ svg, width, height });
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
          className="flex items-center justify-center"
          style={{ width: size.long, height: size.long }}
        >
          <div
            ref={paperRef}
            id="paper"
            className="border border-zinc-400 bg-white"
          />
        </div>
        <div id="controls" className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label htmlFor="type">Paper size</label>
            <Dropdown
              value={size.name}
              onChange={(e) =>
                setSize(paperSizes.find((size) => size.name === e.target.value))
              }
              options={paperSizes.map((size) => size.name)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="orientation">Orientation</label>
            <div className="flex flex-col gap-1">
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
          <div className="flex flex-col gap-1">
            <label htmlFor="design">Design</label>
            <Dropdown
              value={design}
              onChange={(e) => setDesign(e.target.value)}
              options={designs}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="gap">Gap</label>
            <input
              type="number"
              value={gap}
              min="2"
              max={size.long / 2}
              onChange={(e) => setGap(parseInt(e.target.value))}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="lineColor">Line color</label>
            <input
              className="w-full h-8"
              type="color"
              value={lineColor}
              onChange={(e) => setLineColor(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Button lineColor={lineColor} onClick={() => createPdf()}>
              Download PDF
            </Button>
            {/* <Button
              onClick={() => printJS({ printable: "paper", type: "html" })}
            >
              Print
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
