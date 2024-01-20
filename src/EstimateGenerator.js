import React, { useState, useEffect } from 'react';
import {
    Button, Box, Typography, IconButton, FormControl, InputLabel, Select, MenuItem, Slider, TextField
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const EstimateGenerator = (props) => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [serviceNames, setServiceNames] = useState([]);
    const [selectedServiceName, setSelectedServiceName] = useState('');
    const [serviceOfferings, setServiceOfferings] = useState([]);
    const [offeringInputs, setOfferingInputs] = useState({});
    const [totalCost, setTotalCost] = useState(0);
    const [numInstances, setNumInstances] = useState(1);
    const [estimateCounter, setEstimateCounter] = useState(1);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/rate_card')
            .then((response) => response.json())
            .then((data) => {
                const uniqueCategories = Array.from(new Set(data.map((item) => item.service_category)));
                setCategories(uniqueCategories);
                setSelectedCategory(uniqueCategories[0] || '');
            })
            .catch((error) => console.error('Error fetching categories:', error));
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            fetch('http://127.0.0.1:5000/rate_card')
                .then((response) => response.json())
                .then((data) => {
                    const servicesInCategory = Array.from(new Set(data
                        .filter((item) => item.service_category === selectedCategory)
                        .map((item) => item.service_name)));
                    setServiceNames(servicesInCategory);
                    setSelectedServiceName(servicesInCategory[0] || '');
                })
                .catch((error) => console.error('Error fetching service names:', error));
        }
    }, [selectedCategory]);

    useEffect(() => {
        if (selectedServiceName) {
            fetch('http://127.0.0.1:5000/rate_card')
                .then((response) => response.json())
                .then((data) => {
                    const offerings = data
                        .filter((item) => item.service_name === selectedServiceName)
                        .map((item) => ({ offering: item.service_offering, unit: item.offering_unit, unit_price: item.unit_price }));
                    setServiceOfferings(offerings);
                    let inputs = {};
                    offerings.forEach(offering => {
                        inputs[offering.offering] = 0; // Default value
                    });
                    setOfferingInputs(inputs);
                })
                .catch((error) => console.error('Error fetching service offerings:', error));
        }
    }, [selectedServiceName]);

    const handleSliderChange = (offering, value) => {
        console.log('handleSliderChange called with offering:', offering, 'value:', value);
        setOfferingInputs(prev => {
            console.log('prev offeringInputs:', prev);
            const newInputs = { ...prev, [offering]: value };
            console.log('newInputs:', newInputs);
            const newTotalCost = serviceOfferings.reduce((total, offering) => total + (newInputs[offering.offering] || 0) * offering.unit_price, 0);
            console.log('newTotalCost:', newTotalCost);
            setTotalCost(newTotalCost * numInstances);
            console.log('Current estimates:', props.estimates);
            return newInputs;
        });
    };

    const scrollContainerStyle = {
        display: 'flex',
        overflowX: 'auto',
        gap: '20px',
        padding: '20px',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
    };

    const scroll = (scrollOffset) => {
        document.getElementById('scrollable-container').scrollLeft += scrollOffset;
    };


    const handleAddEstimate = () => {
        console.log('handleAddEstimate triggered with estimateCounter:', estimateCounter, 'totalCost:', totalCost);
        props.onAddEstimate(estimateCounter, totalCost);
        setEstimateCounter(prev => prev + 1);

    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => scroll(-100)}>
                    <ArrowBackIosNewIcon />
                </IconButton>
                <Box id="scrollable-container" sx={scrollContainerStyle}>
                    {categories.map((category, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                cursor: 'pointer',
                                borderBottom: selectedCategory === category ? '2px solid red' : ''
                            }}
                            onClick={() => setSelectedCategory(category)}
                        >
                            <Typography variant="caption">{category.toUpperCase()}</Typography>
                        </Box>
                    ))}
                </Box>
                <IconButton onClick={() => scroll(100)}>
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>

            <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="service-name-select-label">Service Name</InputLabel>
                <Select
                    labelId="service-name-select-label"
                    value={selectedServiceName}
                    label="Service Name"
                    onChange={(e) => setSelectedServiceName(e.target.value)}
                >
                    {serviceNames.map((serviceName, index) => (
                        <MenuItem key={index} value={serviceName}>
                            {serviceName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Box sx={{ my: 2, width: '100%' }}>
                {selectedCategory === 'compute' && (
                    <TextField
                        label="Number of Instances"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        value={numInstances}
                        onChange={(e) => setNumInstances(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                )}
                {serviceOfferings.map((offering, index) => (
                    <Box key={index} sx={{ my: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography gutterBottom>{typeof offering === 'string' ? offering : ''}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Slider
                                value={typeof offeringInputs[offering.offering] === 'number' ? offeringInputs[offering.offering] : 0}
                                onChange={(e, value) => handleSliderChange(offering.offering, value)}
                                aria-labelledby="input-slider"
                                min={0}
                                max={100}
                                step={1}
                                sx={{ flexGrow: 1, mx: 2 }}
                            />
                            <Typography variant="caption" sx={{ ml: 2, width: '125px' }}>{typeof offering.unit === 'string' ? offering.unit : ''}</Typography>
                        </Box>
                    </Box>
                ))}
            </Box>

            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'left', width: '100%', mt: 2 }}>
                Estimated Cost: ${(totalCost * numInstances).toFixed(2)}
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={handleAddEstimate}
                sx={{ mt: 2 }}
            >
                + Add to Estimates
            </Button>
        </Box>
    );
};

export default EstimateGenerator;
