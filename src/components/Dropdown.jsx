export default function Dropdown({ options, value, onChange }) {
  return (
    <select
      className="border border-gray-300 bg-transparent rounded-md p-2"
      value={value}
      onChange={onChange}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
