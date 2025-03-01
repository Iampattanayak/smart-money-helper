
import React, { ReactNode } from 'react';

interface CalculatorLayoutProps {
  children: ReactNode;
}

const CalculatorLayout: React.FC<CalculatorLayoutProps> = ({ children }) => {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 w-full max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </div>
      <footer className="py-4 px-4 sm:px-6 border-t border-border/60 text-center text-sm text-muted-foreground">
        <p>Finance Calculator &copy; {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
};

export default CalculatorLayout;
