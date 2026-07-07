import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type DisplayCurrency = 'XOF' | 'EUR' | 'USD' | 'GBP' | 'CAD' | 'NGN' | 'GHS';

type CurrencyOption = {
  code: DisplayCurrency;
  label: string;
  hint: string;
  locale: string;
  rateFromXof: number;
};

export const currencyOptions: CurrencyOption[] = [
  { code: 'XOF', label: 'Franc CFA', hint: 'Montants originaux', locale: 'fr-SN', rateFromXof: 1 },
  { code: 'EUR', label: 'Euro', hint: 'Taux fixe: 1 EUR = 655,957 FCFA', locale: 'fr-FR', rateFromXof: 1 / 655.957 },
  { code: 'USD', label: 'Dollar US', hint: 'Taux indicatif MVP', locale: 'en-US', rateFromXof: 0.00178 },
  { code: 'GBP', label: 'Livre sterling', hint: 'Taux indicatif MVP', locale: 'en-GB', rateFromXof: 0.00131 },
  { code: 'CAD', label: 'Dollar canadien', hint: 'Taux indicatif MVP', locale: 'en-CA', rateFromXof: 0.00242 },
  { code: 'NGN', label: 'Naira', hint: 'Taux indicatif MVP', locale: 'en-NG', rateFromXof: 2.66 },
  { code: 'GHS', label: 'Cedi', hint: 'Taux indicatif MVP', locale: 'en-GH', rateFromXof: 0.0189 },
];

const storageKey = 'molo-display-currency';

type CurrencyContextValue = {
  convertAmount: (amountXof: number) => number;
  currency: DisplayCurrency;
  formatMoney: (amountXof: number) => string;
  selectedOption: CurrencyOption;
  setCurrency: (currency: DisplayCurrency) => void;
};

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<DisplayCurrency>(() => getStoredCurrency() ?? 'XOF');

  const value = useMemo<CurrencyContextValue>(() => {
    const selectedOption =
      currencyOptions.find((option) => option.code === currency) ?? currencyOptions[0];

    function setCurrency(nextCurrency: DisplayCurrency) {
      setCurrencyState(nextCurrency);
      globalThis.localStorage?.setItem(storageKey, nextCurrency);
    }

    function convertAmount(amountXof: number) {
      return amountXof * selectedOption.rateFromXof;
    }

    function formatMoney(amountXof: number) {
      return new Intl.NumberFormat(selectedOption.locale, {
        currency: selectedOption.code,
        maximumFractionDigits: selectedOption.code === 'XOF' ? 0 : 2,
        minimumFractionDigits: selectedOption.code === 'XOF' ? 0 : 2,
        style: 'currency',
      }).format(convertAmount(amountXof));
    }

    return { convertAmount, currency, formatMoney, selectedOption, setCurrency };
  }, [currency]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const value = useContext(CurrencyContext);
  if (!value) {
    throw new Error('useCurrency must be used inside CurrencyProvider');
  }
  return value;
}

export function useMoney() {
  return useCurrency().formatMoney;
}

function getStoredCurrency() {
  const savedCurrency = globalThis.localStorage?.getItem(storageKey) as DisplayCurrency | null;
  return currencyOptions.some((option) => option.code === savedCurrency) ? savedCurrency : null;
}
