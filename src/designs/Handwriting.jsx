import { useEffect, useState } from "react";
import { initialColor } from "../helpers";

export default function Handwriting({ group, size, template }) {
  const [amount, setAmount] = useState(template ? template.amount : 10);
  const [lineColor, setLineColor] = useState(
    template ? template.lineColor : initialColor
  );
  const [lineWidth, setLineWidth] = useState(
    template ? template?.lineWidth : 1
  );
  const [height, setHeight] = useState(template ? template.height : 40);
  const [dash, setDash] = useState(template ? template.dash : 6);
  const [dashGap, setDashGap] = useState(template ? template.dashGap : 4);

  useEffect(() => {
    group && drawLines();
  }, [group, lineColor, amount, lineWidth, size, height, template]);

  function drawLines() {
    group.clear();
    let section = size.height / amount;
    for (let i = 1; i <= amount; i++) {
      let center = section * i - section / 2;
      group
        .line(0, center, size.width, center)
        .attr({ "stroke-dasharray": `${dash} ${dashGap}` })
        .stroke({ color: lineColor, width: lineWidth });
      group
        .line(0, center - height / 2, size.width, center - height / 2)
        .stroke({ color: lineColor, width: lineWidth + 1 });
      group
        .line(0, center + height / 2, size.width, center + height / 2)
        .stroke({ color: lineColor, width: lineWidth + 1 });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <label htmlFor="amount">Amount</label>
        <input
          type="number"
          value={amount}
          min={2}
          max={size.height / height}
          onChange={(e) => setAmount(parseInt(e.target.value))}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="height">Height</label>
        <input
          type="number"
          value={height}
          min={15}
          max={size.height / amount}
          onChange={(e) => setHeight(parseInt(e.target.value))}
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
