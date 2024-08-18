import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDividendsByCompanyId, selectDividends, selectDividendLoading, selectDividendError } from '../redux/dividend/dividendSlice';
import { selectSelectedCompany } from '../redux/company/companySlice';
import ReusableChart from './ReusableChart';

const DonutChart = () => {
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

  const seriesData = [
    {
      name: 'Dividend Yield',
      data: dividends.map((div) => ({
        name: div.year.toString(),
        y: div.dividendYield,
      })),
    },
  ];

  return (
    <ReusableChart
      chartType="pie"
      title="Dividend Yield Percentage"
      xAxisCategories={[]} // Not needed for pie charts
      seriesData={seriesData}
    />
  );
};

export default DonutChart;
