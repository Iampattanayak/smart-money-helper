
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import CalculatorLayout from '@/components/layout/CalculatorLayout';
import EMICalculator from '@/components/calculators/EMICalculator';
import SIPCalculator from '@/components/calculators/SIPCalculator';
import GSTCalculator from '@/components/calculators/GSTCalculator';

const Index: React.FC = () => {
  const [activeCalculator, setActiveCalculator] = useState('emi');

  const renderCalculator = () => {
    switch (activeCalculator) {
      case 'emi':
        return <EMICalculator />;
      case 'sip':
        return <SIPCalculator />;
      case 'gst':
        return <GSTCalculator />;
      default:
        return <EMICalculator />;
    }
  };

  return (
    <>
      <Header 
        activeCalculator={activeCalculator} 
        onChangeCalculator={setActiveCalculator} 
      />
      <CalculatorLayout>
        <div className="animate-fade-in">
          {renderCalculator()}
        </div>
      </CalculatorLayout>
    </>
  );
};

export default Index;
