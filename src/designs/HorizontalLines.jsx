import { useEffect, useState } from "react";
import Dropdown from "../components/Dropdown";
import { randomColor } from "../helpers";

const templates = [
  {
    name: "College ruled",
    id: "college-ruled",
    design: "Horizontal lines",
    gap: 20,
    lineWidth: 1,
    lineColor: "#ADD8E6",
  },
  {
    name: "Wide ruled",
    id: "wide-ruled",
    design: "Horizontal lines",
    gap: 25,
    lineWidth: 1,
    lineColor: "#ADD8E6",
  },
];

export default function HorizontalLines({ group, size, paperSize }) {
  const [template, setTemplate] = useState(null);
  const [gap, setGap] = useState(20);
  const [lineColor, setLineColor] = useState(randomColor());
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
    <div className="flex flex-col">
      <div className="flex flex-col gap-1 p-4">
        <label htmlFor="template">Template</label>
        <Dropdown
          value={template === null ? "none" : template.id}
          onChange={(e) =>
            setTemplate(
              e.target.value !== "none"
                ? templates.find((template) => template.id === e.target.value)
                : null
            )
          }
          options={[{ name: "None", id: "none" }, ...templates]}
        />
      </div>
      <div className="flex gap-2 w-full">
        <div className="flex flex-col gap-1 p-4 pr-0 w-1/2">
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
        <div className="flex flex-col gap-1 p-4 pl-0 w-1/2">
          <label htmlFor="lineColor">Color</label>
          <input
            className="w-full h-10 border"
            type="color"
            value={lineColor}
            onChange={(e) => setLineColor(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1 p-4">
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
    </div>
  );
}
