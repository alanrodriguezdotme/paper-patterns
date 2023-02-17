import { useEffect, useState } from "react";
import { randomColor } from "../helpers";

export default function ConcentricCircles({ group, size, paperSize }) {
  const [gap, setGap] = useState(50);
  const [amount, setAmount] = useState(10);
  const [lineWidth, setLineWidth] = useState(1.0);
  const [lineColor, setLineColor] = useState(randomColor);

  useEffect(() => {
    group && drawLines();
  }, [group, gap, amount, size, lineColor, lineWidth]);

  function drawLines() {
    group.clear();
    group
      .circle(gap / 2)
      .center(size.width / 2, size.height / 2)
      .fill("none")
      .stroke({ color: lineColor, width: lineWidth });

    for (let i = 1; i < amount; i++) {
      let r = gap * i;
      group
        .circle(r * 2)
        .center(size.width / 2, size.height / 2)
        .fill("none")
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
        <div className="flex flex-col gap-1 p-4 pl-0 w-1/2">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            value={amount}
            min={2}
            max={size.height / 2}
            onChange={(e) => setAmount(parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
