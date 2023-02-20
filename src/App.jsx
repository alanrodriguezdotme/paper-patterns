import { SVG } from "@svgdotjs/svg.js";
import jsPDF from "jspdf";
import "svg2pdf.js";
// import printJS from "print-js";
import { useContext, useEffect, useRef, useState } from "react";
import Button from "./components/Button";
import Dropdown from "./components/Dropdown";
import RadioButton from "./components/RadioButton";
import HorizontalLines from "./designs/HorizontalLines";
import VerticalLines from "./designs/VerticalLines";
import SquareGrid from "./designs/SquareGrid";
import DotGrid from "./designs/DotGrid";
import IsometricGrid from "./designs/IsometricGrid";
import Handwriting from "./designs/Handwriting";
import CircularGrid from "./designs/CircularGrid";
import TriangularGrid from "./designs/TriangularGrid";
import Panels from "./designs/Panels";
import { GlobalContext, paperSizes, designs } from "./context";
import { useNavigate } from "react-router-dom";
import { ArrowsClockwise } from "phosphor-react";

function App({ design }) {
  const [draw, setDraw] = useState(null);
  const [group, setGroup] = useState(null);
  const [maskGroup, setMaskGroup] = useState(null);
  const {
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
  } = useContext(GlobalContext);
  const paperRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (design && design !== selectedDesign.id) {
      setSelectedDesign(design);
    }
  }, [design]);

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
    if (draw && maskGroup) {
      drawMask(maskGroup);
    }
  }, [margin, size, maskGroup]);

  function toggleOrientation() {
    setOrientation(orientation === "portrait" ? "landscape" : "portrait");
  }

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
      case "horizontal-lines":
        return (
          <HorizontalLines size={size} group={group} paperSize={paperSize} />
        );
      case "vertical-lines":
        return (
          <VerticalLines group={group} size={size} paperSize={paperSize} />
        );
      case "panels":
        return (
          <Panels
            group={group}
            size={size}
            paperSize={paperSize}
            margin={margin}
          />
        );
      case "square-grid":
        return <SquareGrid group={group} size={size} paperSize={paperSize} />;
      case "dot-grid":
        return <DotGrid group={group} size={size} paperSize={paperSize} />;
      case "isometric-grid":
        return (
          <IsometricGrid group={group} size={size} paperSize={paperSize} />
        );
      case "triangular-grid":
        return (
          <TriangularGrid group={group} size={size} paperSize={paperSize} />
        );
      case "handwriting":
        return <Handwriting group={group} size={size} />;
      case "circular-grid":
        console.log(type);
        return <CircularGrid group={group} size={size} paperSize={paperSize} />;
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
      pdf.save(`${selectedDesign}.pdf`);
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
            <div className="flex gap-2 w-full items-flex-end">
              <div className="flex flex-col gap-1 p-4 pr-0 grow">
                <label htmlFor="type">Paper size</label>
                <Dropdown
                  value={paperSize.id}
                  onChange={(e) =>
                    setPaperSize(
                      paperSizes.find((ps) => ps.id === e.target.value)
                    )
                  }
                  options={paperSizes}
                />
              </div>
              <div className="flex gap-1 p-4 pl-0 items-end">
                <button className="square" onClick={() => toggleOrientation()}>
                  <ArrowsClockwise size={24} />
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1 p-4">
              <label htmlFor="margin">Margin</label>
              <input
                type="number"
                value={margin}
                min={2}
                max={paperSize?.short / 2}
                onChange={(e) => {
                  setMargin(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col gap-1 p-4">
              <label htmlFor="design">Design</label>
              <Dropdown
                value={selectedDesign.id}
                onChange={(e) => {
                  navigate(`/${e.target.value}`);
                }}
                options={designs}
              />
            </div>
          </div>
          {renderDesign(selectedDesign.id)}
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
