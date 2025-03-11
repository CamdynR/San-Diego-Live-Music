// VenueFilter.tsx

// Types
import { CacheType } from '../../utilities/retriever.ts';
import { VenueName } from '../../utilities/Venue.ts';

function VenueFilter({
  shows,
  venuesState
}: {
  shows: CacheType;
  venuesState: {
    venues: VenueName[];
    setVenues: (venues: VenueName[]) => void;
  };
}) {
  const handleVenueFilterChange = (venue: VenueName) => {
    if (venuesState.venues.includes(venue)) {
      venuesState.setVenues(venuesState.venues.filter((v) => v !== venue));
    } else {
      venuesState.setVenues([...venuesState.venues, venue]);
    }
  };

  return (
    <>
      {Object.keys(shows).map((venue) => {
        return (
          <label key={venue}>
            <input
              type="checkbox"
              checked={venuesState.venues.includes(venue as VenueName)}
              onChange={() => handleVenueFilterChange(venue as VenueName)}
            />
            {venue}
          </label>
        );
      })}
    </>
  );
}

export default VenueFilter;
