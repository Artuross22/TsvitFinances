import { useRouter } from "next/navigation";

const BackLink: React.FC = () => {
  const router = useRouter();

  return (
    <button onClick={() => router.back()} className="mr-auto text-green">
      Back
    </button>
  );
};

export default BackLink;
