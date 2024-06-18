import React, { useState } from 'react';
import Sidebar from './Sidebar';
import CategoriesContent from './CategoriesContent';
import ReportsContent from './ReportsContent';
import StatementsContent from './StatementsContent';
import { Box, Typography } from '@mui/material';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadCategories, loadCategoryKeywords, loadStatements } from '../controllers';
import { TrackerDispatch, setAppInitialized } from '../models';
import { getAppInitialized } from '../selectors';
import { SidebarMenuButton } from '../types';
import CategoriesTable from './CategoriesTable';
import CategoryKeywordsTable from './CategoryKeywordsTable';

export interface AppProps {
  appInitialized: boolean;
  onLoadCategories: () => any;
  onLoadCategoryKeywords: () => any;
  onLoadStatements: () => any;
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
          return props.onLoadStatements();
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
      return <StatementsContent activeTab={0} />;
    } else if (selectedMainButton === SidebarMenuButton.Aliases) {
      return <CategoryKeywordsTable />;
    } else if (selectedMainButton === SidebarMenuButton.Categories) {
      return <CategoriesTable />;
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
    onLoadStatements: loadStatements
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
