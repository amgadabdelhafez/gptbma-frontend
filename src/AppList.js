import React from 'react';

function AppList({ apps, setSelectedApp }) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>App Name</th>
            <th>Total Cost</th>
          </tr>
        </thead>
        <tbody>
          {apps.map((app) => (
            <tr key={app.name} onClick={() => setSelectedApp(app)}>
              <td>{app.name}</td>
              <td>${app.totalCost || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AppList;
