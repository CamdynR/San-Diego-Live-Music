// DateFilter.tsx

function DateFilter({
  dateState
}: {
  dateState: {
    dateRange: [Date?, Date?];
    setDateRange: (range: [Date?, Date?]) => void;
  };
}) {
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const startDate = e.target.value ? new Date(e.target.value) : undefined;
    dateState.setDateRange([startDate, dateState.dateRange[1]]);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const endDate = e.target.value ? new Date(e.target.value) : undefined;
    dateState.setDateRange([dateState.dateRange[0], endDate]);
  };

  return (
    <>
      <label>
        Start
        <input type="date" onChange={handleStartChange} />
      </label>
      <label>
        End
        <input type="date" onChange={handleEndChange} />
      </label>
    </>
  );
}

export default DateFilter;
