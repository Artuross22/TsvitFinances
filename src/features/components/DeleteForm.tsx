"use client";
import { deleteAsset } from "@/utils/asset";
import { useFormStatus } from "react-dom";

import { Spinner } from "@/shared/ui/spinner";

interface DeleteFormProps {
  root: string;
  id: string;
  buttonName: string;
  color: string;
}

const SubmitButton = ({
  buttonName,
  color,
}: {
  buttonName: string;
  color: string;
}) => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={`px-4 py-0.4 text-white bg-${color}-500 rounded hover:bg-${color}-600`}
      disabled={pending}
    >
      {pending ? <Spinner /> : buttonName}
    </button>
  );
};

const DeleteForm = ({ root, id, buttonName, color }: DeleteFormProps) => {
  return (
    <form action={() => deleteAsset(root, id)}>
      <input type="hidden" name="id" value={id} />
      <SubmitButton buttonName={buttonName} color={color} />
    </form>
  );
};

export default DeleteForm;
