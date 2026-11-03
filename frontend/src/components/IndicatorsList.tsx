import React from 'react';
import { EvidenceItem } from '../types';
import { ForensicIndicatorCard } from './ForensicIndicatorCard';

interface IndicatorsListProps {
  indicators: EvidenceItem[];
}

export const IndicatorsList: React.FC<IndicatorsListProps> = ({ indicators }) => {
  if (!indicators || indicators.length === 0) {
    return (
      <div className="card-3d-depth p-8 rounded-3xl text-center text-[#78636A] text-sm">
        No individual forensic indicators were returned for this media sample.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {indicators.map((indicator, index) => (
        <ForensicIndicatorCard
          key={`${indicator.title}-${index}`}
          indicator={indicator}
          index={index}
        />
      ))}
    </div>
  );
};
