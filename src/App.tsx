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

  return (
    <>
      <TableFilters
        shows={shows}
        venuesState={{ venues, setVenues }}
        priceState={{ price, setPrice }}
      />
      <ShowTable shows={shows} filters={{ venues, price }} />
    </>
  );
}

export default App;
