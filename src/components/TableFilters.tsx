// TableFilters.tsx

// Components
import VenueFilters from './VenueFilters.tsx';
import PriceFilter from './PriceFilter.tsx';
// Types
import { CacheType } from '../../utilities/retriever.ts';
import { VenueName } from '../../utilities/Venue.ts';

function TableFilters({
  shows,
  venuesState,
  priceState
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
}) {
  return (
    <>
      <form>
        <p>Filters</p>
        <details>
          <summary>Venues</summary>
          <VenueFilters shows={shows} venuesState={venuesState}></VenueFilters>
        </details>
        <details>
          <summary>Price</summary>
          <PriceFilter priceState={priceState}></PriceFilter>
        </details>
      </form>
    </>
  );
}

export default TableFilters;
