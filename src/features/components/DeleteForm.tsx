"use client";
import { deleteAsset } from "@/utils/asset";
import { useFormStatus } from "react-dom";

import { Spinner } from "@/shared/ui/spinner";

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button 
    type="submit" 
    className="px-4 py-0.4 text-white bg-red-500 rounded hover:bg-red-600" 
    disabled={pending}
  >
    {pending ? <Spinner /> : "Delete"}
  </button>
  );
};
const DeleteForm = ({ id }: { id: string }) => {
    return (   
        <form action={() => deleteAsset(id)}>
          <input type="hidden" name="id" value={id} />
          <SubmitButton />
        </form>
    );
};

export default DeleteForm;
