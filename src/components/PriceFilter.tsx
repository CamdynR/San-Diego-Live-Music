// PriceFilter.tsx

function PriceFilter({
  priceState
}: {
  priceState: {
    price: [number, number];
    setPrice: (price: [number, number]) => void;
  };
}) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minValue = parseFloat(e.target.value) || 0;
    priceState.setPrice([minValue, priceState.price[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxValue = parseFloat(e.target.value) || Infinity;
    priceState.setPrice([priceState.price[0], maxValue]);
  };

  return (
    <>
      <label>
        Min:
        <input type="number" min="0" step="0.01" onChange={handleMinChange} />
      </label>
      <label>
        Max:
        <input type="number" min="0" step="0.01" onChange={handleMaxChange} />
      </label>
    </>
  );
}

export default PriceFilter;
