import './App.css';
import TableFilters from './components/TableFilters.tsx';
import ShowTable from './components/ShowTable.tsx';
import shows from './data/shows.json' with { type: "json" };

function App() {
  return (
    <>
      <TableFilters shows={shows} />
      <ShowTable shows={shows} />
    </>
  );
}

export default App;
