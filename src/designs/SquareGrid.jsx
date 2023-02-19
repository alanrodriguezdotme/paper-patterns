import { useEffect, useState } from "react";
import Dropdown from "../components/Dropdown";
import { randomColor } from "../helpers";

const positions = [
  { name: "Top left", id: "top-left" },
  { name: "Center", id: "center" },
];

export default function SquareGrid({ group, size, paperSize }) {
  const [gap, setGap] = useState(15);
  const [lineColor, setLineColor] = useState(randomColor);
  const [lineWidth, setLineWidth] = useState(1.0);
  const [position, setPosition] = useState(positions[0]);
  const [centerLineWidth, setCenterLineWidth] = useState(1.0);

  useEffect(() => {
    group && drawLines();
  }, [group, lineColor, gap, lineWidth, size, position, centerLineWidth]);

  function drawLines() {
    let centerX = size.width / 2;
    let centerY = size.height / 2;
    group.clear();
    if (position.id === "top-left") {
      for (let i = gap; i < size.height; i += gap) {
        group
          .line(0, i, size.width, i)
          .stroke({ color: lineColor, width: lineWidth });
      }
      for (let i = gap; i < size.width; i += gap) {
        group
          .line(i, 0, i, size.height)
          .stroke({ color: lineColor, width: lineWidth });
      }
    } else {
      group
        .line(0, centerY, size.width, centerY)
        .stroke({ color: lineColor, width: centerLineWidth });
      group
        .line(centerX, 0, centerX, size.height)
        .stroke({ color: lineColor, width: centerLineWidth });
      for (let i = gap; i < centerY; i += gap) {
        group
          .line(0, centerY + i, size.width, centerY + i)
          .stroke({ color: lineColor, width: lineWidth });
        group
          .line(0, centerY - i, size.width, centerY - i)
          .stroke({ color: lineColor, width: lineWidth });
      }
      for (let i = gap; i < centerX; i += gap) {
        group
          .line(centerX + i, 0, centerX + i, size.height)
          .stroke({ color: lineColor, width: lineWidth });
        group
          .line(centerX - i, 0, centerX - i, size.height)
          .stroke({ color: lineColor, width: lineWidth });
      }
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
        <div className="flex flex-col gap-1 p-4 pr-0 w-1/2">
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
        <div className="grow flex flex-col gap-1 p-4 pl-0 w-1/2">
          <label htmlFor="position">Position</label>
          <Dropdown
            value={position.id}
            onChange={(e) =>
              setPosition(positions.find((p) => p.id === e.target.value))
            }
            options={positions}
          />
        </div>
      </div>
      {position.id === "center" && (
        <div className="flex flex-col gap-1 p-4">
          <label htmlFor="center line width">Center line widths</label>
          <input
            type="number"
            value={centerLineWidth}
            min={1}
            max={size.height / 2}
            onChange={(e) => setCenterLineWidth(parseInt(e.target.value))}
          />
        </div>
      )}
    </div>
  );
}
