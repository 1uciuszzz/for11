import { ChangeEventHandler, HTMLInputTypeAttribute } from "react";
import Infomation from "./infomation";

interface EditableInfoProps {
  editable: boolean;
  type: HTMLInputTypeAttribute;
  label: string;
  value: string | number | undefined | null;
  onChange: ChangeEventHandler<HTMLInputElement> | undefined;
}

const EditableInfo = ({
  editable,
  type,
  onChange,
  label,
  value,
}: EditableInfoProps) => {
  return (
    <>
      {editable ? (
        <label className="form-control w-64">
          <div className="label">
            <span className="label-text">{label}</span>
          </div>
          <input
            placeholder={label}
            className="input bg-transparent input-bordered"
            type={type}
            value={value || ""}
            onChange={onChange}
          />
        </label>
      ) : (
        <Infomation
          label={label}
          value={
            type == "date" ? value && new Date(value).toDateString() : value
          }
        />
      )}
    </>
  );
};

export default EditableInfo;
