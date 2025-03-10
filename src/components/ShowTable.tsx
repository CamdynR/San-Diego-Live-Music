import { CacheType } from '../../utilities/retriever.ts';

function ShowTable({ shows }: { shows: CacheType }) {
  return (
    <>
      <table>
        <tr>
          <th>Venue</th>
          <th>Ages</th>
          <th>Genre</th>
          <th>Band(s)</th>
          <th>Date</th>
          <th>Door Time</th>
          <th>Show Time</th>
          <th>Price (Inc. fees)</th>
          <th>Link</th>
        </tr>
        {Object.entries(shows).map(([venue, cache]) => {
          return cache.shows.map((show) => (
            <tr>
              <td>{venue}</td>
              <td>{show.ages}</td>
              <td>{show.genre}</td>
              <td>
                {show.bands.map((band, index) => (
                  <>
                    <a
                      href={`https://open.spotify.com/search/${encodeURIComponent(
                        band
                      )}/artists`}
                      target="_blank"
                      title="Search Spotify"
                    >
                      {band}
                    </a>
                    {index < show.bands.length - 1 && ', '}
                  </>
                ))}
              </td>
              <td>
                {new Date(show.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </td>
              <td>{show.doorTime}</td>
              <td>{show.showTime}</td>
              <td>
                {Array.isArray(show.price)
                  ? `$${show.price[1]}`
                  : `$${show.price}`}
              </td>
              <td>
                <a href={show.url} target="_blank">
                  Tickets
                </a>
              </td>
            </tr>
          ));
        })}
      </table>
    </>
  );
}

export default ShowTable;
