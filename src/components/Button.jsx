import { getForegroundColor } from "../helpers";

export default function Button({ children, onClick, color, fullWidth }) {
  return (
    <button
      className={`bg-zinc-800 dark:bg-zinc-200 hover:bg-zinc-600 dark:hover:bg-zinc-400 py-3 px-4 text-sm font-medium uppercase text-white dark:text-zinc-900 ${
        fullWidth ? "w-full" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
