import React, { useState } from 'react';
import PriceCalculator from './PriceCalculator';

function App() {
  const [estimates, setEstimates] = useState([]);

  return (
    <div>
      <h1>Pricing Calculator</h1>
      <PriceCalculator estimates={estimates} setEstimates={setEstimates} />
    </div>
  );
}

export default App;
