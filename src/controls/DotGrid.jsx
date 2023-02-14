import { useEffect, useState } from "react";
import { initialColor } from "../helpers";

export default function DotGrid({ draw, size, paperSize }) {
  const [gap, setGap] = useState(16);
  const [lineColor, setLineColor] = useState(initialColor);
  const [dotSize, setDotSize] = useState(3);

  useEffect(() => {
    draw !== null && drawLines();
  }, [draw, lineColor, gap, dotSize, size]);

  function drawLines() {
    draw.clear();
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
        draw.circle(dotSize).center(x, y).fill(lineColor);
      }
    }
  }

  return (
    <div className="flex flex-col gap-6">
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
