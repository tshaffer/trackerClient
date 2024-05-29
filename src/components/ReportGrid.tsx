/*
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { DataGridPro, DataGridProProps, GridColDef } from '@mui/x-data-grid-pro';
import {
  randomCreatedDate,
  randomPrice,
  randomCurrency,
  randomCountry,
  randomCity,
  randomEmail,
  randomInt,
  randomAddress,
  randomCommodity,
} from '@mui/x-data-grid-generator';
import { TrackerDispatch } from '../models';
import { getTransactionsByCategory } from '../selectors';
import { CreditCardTransactionEntity, StringToTransactionsLUT } from '../types';
import TransactionsReport from './TransactionsReport';
import { isEmpty } from 'lodash';

function DetailPanelContent({ row: rowProp }: { row: Customer }) {
  return (
    <Stack
      sx={{ py: 2, height: '100%', boxSizing: 'border-box' }}
      direction="column"
    >
      <Paper sx={{ flex: 1, mx: 'auto', width: '90%', p: 1 }}>
        <Stack direction="column" spacing={1} sx={{ height: 1 }}>
          <Typography variant="h6">{`Order #${rowProp.id}`}</Typography>
          <Grid container>
            <Grid item md={6}>
              <Typography variant="body2" color="textSecondary">
                Customer information
              </Typography>
              <Typography variant="body1">{rowProp.customer}</Typography>
              <Typography variant="body1">{rowProp.email}</Typography>
            </Grid>
            <Grid item md={6}>
              <Typography variant="body2" align="right" color="textSecondary">
                Shipping address
              </Typography>
              <Typography variant="body1" align="right">
                {rowProp.address}
              </Typography>
              <Typography
                variant="body1"
                align="right"
              >{`${rowProp.city}, ${rowProp.country.label}`}</Typography>
            </Grid>
          </Grid>
          <DataGridPro
            density="compact"
            columns={[
              { field: 'name', headerName: 'Product', flex: 1 },
              {
                field: 'quantity',
                headerName: 'Quantity',
                align: 'center',
                type: 'number',
              },
              { field: 'unitPrice', headerName: 'Unit Price', type: 'number' },
              {
                field: 'total',
                headerName: 'Total',
                type: 'number',
                valueGetter: (value, row) => row.quantity * row.unitPrice,
              },
            ]}
            rows={rowProp.products}
            sx={{ flex: 1 }}
            hideFooter
          />
        </Stack>
      </Paper>
    </Stack>
  );
}

const columns: GridColDef<(typeof rows)[number]>[] = [
  { field: 'category', headerName: 'Category' },
  { field: 'transactionCount', headerName: 'Transaction Count' },
  {
    field: 'percentage',
    type: 'number',
    headerName: 'Percentage',
    valueGetter: (value, row) => {
      const subtotal = row.products.reduce(
        (acc: number, product: any) => product.unitPrice * product.quantity,
        0,
      );
      const taxes = subtotal * 0.05;
      return subtotal + taxes;
    },
  },
  {
    field: 'total',
    type: 'number',
    headerName: 'Total',
    valueGetter: (value, row) => {
      const subtotal = row.products.reduce(
        (acc: number, product: any) => product.unitPrice * product.quantity,
        0,
      );
      const taxes = subtotal * 0.05;
      return subtotal + taxes;
    },
  },

  // { field: 'id', headerName: 'Order ID' },
  // { field: 'customer', headerName: 'Customer', width: 200 },
  // { field: 'date', type: 'date', headerName: 'Placed at' },
  // { field: 'currency', headerName: 'Currency' },
  // {
  //   field: 'total',
  //   type: 'number',
  //   headerName: 'Total',
  //   valueGetter: (value, row) => {
  //     const subtotal = row.products.reduce(
  //       (acc: number, product: any) => product.unitPrice * product.quantity,
  //       0,
  //     );
  //     const taxes = subtotal * 0.05;
  //     return subtotal + taxes;
  //   },
  // },
];

// function generateProducts() {
//   const quantity = randomInt(1, 5);
//   return [...Array(quantity)].map((_, index) => ({
//     id: index,
//     name: randomCommodity(),
//     quantity: randomInt(1, 5),
//     unitPrice: randomPrice(1, 1000),
//   }));
// }

type Customer = {
  category: string;
  transactionCount: number,
  total: number,
  percentage: number,
}

interface CategoryRow {
  category: string;
  transactionCount: number,
  total: number,
  percentage: number,
}

// const rows = [
//   {
//     id: 1,
//     customer: 'Matheus',
//     email: randomEmail(),
//     date: randomCreatedDate(),
//     address: randomAddress(),
//     country: randomCountry(),
//     city: randomCity(),
//     currency: randomCurrency(),
//     products: generateProducts(),
//   },
//   {
//     id: 2,
//     customer: 'Olivier',
//     email: randomEmail(),
//     date: randomCreatedDate(),
//     address: randomAddress(),
//     country: randomCountry(),
//     city: randomCity(),
//     currency: randomCurrency(),
//     products: generateProducts(),
//   },
//   {
//     id: 3,
//     customer: 'Flavien',
//     email: randomEmail(),
//     date: randomCreatedDate(),
//     address: randomAddress(),
//     country: randomCountry(),
//     city: randomCity(),
//     currency: randomCurrency(),
//     products: generateProducts(),
//   },
//   {
//     id: 4,
//     customer: 'Danail',
//     email: randomEmail(),
//     date: randomCreatedDate(),
//     address: randomAddress(),
//     country: randomCountry(),
//     city: randomCity(),
//     currency: randomCurrency(),
//     products: generateProducts(),
//   },
//   {
//     id: 5,
//     customer: 'Alexandre',
//     email: randomEmail(),
//     date: randomCreatedDate(),
//     address: randomAddress(),
//     country: randomCountry(),
//     city: randomCity(),
//     currency: randomCurrency(),
//     products: generateProducts(),
//   },
// ];

// type Customer = (typeof rows)[number];

export interface ReportGridProps {
  transactionsByCategory: StringToTransactionsLUT,
}

const ReportGrid = (props: ReportGridProps) => {

  const getDetailPanelContent = React.useCallback<
    NonNullable<DataGridProProps['getDetailPanelContent']>
  >(({ row }) => <DetailPanelContent row={row} />, []);

  const getDetailPanelHeight = React.useCallback(() => 400, []);

  const getCategoryRowData = (categoryName: string): CategoryRow => {

    const transactions: CreditCardTransactionEntity[] = props.transactionsByCategory[categoryName];
    const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const categoryRowData: CategoryRow = {
      category: categoryName,
      transactionCount: transactions.length,
      total: totalAmount,
      percentage: 50,
    };

    return categoryRowData;
  }

  const getCategories = (): CategoryRow[] => {

    const rows: CategoryRow[] = [];

    for (const categoryName in props.transactionsByCategory) {
      if (Object.prototype.hasOwnProperty.call(props.transactionsByCategory, categoryName)) {
        const categoryData = getCategoryRowData(categoryName);
        rows.push(categoryData);
      }
    }

    return rows;
  }

  if (isEmpty(props.transactionsByCategory)) {
    return [];
  }

  const categoryRows: CategoryRow[] = getCategories();

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <DataGridPro
        columns={columns}
        rows={categoryRows}
        getDetailPanelHeight={getDetailPanelHeight}
        getDetailPanelContent={getDetailPanelContent}
      />
    </Box>
  );
};

function mapStateToProps(state: any) {
  return {
    transactionsByCategory: getTransactionsByCategory(state),
  };
}

const mapDispatchToProps = (dispatch: TrackerDispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportGrid);
*/
/*
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { DataGridPro, DataGridProProps, GridColDef } from '@mui/x-data-grid-pro';
import {
  randomCreatedDate,
  randomPrice,
  randomCurrency,
  randomCountry,
  randomCity,
  randomEmail,
  randomInt,
  randomAddress,
  randomCommodity,
} from '@mui/x-data-grid-generator';

function DetailPanelContent({ row: rowProp }: { row: Customer }) {
  return (
    <Stack
      sx={{ py: 2, height: '100%', boxSizing: 'border-box' }}
      direction="column"
    >
      <Paper sx={{ flex: 1, mx: 'auto', width: '90%', p: 1 }}>
        <Stack direction="column" spacing={1} sx={{ height: 1 }}>
          <Typography variant="h6">{`Order #${rowProp.id}`}</Typography>
          <Grid container>
            <Grid item md={6}>
              <Typography variant="body2" color="textSecondary">
                Customer information
              </Typography>
              <Typography variant="body1">{rowProp.customer}</Typography>
              <Typography variant="body1">{rowProp.email}</Typography>
            </Grid>
            <Grid item md={6}>
              <Typography variant="body2" align="right" color="textSecondary">
                Shipping address
              </Typography>
              <Typography variant="body1" align="right">
                {rowProp.address}
              </Typography>
              <Typography
                variant="body1"
                align="right"
              >{`${rowProp.city}, ${rowProp.country.label}`}</Typography>
            </Grid>
          </Grid>
          <DataGridPro
            density="compact"
            columns={[
              { field: 'name', headerName: 'Product', flex: 1 },
              {
                field: 'quantity',
                headerName: 'Quantity',
                align: 'center',
                type: 'number',
              },
              { field: 'unitPrice', headerName: 'Unit Price', type: 'number' },
              {
                field: 'total',
                headerName: 'Total',
                type: 'number',
                valueGetter: (value, row) => row.quantity * row.unitPrice,
              },
            ]}
            rows={rowProp.products}
            sx={{ flex: 1 }}
            hideFooter
          />
        </Stack>
      </Paper>
    </Stack>
  );
}

const columns: GridColDef<(typeof rows)[number]>[] = [
  { field: 'id', headerName: 'Order ID' },
  { field: 'customer', headerName: 'Customer', width: 200 },
  { field: 'date', type: 'date', headerName: 'Placed at' },
  { field: 'currency', headerName: 'Currency' },
  {
    field: 'total',
    type: 'number',
    headerName: 'Total',
    valueGetter: (value, row) => {
      const subtotal = row.products.reduce(
        (acc: number, product: any) => product.unitPrice * product.quantity,
        0,
      );
      const taxes = subtotal * 0.05;
      return subtotal + taxes;
    },
  },
];

function generateProducts() {
  const quantity = randomInt(1, 5);
  return [...Array(quantity)].map((_, index) => ({
    id: index,
    name: randomCommodity(),
    quantity: randomInt(1, 5),
    unitPrice: randomPrice(1, 1000),
  }));
}

const rows = [
  {
    id: 1,
    customer: 'Matheus',
    email: randomEmail(),
    date: randomCreatedDate(),
    address: randomAddress(),
    country: randomCountry(),
    city: randomCity(),
    currency: randomCurrency(),
    products: generateProducts(),
  },
  {
    id: 2,
    customer: 'Olivier',
    email: randomEmail(),
    date: randomCreatedDate(),
    address: randomAddress(),
    country: randomCountry(),
    city: randomCity(),
    currency: randomCurrency(),
    products: generateProducts(),
  },
  {
    id: 3,
    customer: 'Flavien',
    email: randomEmail(),
    date: randomCreatedDate(),
    address: randomAddress(),
    country: randomCountry(),
    city: randomCity(),
    currency: randomCurrency(),
    products: generateProducts(),
  },
  {
    id: 4,
    customer: 'Danail',
    email: randomEmail(),
    date: randomCreatedDate(),
    address: randomAddress(),
    country: randomCountry(),
    city: randomCity(),
    currency: randomCurrency(),
    products: generateProducts(),
  },
  {
    id: 5,
    customer: 'Alexandre',
    email: randomEmail(),
    date: randomCreatedDate(),
    address: randomAddress(),
    country: randomCountry(),
    city: randomCity(),
    currency: randomCurrency(),
    products: generateProducts(),
  },
];

type Customer = (typeof rows)[number];

export default function ReportGrid() {
  // const getDetailPanelContent = React.useCallback<
  //   NonNullable<DataGridProProps['getDetailPanelContent']>
  // >(
  //   (
  //     { row }
  //   ) => <DetailPanelContent row={row} />, []
  // );

  // const getDetailPanelContent = React.useCallback<
  //   NonNullable<DataGridProProps['getDetailPanelContent']>
  // >(
  //   (
  //     { row }
  //   ) => {
  //     console.log('getDetailedPanelContent row: ', row);
  //     return (
  //       <DetailPanelContent row={row} />
  //     );
  //   }, []
  // );

  const getDetailPanelContent = (rowData: any) => {
    const row = rowData.row;
    console.log('getDetailedPanelContent row: ', row);
    return (
      <DetailPanelContent row={row} />
    );
  }

  const getDetailPanelHeight = React.useCallback(() => 400, []);

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <DataGridPro
        columns={columns}
        rows={rows}
        getDetailPanelHeight={getDetailPanelHeight}
        getDetailPanelContent={getDetailPanelContent}
      />
    </Box>
  );
}
*/

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

const columns: GridColDef<(typeof rows)[number]>[] = [
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
  }
];

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

type CategoryRow = {
  id: string;
  categoryName: string;
  transactions: any[];
  transactionCount: number,
  totalAmount: number,
  percentage: number,
}

export default function ReportGrid() {

  const getDetailPanelContent = (rowData: any) => {
    const row = rowData.row;
    console.log('getDetailedPanelContent row: ', row);
    return (
      <DetailPanelContent row={row} />
    );
  }

  const getDetailPanelHeight = React.useCallback(() => 400, []);

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <DataGridPro
        columns={columns}
        rows={rows}
        getDetailPanelHeight={getDetailPanelHeight}
        getDetailPanelContent={getDetailPanelContent}
      />
    </Box>
  );
}
