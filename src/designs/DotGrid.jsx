import { useEffect, useState } from "react";
import Dropdown from "../components/Dropdown";
import { randomColor } from "../helpers";

const positions = [
  { name: "Top left", id: "top-left" },
  { name: "Center", id: "center" },
];

export default function DotGrid({ group, size, paperSize }) {
  const [gap, setGap] = useState(16);
  const [lineColor, setLineColor] = useState(randomColor);
  const [dotSize, setDotSize] = useState(3);
  const [position, setPosition] = useState("Top left");

  useEffect(() => {
    group && drawLines();
  }, [group, lineColor, gap, dotSize, size, position]);

  function drawLines() {
    let spaceBetween = dotSize / 2 + gap;
    group.clear();
    if (position.id === "top-left") {
      for (
        let y = spaceBetween;
        y < size.height - (gap - dotSize);
        y += spaceBetween
      ) {
        for (
          let x = spaceBetween;
          x < size.width - (gap - dotSize);
          x += spaceBetween
        ) {
          group.circle(dotSize).center(x, y).fill(lineColor);
        }
      }
    } else {
      let centerX = size.width / 2;
      let centerY = size.height / 2;
      group.circle(dotSize).center(centerX, centerY).fill(lineColor);

      for (let x = spaceBetween; x < centerX; x += spaceBetween) {
        group
          .circle(dotSize)
          .center(centerX + x, centerY)
          .fill(lineColor);
        group
          .circle(dotSize)
          .center(centerX - x, centerY)
          .fill(lineColor);
      }

      for (let y = spaceBetween; y < centerY; y += spaceBetween) {
        group
          .circle(dotSize)
          .center(centerX, centerY + y)
          .fill(lineColor);
        group
          .circle(dotSize)
          .center(centerX, centerY - y)
          .fill(lineColor);

        for (let x = spaceBetween; x < centerX; x += spaceBetween) {
          group
            .circle(dotSize)
            .center(centerX + x, centerY + y)
            .fill(lineColor);
          group
            .circle(dotSize)
            .center(centerX - x, centerY + y)
            .fill(lineColor);
          group
            .circle(dotSize)
            .center(centerX + x, centerY - y)
            .fill(lineColor);
          group
            .circle(dotSize)
            .center(centerX - x, centerY - y)
            .fill(lineColor);
        }
      }
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex gap-2 w-full">
        <div className="grow flex flex-col gap-1 p-4 pr-0 w-1/2">
          <label htmlFor="gap">Dot size</label>
          <input
            className="w-full"
            type="number"
            value={dotSize}
            step="any"
            min={1}
            max={paperSize.long / 4}
            onChange={(e) => setDotSize(parseInt(e.target.value))}
          />
        </div>
        <div className="flex flex-col gap-1 p-4 pl-0 w-1/2">
          <label htmlFor="color">Color</label>
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
    </div>
  );
}
