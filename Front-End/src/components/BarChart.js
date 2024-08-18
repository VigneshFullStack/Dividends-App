import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDividendsByCompanyId, selectDividends, selectDividendLoading, selectDividendError } from '../redux/dividend/dividendSlice';
import { selectSelectedCompany } from '../redux/company/companySlice';
import ReusableChart from './ReusableChart';

const BarChart = () => {
  const dispatch = useDispatch();
  const dividends = useSelector(selectDividends);
  const loading = useSelector(selectDividendLoading);
  const error = useSelector(selectDividendError);
  const selectedCompany = useSelector(selectSelectedCompany);

  useEffect(() => {
    if (selectedCompany) {
      dispatch(fetchDividendsByCompanyId(selectedCompany));
    }
  }, [selectedCompany, dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const xAxisCategories = dividends.map((div) => div.year);
  const seriesData = [
    {
      name: 'Dividend Amount',
      data: dividends.map((div) => div.dividendAmount),
    },
  ];

  return (
    <ReusableChart
      chartType="column"
      title="Annual Dividend Amount"
      xAxisCategories={xAxisCategories}
      seriesData={seriesData}
    />
  );
};

export default BarChart;
