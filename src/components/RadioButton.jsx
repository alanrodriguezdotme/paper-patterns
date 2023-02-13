export default function RadioButton({ checked, label, name, value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="radio"
        name={name}
        value={value}
        onChange={onChange}
        checked={checked}
      />
      <span>{label}</span>
    </div>
  );
}
