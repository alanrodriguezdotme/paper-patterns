import { useEffect, useState } from "react";
import { initialColor } from "../helpers";

export default function IsometricGrid({ draw, size, paperSize }) {
  const [gap, setGap] = useState(15);
  const [lineColor, setLineColor] = useState(initialColor);
  const [lineWidth, setLineWidth] = useState(1.0);

  useEffect(() => {
    draw !== null && drawLines();
  }, [draw, lineColor, gap, lineWidth, size]);

  function drawLines() {
    draw.clear();
    for (let i = 0; i < size.height * 2; i += gap) {
      draw
        .line(0, i, Math.hypot(size.width, size.height), i)
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
