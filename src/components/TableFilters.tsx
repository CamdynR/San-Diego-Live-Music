// TableFilters.tsx

// Components
import VenueFilter from './VenueFilter.tsx';
import PriceFilter from './PriceFilter.tsx';
import DateFilter from './DateFilter.tsx';
// Types
import { CacheType } from '../../utilities/retriever.ts';
import { VenueName } from '../../utilities/Venue.ts';

function TableFilters({
  shows,
  venuesState,
  priceState,
  dateState
}: {
  shows: CacheType;
  venuesState: {
    venues: VenueName[];
    setVenues: (venues: VenueName[]) => void;
  };
  priceState: {
    price: [number, number];
    setPrice: (price: [number, number]) => void;
  };
  dateState: {
    dateRange: [Date?, Date?];
    setDateRange: (range: [Date?, Date?]) => void;
  };
}) {
  return (
    <>
      <form>
        <p>Filters</p>
        <details>
          <summary>Venues</summary>
          <VenueFilter shows={shows} venuesState={venuesState}></VenueFilter>
        </details>
        <details>
          <summary>Price</summary>
          <PriceFilter priceState={priceState}></PriceFilter>
        </details>
        <details>
          <summary>Dates</summary>
          <DateFilter dateState={dateState}></DateFilter>
        </details>
      </form>
    </>
  );
}

export default TableFilters;
