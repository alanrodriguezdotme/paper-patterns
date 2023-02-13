import { getForegroundColor } from "../helpers";

export default function Button({ children, onClick, lineColor }) {
  return (
    <button
      className=" hover:bg-zinc-400 dark:hover:bg-zinc-700 py-3 px-4 text-sm font-medium uppercase"
      style={{
        backgroundColor: lineColor,
        color: getForegroundColor(lineColor),
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
