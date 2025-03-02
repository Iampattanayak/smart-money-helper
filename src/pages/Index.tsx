
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import CalculatorLayout from '@/components/layout/CalculatorLayout';
import EMICalculator from '@/components/calculators/EMICalculator';
import SIPCalculator from '@/components/calculators/SIPCalculator';
import GSTCalculator from '@/components/calculators/GSTCalculator';
import FDCalculator from '@/components/calculators/FDCalculator';
import RDCalculator from '@/components/calculators/RDCalculator';
import PPFCalculator from '@/components/calculators/PPFCalculator';
import CreditScoreImpactCalculator from '@/components/calculators/CreditScoreImpactCalculator';

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
      case 'fd':
        return <FDCalculator />;
      case 'rd':
        return <RDCalculator />;
      case 'ppf':
        return <PPFCalculator />;
      case 'credit-score':
        return <CreditScoreImpactCalculator />;
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
