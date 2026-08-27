import React from 'react';
import { CustomerLocationModal } from './CustomerLocationModal';

interface CurrencySwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CurrencySwitcherModal: React.FC<CurrencySwitcherModalProps> = ({ isOpen, onClose }) => {
  return (
    <CustomerLocationModal
      isOpen={isOpen}
      onClose={onClose}
      initialStep="country_picker"
    />
  );
};

