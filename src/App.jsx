import { SVG } from "@svgdotjs/svg.js";
import jsPDF from "jspdf";
import "svg2pdf.js";
// import printJS from "print-js";
import { useEffect, useRef, useState } from "react";
import Button from "./components/Button";
import Dropdown from "./components/Dropdown";
import RadioButton from "./components/RadioButton";
import HorizontalLines from "./designs/HorizontalLines";
import VerticalLines from "./designs/VerticalLines";
import SquareGrid from "./designs/SquareGrid";
import DotGrid from "./designs/DotGrid";
import IsometricGrid from "./designs/IsometricGrid";
import Handwriting from "./designs/Handwriting";
import ConcentricCircles from "./designs/ConcentricCircles";
import TriangularGrid from "./designs/TriangularGrid";
import Panels from "./designs/Panels";

const paperSizes = [
  { name: "Letter", ratio: 1.294, short: 612, long: 612 * 1.294 },
  { name: "A4", ratio: 1.4142, short: 595, long: 595 * 1.4142 },
];
const designs = [
  "Horizontal lines",
  "Vertical lines",
  "Handwriting",
  "Panels",
  "Square grid",
  "Dot grid",
  "Isometric grid",
  "Triangular grid",
  "Concentric cirlces",
];

function App() {
  const [draw, setDraw] = useState(null);
  const [orientation, setOrientation] = useState("portrait");
  const [paperSize, setPaperSize] = useState(paperSizes[0]);
  const [margin, setMargin] = useState(0);
  const [group, setGroup] = useState(null);
  const [maskGroup, setMaskGroup] = useState(null);
  const [size, setSize] = useState({
    width: paperSize.short,
    height: paperSize.long,
  });
  const [design, setDesign] = useState(
    designs[3]
    // designs[Math.floor(Math.random() * designs.length)]
  );
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

    if (draw) {
      if (!group) {
        let g = draw.group();
        setGroup(g);
      }
      if (!maskGroup) {
        let mg = draw.group();
        setMaskGroup(mg);
      }
    }
  }, [draw]);

  useEffect(() => {
    console.log({ size });
    if (draw && maskGroup) {
      drawMask(maskGroup);
    }
  }, [margin, size, maskGroup]);

  function drawMask(group) {
    group.clear();
    let path = `M 0 0 L ${size.width} 0 L ${size.width} ${size.height} L 0 ${
      size.height
    } L 0 0 M ${margin} ${margin} L ${size.width - margin} ${margin} L ${
      size.width - margin
    } ${size.height - margin} L ${margin} ${
      size.height - margin
    } L ${margin} ${margin}`;

    group
      .path(path)
      .fill("white")
      .stroke({ width: 1, color: "none" })
      .attr("fill-rule", "evenodd");
  }

  function renderDesign(type) {
    switch (type) {
      case "Horizontal lines":
        return (
          <HorizontalLines size={size} group={group} paperSize={paperSize} />
        );
      case "Vertical lines":
        return (
          <VerticalLines group={group} size={size} paperSize={paperSize} />
        );
      case "Panels":
        return (
          <Panels
            group={group}
            size={size}
            paperSize={paperSize}
            margin={margin}
          />
        );
      case "Square grid":
        return <SquareGrid group={group} size={size} paperSize={paperSize} />;
      case "Dot grid":
        return <DotGrid group={group} size={size} paperSize={paperSize} />;
      case "Isometric grid":
        return (
          <IsometricGrid group={group} size={size} paperSize={paperSize} />
        );
      case "Triangular grid":
        return (
          <TriangularGrid group={group} size={size} paperSize={paperSize} />
        );
      case "Handwriting":
        return <Handwriting group={group} size={size} />;
      case "Concentric cirlces":
        return (
          <ConcentricCircles group={group} size={size} paperSize={paperSize} />
        );
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
      className="w-screen h-screen flex items-center justify-center bg-zinc-300 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 overflow-hidden"
    >
      <div className="w-full h-full flex">
        <div
          id="controls"
          className="flex flex-col h-full drop-shadow-md bg-zinc-200 dark:bg-zinc-900 overflow-y-auto"
          style={{ width: 300 }}
        >
          <div className="bg-zinc-100 dark:bg-black pb-2 mb-2 shadow-sm">
            <div className="flex flex-col gap-1 p-4">
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
            <div className="flex flex-col gap-1 p-4">
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
            <div className="flex flex-col gap-1 p-4">
              <label htmlFor="margin">Margin</label>
              <input
                type="number"
                value={margin}
                min={2}
                max={paperSize.short / 2}
                onChange={(e) => {
                  setMargin(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col gap-1 p-4">
              <label htmlFor="design">Design</label>
              <Dropdown
                value={design}
                onChange={(e) => {
                  setDesign(e.target.value);
                }}
                options={designs}
              />
            </div>
          </div>
          {renderDesign(design)}
          <div className="flex gap-4 p-4">
            <Button fullWidth onClick={() => createPdf()}>
              Download PDF
            </Button>
            {/* <Button
                onClick={() => printJS({ printable: "paper", type: "html" })}
              >
                Print
              </Button> */}
          </div>
        </div>
        <div className="flex justify-center items-center flex-grow h-full grow overflow-auto py-12">
          <div
            className="flex justify-center items-start"
            style={{ width: size.width, height: size.height }}
          >
            <div
              ref={paperRef}
              id="paper"
              className="border border-zinc-300 dark:border-zinc-900 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
