import React, { useState, useEffect } from 'react';

function BillingData() {
  const [billingData, setBillingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/billing_data');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBillingData(data);
      } catch (error) {
        console.error('Fetch Error:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Billing Data</h1>
      {billingData.map((app) => (
        <div key={app.id}>
          <h2>{app.name}</h2>
          <p>Usage: {app.usage}</p>
        </div>
      ))}
    </div>
  );
}

export default BillingData;
