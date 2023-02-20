import { useEffect, useState } from "react";
import { randomColor } from "../helpers";

export default function TriangularGrid({ group, size, paperSize }) {
  const [gap, setGap] = useState(60);
  const [lineColor, setLineColor] = useState(randomColor());
  const [lineWidth, setLineWidth] = useState(1.0);

  useEffect(() => {
    group && drawLines();
  }, [group, lineColor, gap, lineWidth, size]);

  function drawLines() {
    group.clear();
    let max = Math.max(size.width, size.height);
    for (let i = 0; i < max * 2.5; i += gap) {
      group
        .line(0, i, Math.hypot(size.width, Math.sqrt(3) * size.width), i)
        .stroke({ color: lineColor, width: lineWidth })
        .transform({ origin: { x: 0, y: i }, rotate: -60 });
      group
        .line(0, i, Math.hypot(size.width, Math.sqrt(3) * size.width), i)
        .stroke({ color: lineColor, width: lineWidth })
        .transform({ origin: { x: 0, y: i }, rotate: 60 });
    }
    for (let i = 0; i > -max * 1.5; i -= gap) {
      group
        .line(0, i, Math.hypot(size.width, Math.sqrt(3) * size.width), i)
        .stroke({ color: lineColor, width: lineWidth })
        .transform({ origin: { x: 0, y: i }, rotate: 60 });
    }
    for (let i = 0; i < max; i += gap / 2) {
      group
        .line(0, i, size.width, i)
        .stroke({ color: lineColor, width: lineWidth });
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex gap-2 w-full">
        <div className="grow flex flex-col gap-1 p-4 pr-0 w-1/2">
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
