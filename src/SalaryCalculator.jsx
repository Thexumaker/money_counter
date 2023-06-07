import React, { useState, useEffect } from 'react';
import numeral from 'numeral';

const SalaryCalculator = () => {
  const [salary, setSalary] = useState(140000);
  const [earningsPerSecond, setEarningsPerSecond] = useState(0);
  const [cumulativeEarnings, setCumulativeEarnings] = useState(0);
  const [cumulativeTaxes, setCumulativeTaxes] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const earnings = salary / 31536000; // Divide by the number of seconds in a year

      // Calculate federal tax (assumed 20%)
      const federalTax = earnings * 0.2;

      // Calculate state tax for California (assumed 10%)
      const stateTax = earnings * 0.1;

      setCumulativeEarnings((prevEarnings) => prevEarnings + earnings);
      setCumulativeTaxes((prevTaxes) => prevTaxes + federalTax + stateTax);
    }, 1000);

    const handleBeforeUnload = () => {
      // Save cumulative earnings and taxes to local storage before unloading
      localStorage.setItem('cumulativeEarnings', cumulativeEarnings.toString());
      localStorage.setItem('cumulativeTaxes', cumulativeTaxes.toString());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [salary, cumulativeEarnings, cumulativeTaxes]);

  useEffect(() => {
    // Check if values exist in localStorage
    const savedCumulativeEarnings = localStorage.getItem('cumulativeEarnings');
    const savedCumulativeTaxes = localStorage.getItem('cumulativeTaxes');

    // If values exist, update state with saved values
    if (savedCumulativeEarnings) {
      setCumulativeEarnings(parseFloat(savedCumulativeEarnings));
    }
    if (savedCumulativeTaxes) {
      setCumulativeTaxes(parseFloat(savedCumulativeTaxes));
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="">
        <h2>Salary Calculator</h2>
        <div>
          <label htmlFor="salary">Yearly Salary:</label>
          <input
            type="number"
            id="salary"
            value={salary}
            onChange={(e) => setSalary(parseInt(e.target.value))}
          />
        </div>
        <div className="mt-8  h-full w-full">
          <h3>Earnings per Second: {numeral(earningsPerSecond).format('$0,0.00000')}</h3>
          <h3>Cumulative Earnings: {numeral(cumulativeEarnings).format('$0,0.00')}</h3>
          <h3>Cumulative Taxes: {numeral(cumulativeTaxes).format('$0,0.00')}</h3>
        </div>
      </div>
    </div>
  );
};

export default SalaryCalculator;
