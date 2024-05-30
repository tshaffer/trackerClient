import * as React from 'react';
import ReportGrid from './ReportGrid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TrackerDispatch } from '../models';

const rows = [
  {
    id: '1',
    categoryName: 'Groceries',
    transactions: [
      {
        id: '10',
        description: 'Safeway',
        date: '2021-10-01',
        amount: 100,
      },
      {
        id: '11',
        description: 'Walmart',
        date: '2021-10-02',
        amount: 200,
      }
    ],
    totalAmount: 300,
    transactionCount: 2,
    percentage: 50,
  },
  {
    id: '2',
    categoryName: 'Travel',
    transactions: [
      {
        id: '12',
        description: 'Hawaii',
        date: '2021-02-01',
        amount: 22,
      },
      {
        id: '13',
        description: 'Sedona',
        date: '2023-02-01',
        amount: 66,
      },
      {
        id: '14',
        description: 'Belize',
        date: '2021-03-02',
        amount: 33,
      }
    ],
    totalAmount: 121,
    transactionCount: 3,
    percentage: 60,
  }
]

const Report = () => {
  return (
    <ReportGrid rows={rows} />
  );
};

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Report);
