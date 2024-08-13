import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Tabs, Tab } from '@mui/material';
// import CreditCardStatementsList from './CreditCardStatementsList';
// import CheckingAccountStatementsList from './CheckingAccountStatementsList';

const Statements: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(location.pathname.includes('checking-account') ? 'checking-account' : 'credit-card');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
    navigate(newValue);
  };

  return (
    <div>
      <Tabs value={selectedTab} onChange={handleChange}>
        <Tab label="Credit Card" value="credit-card" />
        <Tab label="Checking Account" value="checking-account" />
      </Tabs>
      <Outlet />
    </div>
  );
};

export default Statements;