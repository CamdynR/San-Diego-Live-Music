// App.tsx

// Styles
import './App.css';
// React
import { useState } from 'react';
// Components
import TableFilters from './components/TableFilters.tsx';
import ShowTable from './components/ShowTable.tsx';
// Types
import { VenueName } from '../utilities/Venue.ts';
// Data
import shows from './data/shows.json' with { type: "json" };

function App() {
  // Default to all venues selected
  const [venues, setVenues] = useState<VenueName[]>(
    Object.keys(shows) as VenueName[]
  );

  // Default to all prices
  const [price, setPrice] = useState<[number, number]>([0, Infinity]);

  // Default to all dates
  const [dateRange, setDateRange] = useState<[Date?, Date?]>([undefined, undefined]);

  return (
    <>
      <TableFilters
        shows={shows}
        venuesState={{ venues, setVenues }}
        priceState={{ price, setPrice }}
        dateState={{ dateRange, setDateRange }}
      />
      <ShowTable shows={shows} filters={{ venues, price, dateRange }} />
    </>
  );
}

export default App;
