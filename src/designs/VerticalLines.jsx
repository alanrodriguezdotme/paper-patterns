import { useEffect, useState } from "react";
import { randomColor } from "../helpers";

export default function VerticalLines({ group, size, paperSize }) {
  const [gap, setGap] = useState(15);
  const [lineColor, setLineColor] = useState(randomColor);
  const [lineWidth, setLineWidth] = useState(1.0);

  useEffect(() => {
    group !== null && drawLines();
  }, [group, lineColor, gap, lineWidth, size]);

  function drawLines() {
    group.clear();
    for (let i = gap; i < size.width; i += gap) {
      group
        .line(i, 0, i, size.height)
        .stroke({ color: lineColor, width: lineWidth });
    }
  }

  return (
    <div className="flex flex-col">
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
