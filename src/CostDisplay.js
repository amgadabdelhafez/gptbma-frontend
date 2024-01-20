import React, { useEffect } from 'react';

function CostDisplay({ usage, setCost, cost, rateCard }) {
  useEffect(() => {
    const totalCost = Object.keys(usage).reduce((acc, key) => {
      return acc + (rateCard[key] || 0) * usage[key];
    }, 0);

    setCost(totalCost);
  }, [usage, setCost, rateCard]);

  return <div>Total Cost: ${cost}</div>;
}

export default CostDisplay;
