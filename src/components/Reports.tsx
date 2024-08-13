import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Tabs, Tab } from '@mui/material';

const Reports: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(location.pathname.includes('fixed-expenses') ? 'fixed-expenses' : 'spending');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
    navigate(newValue);
  };

  return (
    <div>
      <Tabs value={selectedTab} onChange={handleChange}>
        <Tab label="Spending" value="spending" />
        <Tab label="Fixed Expenses" value="fixed-expenses" />
      </Tabs>
      <Outlet />
    </div>
  );
};

export default Reports;