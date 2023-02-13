export default function Button({ children, onClick }) {
  return (
    <button
      className="border border-black dark:border-zinc-500 hover:bg-zinc-400 dark:hover:bg-zinc-700 rounded-md py-3 px-4 text-sm font-medium uppercase"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
