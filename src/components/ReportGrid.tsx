/*
  DetailPanelContent is a function that takes a single parameter, which is an object containing a row property.
  The type of the row property is specified as Customer.
    That is, the row property is the type of each element in the rows array.
    and it appears that the row property contains ALL the information about a customer. That is, it contains the information displayed in the Master UI, as well as the Detail UI.
  Inside the function, the row property is renamed to rowProp for usage.
  This ensures that when you use rowProp within the function, it adheres to the Customer type structure.
*/
/*
  Tracker analogy:
  A row is of type CategoryData and contains
    raw data  
      categoryName
      transactions
    calculated data
      totalAmount
      transactionCount
      percentage
*/
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { DataGridPro, GridColDef } from '@mui/x-data-grid-pro';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TrackerDispatch } from '../models';
import { CategoryRow } from '../types';

function DetailPanelContent({ row: rowProp }: { row: CategoryRow }) {
  return (
    <Stack
      sx={{ py: 2, height: '100%', boxSizing: 'border-box' }}
      direction="column"
    >
      <Paper sx={{ flex: 1, mx: 'auto', width: '90%', p: 1 }}>
        <Stack direction="column" spacing={1} sx={{ height: 1 }}>
          <Typography variant="h6">{rowProp.categoryName}</Typography>
          <DataGridPro
            density="compact"
            columns={[
              { field: 'description', headerName: 'Description', flex: 1 },
              { field: 'date', headerName: 'Date', flex: 1 },
              {
                field: 'amount',
                headerName: 'Amount',
                align: 'center',
                type: 'number',
              },
            ]}
            rows={rowProp.transactions}
            sx={{ flex: 1 }}
            hideFooter
          />
        </Stack>
      </Paper>
    </Stack>
  );
}

const columns: GridColDef<any>[] = [
  { field: 'categoryName', headerName: 'Category' },
  { field: 'transactionCount', headerName: 'Transaction Count' },
  {
    field: 'total',
    type: 'number',
    headerName: 'Total Amount',
    valueGetter: (value, row) => {
      const subtotal = row.transactions.reduce(
        (acc: number, transaction: any) => acc + transaction.amount,
        0,
      );
      return subtotal;
    },
  },
  {
    field: 'percentageOfTotal',
    type: 'number',
    headerName: 'Percentage of Total',
    valueGetter: (value, row) => {
      const subtotal = row.transactions.reduce(
        (acc: number, transaction: any) => acc + transaction.amount,
        0,
      );
      return subtotal;
    },
  }
];

export interface ReportGridProps {
  rows: any[],
}

const ReportGrid = (props: ReportGridProps) => {

  const getDetailPanelHeight = React.useCallback(() => 400, []);

  const getDetailPanelContent = (rowData: any) => {
    const row = rowData.row;
    console.log('getDetailedPanelContent row: ', row);
    return (
      <DetailPanelContent row={row} />
    );
  }

  if (props.rows.length === 0) {
    return (
      <Typography variant="h6">
        No data to display
      </Typography>
    );
  }
  
  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <DataGridPro
        columns={columns}
        rows={props.rows}
        getDetailPanelHeight={getDetailPanelHeight}
        getDetailPanelContent={getDetailPanelContent}
      />
    </Box>
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

export default connect(mapStateToProps, mapDispatchToProps)(ReportGrid);
