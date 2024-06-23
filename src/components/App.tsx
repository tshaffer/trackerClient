import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Box, Typography } from '@mui/material';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { SidebarMenuButton } from '../types';
import { loadCategories, loadCategoryKeywords, loadCheckingAccountStatements, loadCreditCardStatements, loadMinMaxTransactionDates } from '../controllers';
import { TrackerDispatch, setAppInitialized } from '../models';
import { getAppInitialized } from '../selectors';

import CategoryKeywordsTable from './CategoryKeywordsTable';
import CategoriesContent from './CategoriesContent';
import ReportsContent from './ReportsContent';
import StatementsContent from './StatementsContent';

export interface AppProps {
  appInitialized: boolean;
  onLoadCategories: () => any;
  onLoadCategoryKeywords: () => any;
  onLoadCreditCardStatements: () => any;
  onLoadCheckingAccountStatements: () => any;
  onLoadMinMaxTransactionDates: () => any;
  onSetAppInitialized: () => any;
}

const App = (props: AppProps) => {

  React.useEffect(() => {
    if (!props.appInitialized) {
      props.onLoadCategories()
        .then(() => {
          return props.onLoadCategoryKeywords();
        })
        .then(() => {
          return props.onLoadCreditCardStatements();
        })
        .then(() => {
          return props.onLoadCheckingAccountStatements();
        })
        .then(() => {
          return props.onLoadMinMaxTransactionDates();
        })
        .then(() => {
          console.log('invoke onSetAppInitialized');
          return props.onSetAppInitialized();
        })
    }
  }, [props.appInitialized]);

  const [selectedMainButton, setSelectedMainButton] = useState<SidebarMenuButton>(SidebarMenuButton.Reports);
  const [selectedSubButton, setSelectedSubButton] = useState<string | null>('Spending');

  const handleButtonClick = (label: string, subLabel?: string) => {
    setSelectedMainButton(label as SidebarMenuButton);
    setSelectedSubButton(subLabel || 'List');
  };

  const renderContent = () => {
    if (selectedMainButton === SidebarMenuButton.Reports) {
      let activeTab = 0;
      if (selectedSubButton === 'Spending') activeTab = 0;
      else if (selectedSubButton === 'Unidentified Transactions') activeTab = 1;

      return <ReportsContent activeTab={activeTab} />;
    }
    else if (selectedMainButton === SidebarMenuButton.Statements) {
      let activeTab = 0;
      if (selectedSubButton === 'Credit Card') activeTab = 0;
      else if (selectedSubButton === 'Checking Account') activeTab = 1;

      return <StatementsContent activeTab={activeTab} />;
    } else if (selectedMainButton === SidebarMenuButton.Aliases) {
      return <CategoryKeywordsTable />;
    } else if (selectedMainButton === SidebarMenuButton.Categories) {
      return <CategoriesContent />;
    } else {
      return <Typography variant="h4">Welcome</Typography>;
    };
  }

  if (!props.appInitialized) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar onButtonClick={handleButtonClick} />
      <Box sx={{ flexGrow: 1, padding: '20px' }}>
        {renderContent()}
      </Box>
    </Box>
  );
};

function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
    onSetAppInitialized: setAppInitialized,
    onLoadCategories: loadCategories,
    onLoadCategoryKeywords: loadCategoryKeywords,
    onLoadCreditCardStatements: loadCreditCardStatements,
    onLoadCheckingAccountStatements: loadCheckingAccountStatements,
    onLoadMinMaxTransactionDates: loadMinMaxTransactionDates
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
