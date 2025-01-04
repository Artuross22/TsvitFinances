// "use client";

// export interface AddPositionEntryNotesProps {
//     assetId: string;
//     note: string;
// }

// interface AssetProps {
//     params: { id: string; name: string };
// }

// const AddPositionEntryNotes: React.FC<AssetProps> = ({ params }) => {
//     const [note, setNote] = useState("");
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [message, setMessage] = useState({ type: "", text: "" });

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!note.trim()) {
//             setMessage({ type: "error", text: "Please enter a note" });
//             return;
//         }

//         try {
//             setIsSubmitting(true);
//             const noteData: AddPositionEntryNotesProps = {
//                 assetId: params.id,
//                 note: note.trim()
//             };

//             await addNote(noteData);

//             setMessage({ type: "success", text: "Note added successfully" });
//             setNote("");
//         } catch (error) {
//             setMessage({
//                 type: "error",
//                 text: "Failed to add note. Please try again."
//             });
//         } finally {
//             setIsSubmitting(false);
//             setTimeout(() => setMessage({ type: "", text: "" }), 3000);
//         }
//     };

//     const handleClear = () => {
//         setNote("");
//         setMessage({ type: "", text: "" });
//     };

//     return (
//         <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
//             <div className="mb-6">
//                 <h2 className="text-2xl font-semibold">
//                     Add Note for {params.name}
//                 </h2>
//             </div>

//             <form onSubmit={handleSubmit}>
//                 <div className="mb-4">
//                     <textarea
//                         value={note}
//                         onChange={(e) => setNote(e.target.value)}
//                         placeholder="Enter your note here..."
//                         className="w-full h-32 p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         disabled={isSubmitting}
//                     />
//                 </div>

//                 {message.text && (
//                     <div className={`mb-4 p-3 rounded ${
//                         message.type === 'error'
//                             ? 'bg-red-100 text-red-700'
//                             : 'bg-green-100 text-green-700'
//                     }`}>
//                         {message.text}
//                     </div>
//                 )}

//                 <div className="flex justify-end gap-3">
//                     <button
//                         type="button"
//                         onClick={handleClear}
//                         disabled={isSubmitting || !note}
//                         className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                         Clear
//                     </button>
//                     <button
//                         type="submit"
//                         disabled={isSubmitting || !note.trim()}
//                         className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                         {isSubmitting ? "Adding..." : "Add Note"}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default AddPositionEntryNotes;
