const Pagination = ({
  page,
  count,
  onChange,
}: {
  page: number;
  count: number;
  onChange: (page: number) => void;
}) => {
  const handleClicked = (page: number) => {
    onChange(page);
  };

  return (
    <div className="flex items-center space-x-16 justify-end">
      <p className="font-serif">
        Current page: <span className="font-mono">{page}</span>
      </p>
      <p className="font-serif">
        Total pages: <span className="font-mono">{count}</span>
      </p>
      <div className="join grid grid-cols-2">
        <button
          className="join-item btn btn-outline"
          disabled={page == 1}
          onClick={() => handleClicked(page - 1)}
        >
          Previous page
        </button>
        <button
          className="join-item btn btn-outline"
          disabled={page == count}
          onClick={() => handleClicked(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
