// Types
import React from 'react';
import { CacheType } from '../../utilities/retriever.ts';
import { VenueName } from '../../utilities/Venue.ts';

function ShowTable({
  shows,
  filters
}: {
  shows: CacheType;
  filters: {
    venues: VenueName[];
    price: [number, number];
    dateRange: [Date?, Date?];
  };
}) {
  return (
    <>
      <table>
        <thead>
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
        </thead>
        <tbody>
          {Object.entries(shows)
            // Filter Venues
            .filter(([venue]) => filters.venues.includes(venue as VenueName))
            .map(([venue, cache]) => {
              return (
                cache.shows
                  // Filter Prices
                  .filter((show) => {
                    let price: number;
                    if (Array.isArray(show.price)) price = show.price[1];
                    else price = show.price;

                    return (
                      price >= filters.price[0] && price <= filters.price[1]
                    );
                  })
                  // Filter Dates
                  .filter((show) => {
                    const range: number[] = filters.dateRange.map((date, i) => {
                      // If time is in use, get the value
                      if (date !== undefined) return date.getTime();
                      else if (i === 0) return 0; // min time
                      else return Infinity; // max time
                    });
                    return show.date >= range[0] && show.date <= range[1];
                  })
                  .map((show) => (
                    <tr key={show.url}>
                      <td>{venue}</td>
                      <td>{show.ages}</td>
                      <td>{show.genre}</td>
                      <td>
                        {show.bands.map((band, index) => (
                          <React.Fragment key={`${band}-${index}`}>
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
                          </React.Fragment>
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
                  ))
              );
            })}
        </tbody>
      </table>
    </>
  );
}

export default ShowTable;
