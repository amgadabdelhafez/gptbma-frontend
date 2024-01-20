import React from 'react';

import EstimateGenerator from './EstimateGenerator';
import {
  Box, Typography, Paper, Divider
} from '@mui/material';

function PriceCalculator({ estimates, setEstimates }) {

  const addEstimate = (estimateCounter, estimateCost) => {
    console.log(`Adding estimate: ${estimateCounter}, ${estimateCost}`);
    const estimateName = 'estimate ' + estimateCounter + ':';
    setEstimates(prevEstimates => [...prevEstimates, { name: estimateName, cost: estimateCost }]);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Box sx={{ width: '70%', mr: 4 }}>
        <Typography variant="h6">
          Get started with your estimate
        </Typography>
        <Typography variant="subtitle1">
          Add and configure products to get a cost estimate to share with your team.
        </Typography>
        <EstimateGenerator onAddEstimate={addEstimate} estimates={estimates} />
      </Box>
      <Paper elevation={3} sx={{ width: '30%', padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          Estimate Details
        </Typography>

        {estimates.map((estimate, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography>{estimate.name}</Typography>
            <Typography>${estimate.cost.toFixed(2)}</Typography>
          </Box>
        ))}
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">{
            estimates.reduce((acc, estimate) => acc + estimate.cost, 0).toFixed(2)
          } / mo</Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default PriceCalculator;
