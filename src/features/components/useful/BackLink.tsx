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

   {/* <div className="flex bg-gray-200 items-center px-4 py-2 mt-2">
        <Link href={`/investing/ViewInvestmentIdea/${params.publicId}`} 
          className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft size={20} />
          <span className="ml-1">Back</span>
        </Link>
      </div> */}
