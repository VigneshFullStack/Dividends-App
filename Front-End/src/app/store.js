import { configureStore } from '@reduxjs/toolkit';
import dividendReducer from '../redux/dividend/dividendSlice';
import companyReducer from '../redux/company/companySlice';

export const store = configureStore({
  reducer: {
    dividends: dividendReducer,
    companies: companyReducer,
  },
});
