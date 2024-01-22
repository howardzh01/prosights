const CompetitorTags = ({ label, onDelete }) => {
  return (
    <div className="flex items-center bg-gray-200 rounded-full pl-2 pr-1 py-1 m-1">
      <span className="text-sm font-medium mr-2">{label}</span>
      <button
        onClick={onDelete}
        className="bg-transparent hover:bg-gray-300 rounded-full p-1"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default CompetitorTags;
