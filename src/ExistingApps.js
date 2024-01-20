import React from 'react';
import AppList from './AppList';

function ExistingApps({ apps }) {
  const totalCost = apps?.reduce((total, app) => total + (app.totalCost || 0), 0) || 0;

  return (
    <div>
      <h2>Your Apps</h2>
      {apps && apps.length > 0 ? (
        <>
          <AppList apps={apps} />
          <p>Total Cost: ${totalCost}</p>
        </>
      ) : (
        <p>No apps available.</p>
      )}
    </div>
  );
}

export default ExistingApps;
