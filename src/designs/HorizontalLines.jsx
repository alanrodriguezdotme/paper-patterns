import { useEffect, useState } from "react";
import Dropdown from "../components/Dropdown";

const templates = [
  {
    name: "College ruled",
    design: "Horizontal lines",
    gap: 20,
    lineWidth: 1,
    lineColor: "#ADD8E6",
  },
  {
    name: "Wide ruled",
    design: "Horizontal lines",
    gap: 25,
    lineWidth: 1,
    lineColor: "#ADD8E6",
  },
];

export default function HorizontalLines({ group, size, paperSize }) {
  const [template, setTemplate] = useState(null);
  const [gap, setGap] = useState(20);
  const [lineColor, setLineColor] = useState("#ADD8E6");
  const [lineWidth, setLineWidth] = useState(1);

  useEffect(() => {
    group && drawLines();
  }, [lineColor, gap, lineWidth, size, group]);

  useEffect(() => {
    if (template !== null && template.design === "Horizontal lines") {
      setGap(template.gap);
      setLineColor(template.lineColor);
      setLineWidth(template.lineWidth);
    }
  }, [template]);

  function drawLines() {
    group.clear();
    for (let i = gap; i < size.height; i += gap) {
      group
        .line(0, i, size.width, i)
        .stroke({ color: lineColor, width: lineWidth });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <label htmlFor="template">Template</label>
        <Dropdown
          value={template === null ? "None" : template.name}
          onChange={(e) =>
            setTemplate(
              e.target.value !== "None"
                ? templates.find((template) => template.name === e.target.value)
                : null
            )
          }
          options={["None", ...templates.map((t) => t.name)]}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="gap">Gap</label>
        <input
          type="number"
          value={gap}
          min={2}
          max={size.height / 2}
          onChange={(e) => {
            if (parseInt(e.target.value) > 2) {
              setGap(parseInt(e.target.value));
            } else {
              setGap(2);
            }
          }}
        />
      </div>
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
      <div className="flex flex-col gap-1">
        <label htmlFor="lineColor">Color</label>
        <input
          className="w-full h-8"
          type="color"
          value={lineColor}
          onChange={(e) => setLineColor(e.target.value)}
        />
      </div>
    </div>
  );
}
