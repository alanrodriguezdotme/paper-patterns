import { useEffect, useState } from "react";
import { randomColor } from "../helpers";

export default function Panels({ group, size, paperSize, margin }) {
  const [gap, setGap] = useState(12);
  const [lineColor, setLineColor] = useState(randomColor());
  const [lineWidth, setLineWidth] = useState(3);
  const [rowPanels, setRowPanels] = useState([2, 3, 2]);

  useEffect(() => {
    group && drawLines();
  }, [group, lineColor, gap, lineWidth, size, rowPanels, margin]);

  function drawLines() {
    group.clear();
    let m = Math.max(margin, gap);
    for (let r = 0; r < rowPanels.length; r++) {
      for (let p = 0; p < rowPanels[r]; p++) {
        let pw =
          (size.width - m * 2 - (rowPanels[r] - 1) * gap) / rowPanels[r] -
          lineWidth / rowPanels[r];
        let ph =
          (size.height - m * 2 - (rowPanels.length - 1) * gap) /
            rowPanels.length -
          lineWidth / rowPanels.length;
        group
          .rect(pw, ph)
          .fill("none")
          .stroke({ color: lineColor, width: lineWidth })
          .move(
            m + lineWidth / 2 + pw * p + gap * p,
            ph * r + m + lineWidth / 2 + gap * r
          );
      }
    }
  }

  function handleRowsChange(number) {
    if (number > 0 && number < 7) {
      let newRows = [];
      for (let i = 0; i < number; i++) {
        newRows.push(rowPanels[i] || 2);
      }
      setRowPanels(newRows);
    }
  }

  function handleRowPanelsChange(row, number) {
    if (number > 0 && number < 7) {
      let newRows = [...rowPanels];
      newRows[row] = number;
      setRowPanels(newRows);
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
      <div className="flex gap-2 w-full">
        <div className="flex flex-col gap-1 p-4 pr-0 w-1/2">
          <label htmlFor="gap">Gap</label>
          <input
            type="number"
            value={gap}
            min={0}
            max={size.height / 2}
            onChange={(e) => {
              setGap(parseInt(e.target.value));
            }}
          />
        </div>
        <div className="flex flex-col gap-1 p-4 pl-0 w-1/2">
          <label htmlFor="rows">Rows</label>
          <input
            type="number"
            value={rowPanels.length}
            min={1}
            max={6}
            onChange={(e) => {
              handleRowsChange(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="flex w-full flex-wrap">
        {rowPanels.map((row, i) => (
          <div
            className={`flex flex-col gap-1 w-1/2 p-4 ${
              i % 2 === 0 ? "pr-1" : "pl-1"
            }`}
            key={`panel-${i}`}
          >
            <label htmlFor="gap">{`Row ${i + 1} panels`}</label>
            <input
              type="number"
              value={row}
              step="any"
              min={1}
              max={6}
              onChange={(e) => handleRowPanelsChange(i, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
