export default function Checkbox({ checked, label, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        className="form-checkbox"
        checked={checked}
        onChange={onChange}
      />
      <span>{label}</span>
    </div>
  );
}
