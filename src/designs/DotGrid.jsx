import { useEffect, useState } from "react";
import { randomColor } from "../helpers";

export default function DotGrid({ group, size, paperSize }) {
  const [gap, setGap] = useState(16);
  const [lineColor, setLineColor] = useState(randomColor);
  const [dotSize, setDotSize] = useState(3);

  useEffect(() => {
    group && drawLines();
  }, [group, lineColor, gap, dotSize, size]);

  function drawLines() {
    group.clear();
    for (
      let y = dotSize / 2 + gap;
      y < size.height - (gap - dotSize);
      y += gap
    ) {
      for (
        let x = dotSize / 2 + gap;
        x < size.width - (gap - dotSize);
        x += gap
      ) {
        group.circle(dotSize).center(x, y).fill(lineColor);
      }
    }
  }

  return (
    <div className="flex flex-col">
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
      <div className="flex flex-col gap-1 p-4">
        <label htmlFor="gap">Dot size</label>
        <input
          type="number"
          value={dotSize}
          step="any"
          min={1}
          max={paperSize.long / 4}
          onChange={(e) => setDotSize(parseInt(e.target.value))}
        />
      </div>
      <div className="flex flex-col gap-1 p-4">
        <label htmlFor="lineColor">Color</label>
        <input
          className="w-full h-10 border"
          type="color"
          value={lineColor}
          onChange={(e) => setLineColor(e.target.value)}
        />
      </div>
    </div>
  );
}
