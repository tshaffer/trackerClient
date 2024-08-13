// import * as React from 'react';
// import { createRoot, Root } from 'react-dom/client';
// import { BrowserRouter, Route, Routes } from 'react-router-dom';

// import { createStore, applyMiddleware } from 'redux';

// import { Provider } from 'react-redux';
// import thunkMiddleware from 'redux-thunk';
// import { rootReducer } from './models';

// import App from './components/App';

// import { composeWithDevTools } from 'redux-devtools-extension';


// export const store = createStore(
//   rootReducer,
//   composeWithDevTools(
//     applyMiddleware(thunkMiddleware)
//   ));

// const container = document.getElementById('content');
// const root: Root = createRoot(container!);

// root.render(
//   <App />
//   // <Provider store={store}>
//   //   <BrowserRouter>
//   //     <Routes>
//   //       <Route path='*' element={<App />} />
//   //     </Routes>
//   //   </BrowserRouter>
//   // </Provider>,
// );

// index.js or index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

debugger;
const root = ReactDOM.createRoot(document.getElementById('content')!);
root.render(<App />);