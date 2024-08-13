// import React, { useState } from 'react';
// import SideBar from './SideBar';
// import { Box, Typography } from '@mui/material';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';

// import { SidebarMenuButton } from '../types';
// import { TrackerDispatch } from '../models';
// import { getAppInitialized } from '../selectors';

// import CategoryAssignmentRulesTable from './CategoryAssignmentRulesTable';
// import CategoriesContent from './CategoriesContent';
// import ReportsContent from './ReportsContent';
// import StatementsContent from './StatementsContent';

// export interface MainContentProps {
//   appInitialized: boolean;
// }

// const MainContent = (props: MainContentProps) => {

//   const [selectedMainButton, setSelectedMainButton] = useState<SidebarMenuButton>(SidebarMenuButton.Reports);
//   const [selectedSubButton, setSelectedSubButton] = useState<string | null>('Spending');

//   const handleButtonClick = (label: string, subLabel?: string) => {
//     setSelectedMainButton(label as SidebarMenuButton);
//     setSelectedSubButton(subLabel || 'List');
//   };

//   const renderContent = () => {
//     if (selectedMainButton === SidebarMenuButton.Reports) {
//       let activeTab = 0;
//       if (selectedSubButton === 'Spending') activeTab = 0;
//       else if (selectedSubButton === 'Unidentified Transactions') activeTab = 1;
//       else if (selectedSubButton === 'Fixed Expenses') activeTab = 2;
//       return <ReportsContent activeTab={activeTab} />;
//     }
//     else if (selectedMainButton === SidebarMenuButton.Statements) {
//       let activeTab = 0;
//       if (selectedSubButton === 'Credit Card') activeTab = 0;
//       else if (selectedSubButton === 'Checking Account') activeTab = 1;
//       return <StatementsContent activeTab={activeTab} />;
//     } else if (selectedMainButton === SidebarMenuButton.CategoryAssignmentRules) {
//       return <CategoryAssignmentRulesTable />;
//     } else if (selectedMainButton === SidebarMenuButton.Categories) {
//       return <CategoriesContent />;
//     } else {
//       return <Typography variant="h4">Welcome</Typography>;
//     };
//   }

//   if (!props.appInitialized) {
//     return null;
//   }

//   return (
//     <Box sx={{ display: 'flex' }}>
//       <SideBar onButtonClick={handleButtonClick} />
//       <Box sx={{ flexGrow: 1, padding: '20px' }}>
//         {renderContent()}
//       </Box>
//     </Box>
//   );
// };

// function mapStateToProps(state: any) {
//   return {
//     appInitialized: getAppInitialized(state),
//   };
// }

// const mapDispatchToProps = (dispatch: TrackerDispatch) => {
//   return bindActionCreators({
//   }, dispatch);
// };

// export default connect(mapStateToProps, mapDispatchToProps)(MainContent);

// MainContent.tsx

import React from 'react';
import SideBar from './SideBar';

const MainContent: React.FC = () => {
  const handleButtonClick = (label: string, subLabel?: string) => {
    // Handle the button click here, e.g., navigate to the appropriate section
    console.log(`Button clicked: ${label}`);
  };

  return (
    <div style={{ display: 'flex' }}>
      <SideBar/>
      <div style={{ flexGrow: 1, padding: '16px' }}>
        {/* The main content area */}
      </div>
    </div>
  );
};

export default MainContent;