export default function Dropdown({ options, value, onChange }) {
  return (
    <select className=" bg-transparent p-2" value={value} onChange={onChange}>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  );
}
