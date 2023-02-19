import { useEffect, useState } from "react";
import { randomColor } from "../helpers";

export default function CircularGrid({ group, size, paperSize }) {
  const [gap, setGap] = useState(50);
  const [circles, setCircles] = useState(10);
  const [lines, setLines] = useState(3);
  const [lineWidth, setLineWidth] = useState(1.0);
  const [lineColor, setLineColor] = useState(randomColor);

  useEffect(() => {
    group && drawLines();
  }, [group, gap, circles, lines, size, lineColor, lineWidth]);

  function drawLines() {
    group.clear();
    group
      .circle(gap / 2)
      .center(size.width / 2, size.height / 2)
      .fill("none")
      .stroke({ color: lineColor, width: lineWidth });

    for (let i = 1; i < circles; i++) {
      let r = gap * i;
      group
        .circle(r * 2)
        .center(size.width / 2, size.height / 2)
        .fill("none")
        .stroke({ color: lineColor, width: lineWidth });
    }

    let hc = size.height / 2;
    let wc = size.width / 2;
    let length = paperSize.long * 1.3333;
    for (let l = 0; l < lines; l++) {
      let angle = (180 / lines) * l;
      group
        .line(0, 0, length, 0)
        .move(0 - (length - size.width) / 2, hc)
        .stroke({ color: lineColor, width: lineWidth })
        .rotate(angle);
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
            className="w-full border"
            style={{ height: 42 }}
            type="color"
            value={lineColor}
            onChange={(e) => setLineColor(e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-2 w-full">
        <div className="grow flex flex-col gap-1 p-4 pr-0 w-1/2">
          <label htmlFor="lines">Lines</label>
          <input
            type="number"
            value={lines}
            min={0}
            max={30}
            onChange={(e) => setLines(parseInt(e.target.value))}
          />
        </div>
        <div className="flex flex-col gap-1 p-4 pl-0 w-1/2">
          <label htmlFor="circles">Circles</label>
          <input
            type="number"
            value={circles}
            min={2}
            max={30}
            onChange={(e) => setCircles(parseInt(e.target.value))}
          />
        </div>
      </div>
      <div className="grow flex flex-col gap-1 p-4">
        <label htmlFor="gap">Gap</label>
        <input
          className="w-full"
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
