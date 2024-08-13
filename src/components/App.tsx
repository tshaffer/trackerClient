import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from 'react-router-dom';
import { connect, Provider } from 'react-redux';

import SideBar from './SideBar';
import CategoriesList from './CategoriesList';
// import CategoryAssignmentRulesT from './CategoryAssignmentRulesT';
import Statements from './Statements';
import CreditCardStatementDetails from './CreditCardStatementDetails';
// import CheckingAccountStatementDetails from './CheckingAccountStatementDetails';
import Reports from './Reports';
// import SpendingReport from './SpendingReport';
import FixedExpensesReport from './FixedExpensesReport';
import Layout from './Layout';

import { createStore, applyMiddleware, bindActionCreators } from 'redux';

import thunkMiddleware from 'redux-thunk';
import { rootReducer, TrackerDispatch } from '../models';


import { composeWithDevTools } from 'redux-devtools-extension';

export const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(thunkMiddleware)
  ));

// Define the Layout component that includes the sidebar
// const Layout = () => (
//   <div style={{ display: 'flex' }}>
//     <SideBar />
//     <div style={{ flexGrow: 1, padding: '16px' }}>
//       <Outlet />
//     </div>
//   </div>
// );

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'categories',
        element: <CategoriesList />,
      },
      // {
      //   path: 'category-assignment-rules',
      //   element: <CategoryAssignmentRulesT/>,
      // },
      {
        path: 'statements',
        element: <Statements />,
        children: [
          {
            path: 'credit-card/:id',
            element: <CreditCardStatementDetails />,
          },
          // {
          //   path: 'checking-account/:id',
          //   element: <CheckingAccountStatementDetails />,
          // },
        ],
      },
      {
        path: 'reports',
        element: <Reports />,
        children: [
          // {
          //   path: 'spending',
          //   element: <SpendingReport />,
          // },
          {
            path: 'fixed-expenses',
            element: <FixedExpensesReport />,
          },
        ],
      },
    ],
  },
]);

// export const App = () => (
//   <Provider store={store}>
//     <RouterProvider router={router} />
//   </Provider>
// );

export interface AppProps {
}

const App = (props: AppProps) => {
  return (
    // <div>
    //   <h1>App</h1>
    // </div>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

// const root = ReactDOM.createRoot(document.getElementById('root')!);
// root.render(<App />);
