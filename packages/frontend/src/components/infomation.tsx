interface InfomationProps {
  label: string;
  value: string | number | undefined | null;
}

const Infomation = ({ label, value }: InfomationProps) => {
  return (
    <div>
      <p className="font-bold line-clamp-1">{label}</p>
      <p
        className={`line-clamp-1 ${
          value ? "font-serif" : "text-gray-500 italic"
        }`}
      >
        {value || "Null"}
      </p>
    </div>
  );
};

export default Infomation;
