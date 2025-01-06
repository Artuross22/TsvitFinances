"use client";

import { useEffect, useState } from "react";
import { editTargetGet, editTargetPost } from "@/utils/asset";

export interface Notes {}

interface Props {
  params: {
    publicId: string;
    name: string;
  };
}

export default function EditTarget({ params }: Props) {
  const [notes, setNotes] = useState<Notes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<{
    type: "error" | "success" | null;
    message: string;
  }>({ type: null, message: "" });

  useEffect(() => {
    const fetchTarget = async () => {
      try {
        const data = await editTargetGet(params.publicId, params.name);
        setNotes(data);
      } catch {
        setStatus({ type: "error", message: "Failed to load target" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTarget();
  }, [params.publicId, params.name]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <></>;
}
