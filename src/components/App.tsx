import React, { useState } from 'react';
import Sidebar from './Sidebar';
import CategoriesContent from './CategoriesContent';
import ReportsContent from './ReportsContent';
import { Box, Typography } from '@mui/material';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadCategories, loadCategoryKeywords } from '../controllers';
import { TrackerDispatch, setAppInitialized } from '../models';
import { getAppInitialized } from '../selectors';

export interface AppProps {
  appInitialized: boolean;
  onLoadCategories: () => any;
  onLoadCategoryKeywords: () => any;
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
          console.log('invoke onSetAppInitialized');
          return props.onSetAppInitialized();
        })
    }
  }, [props.appInitialized]);

  const [selectedMainButton, setSelectedMainButton] = useState<string | null>('Reports');
  const [selectedSubButton, setSelectedSubButton] = useState<string | null>('Expenses');

  const handleButtonClick = (label: string, subLabel?: string) => {
    setSelectedMainButton(label);
    setSelectedSubButton(subLabel || 'List');
  };

  const renderContent = () => {
    if (selectedMainButton === 'Categories') {
      let activeTab = 0;
      if (selectedSubButton === 'List') activeTab = 0;
      else if (selectedSubButton === 'Add') activeTab = 1;
      else if (selectedSubButton === 'Edit') activeTab = 2;

      return <CategoriesContent activeTab={activeTab} />;
    } else if (selectedMainButton === 'Reports') {
      let activeTab = 0;
      if (selectedSubButton === 'Summary') activeTab = 0;
      else if (selectedSubButton === 'Detailed') activeTab = 1;

      return <ReportsContent activeTab={activeTab} />;
    }
    return <Typography variant="h4">Welcome</Typography>;
  };

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
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
