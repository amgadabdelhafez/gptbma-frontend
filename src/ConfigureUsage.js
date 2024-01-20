import React from 'react';

function ConfigureUsage({ usage, setUsage }) {
  return (
    <div>
      <label>
        CPU Usage
        <input
          type="range"
          min="0"
          max="1000"
          value={usage.cpu || 0}
          onChange={(e) => setUsage({ ...usage, cpu: parseFloat(e.target.value) })}
        />
      </label>
    </div>
  );
}

export default ConfigureUsage;
