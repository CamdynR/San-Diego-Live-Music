import { CacheType } from '../../utilities/retriever.ts';
import { useState } from 'react';

function TableFilters({ shows }: { shows: CacheType }) {
  const [venue, setVenue] = useState('all');

  return (
    <>
      <form>
        <label>
          Venue:
          <select onChange={(e) => setVenue(e.target.value)}>
            <option value="all">All</option>
            {Object.keys(shows).map((venue) => (
              <option value={venue}>{venue}</option>
            ))}
          </select>
        </label>
      </form>
    </>
  );
}

export default TableFilters;
