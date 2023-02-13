import { SVG } from "@svgdotjs/svg.js";
import jsPDF from "jspdf";
import "svg2pdf.js";
// import printJS from "print-js";
import { useEffect, useRef, useState } from "react";
import Button from "./components/Button";
import Dropdown from "./components/Dropdown";
import RadioButton from "./components/RadioButton";
// import Checkbox from "./components/Checkbox";

const initialColor = "#" + ((Math.random() * 0xffffff) << 0).toString(16);
const paperSizes = [
  { name: "Letter", ratio: 1.294, short: 612, long: 612 * 1.294 },
  { name: "A4", ratio: 1.4142, short: 595, long: 595 * 1.4142 },
];
const designs = [
  "Horizontal lines",
  "Vertical lines",
  "Square grid",
  "Dot grid",
  "Isometric",
];

function App() {
  const [draw, setDraw] = useState(null);
  const [orientation, setOrientation] = useState("portrait");
  const [paperSize, setPaperSize] = useState(paperSizes[0]);
  const [size, setSize] = useState({
    width: paperSize.short,
    height: paperSize.long,
  });
  // const [margin, setMargin] = useState(0);
  // const [showMarginBorder, setShowMarginBorder] = useState(true);
  const [design, setDesign] = useState("Horizontal lines");
  const [gap, setGap] = useState(15);
  const [dotSize, setDotSize] = useState(5);
  const [lineColor, setLineColor] = useState(initialColor);
  const [lineWidth, setLineWidth] = useState(1.0);
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
      renderShapes(design);
      // showMarginBorder &&
      //   draw
      //     .rect(size.width * 2, size.height * 2)
      //     .move(margin, margin)
      //     .fill("none")
      //     .stroke({ color: lineColor, width: lineWidth });
    }
  }, [draw]);

  useEffect(() => {
    if (draw !== null) {
      draw.clear();
      renderShapes(design);
      // showMarginBorder &&
      //   draw
      //     .rect(size.width * 2, size.height * 2)
      //     .move(margin, margin)
      //     .fill("none")
      //     .stroke({ color: lineColor, width: lineWidth });
    }
  }, [
    design,
    gap,
    lineColor,
    size,
    dotSize,
    orientation,
    lineWidth,
    // margin,
    // showMarginBorder,
  ]);

  function renderShapes(type) {
    switch (type) {
      case "Horizontal lines":
        for (let i = gap; i < size.height; i += gap) {
          draw
            .line(0, i, size.width, i)
            .stroke({ color: lineColor, width: lineWidth });
        }
        break;
      case "Vertical lines":
        for (let i = gap; i < size.width; i += gap) {
          draw
            .line(i, 0, i, size.height)
            .stroke({ color: lineColor, width: lineWidth });
        }
        break;
      case "Square grid":
        for (let i = gap; i < size.height; i += gap) {
          draw
            .line(0, i, size.width, i)
            .stroke({ color: lineColor, width: lineWidth });
        }
        for (let i = gap; i < size.width; i += gap) {
          draw
            .line(i, 0, i, size.height)
            .stroke({ color: lineColor, width: lineWidth });
        }
        break;
      case "Dot grid":
        for (
          let y = dotSize / 2 + gap;
          y < size.height - dotSize / 2 - gap;
          y += gap
        ) {
          for (
            let x = dotSize / 2 + gap;
            x < size.width - (gap - dotSize);
            x += gap
          ) {
            draw.circle(dotSize).center(x, y).fill(lineColor);
          }
        }
        break;
      case "Isometric":
        for (let i = 0; i < size.height; i += gap) {
          draw
            .line(0, i, Math.min(gap * c * 2, size.width), Math.max(0))
            .stroke({ color: lineColor, width: lineWidth })
            .transform({ origin: { x: 0, y: i }, rotate: -30 });
          draw
            .line(
              0,
              i - size.height,
              Math.hypot(size.width, size.height),
              i - size.height
            )
            .stroke({ color: lineColor, width: lineWidth })
            .transform({
              origin: { x: 0, y: i - size.height },
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
          className="flex justify-center items-start"
          style={{ width: size.width, height: size.height }}
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
                setPaperSize(
                  paperSizes.find((size) => size.name === e.target.value)
                )
              }
              options={paperSizes.map((size) => size.name)}
            />
          </div>
          {/* <div className="flex flex-col gap-1">
            <label htmlFor="margin">Page margin</label>
            <input
              type="number"
              value={margin}
              min={0}
              max={size.height / 2}
              onChange={(e) => {
                if (parseInt(e.target.value) > 0) {
                  setMargin(parseInt(e.target.value));
                } else {
                  setMargin(0);
                }
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="gap">Margin border</label>
            <Checkbox
              label="Show"
              checked={showMarginBorder}
              onChange={() => setShowMarginBorder(!showMarginBorder)}
            />
          </div> */}
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
              min={design === "Dot grid" ? 10 : 2}
              max={size.height / 2}
              onChange={(e) => {
                if (
                  parseInt(e.target.value) > (design === "Dot grid" ? 10 : 2)
                ) {
                  setGap(parseInt(e.target.value));
                } else {
                  setGap(design === "Dot grid" ? 10 : 2);
                }
              }}
            />
          </div>
          {design === "Dot grid" && (
            <div className="flex flex-col gap-1">
              <label htmlFor="gap">Dot size</label>
              <input
                type="number"
                value={dotSize}
                min="2"
                max={size.height / 10}
                onChange={(e) => setDotSize(parseInt(e.target.value))}
              />
            </div>
          )}
          {(design === "Horizontal lines" ||
            design === "Vertical lines" ||
            design === "Square grid" ||
            design === "Isometric") && (
            <div className="flex flex-col gap-1">
              <label htmlFor="gap">Line width</label>
              <input
                type="number"
                value={lineWidth}
                step="any"
                min={0.1}
                max={paperSize.long / 10}
                onChange={(e) => setLineWidth(parseInt(e.target.value))}
              />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label htmlFor="lineColor">Color</label>
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
