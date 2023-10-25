import dayjs from 'dayjs';

export const getCurrentMonthStartAndEndDate = (): {
  startDate: string;
  endDate: string;
} => {
  const currentDate = dayjs();
  const startDate = currentDate.startOf('month').toISOString();
  const endDate = currentDate.endOf('month').toISOString();

  return { startDate, endDate };
};

export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const isValidBangladeshiMobileNumber = (
  mobileNumber: string
): boolean => {
  // Regular expression for Bangladeshi mobile numbers
  const bdMobileRegex = /^1[3-9]\d{8}$/;

  // Check if the provided number matches the regex
  return bdMobileRegex.test(mobileNumber);
};

export const bytesToSize = (bytes: number): string => {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  while (bytes >= 1024 && i < sizes.length - 1) {
    bytes /= 1024;
    i++;
  }
  return bytes.toFixed(0) + ' ' + sizes[i];
};

export const getExtensionFromUrl = (url: string): string => {
  const lastDotIndex = url.lastIndexOf('.');
  return lastDotIndex === -1 ? '' : url.substring(lastDotIndex + 1);
};

export const calculatePercentage = (
  approvedCustomers: number,
  registeredCustomers: number
): { approvedPercentage: number; registeredPercentage: number } => {
  const totalCustomers = registeredCustomers;
  const approvedPercentage = (approvedCustomers / totalCustomers) * 100;
  const registeredPercentage = 100;

  return { approvedPercentage, registeredPercentage };
};

function convertBanglaToNumber(banglaNumber: string): number {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

  // Replace Bengali digits with regular digits
  for (let i = 0; i < banglaDigits.length; i++) {
    banglaNumber = banglaNumber.replace(
      new RegExp(banglaDigits[i], 'g'),
      i.toString()
    );
  }

  return parseFloat(banglaNumber);
}

function convertNumberToBangla(number: number): string {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

  const numberString = number.toString();
  let result = '';

  for (let i = 0; i < numberString.length; i++) {
    const digit = numberString[i];
    const banglaDigit = banglaDigits[parseInt(digit, 10)];
    result += banglaDigit;
  }

  return result;
}
export const multiplyNumbersInBangla = (num1: string, num2: string): string => {
  // Convert the Bengali numbers to regular numbers
  const number1 = convertBanglaToNumber(num1);
  const number2 = convertBanglaToNumber(num2);

  // Multiply the numbers
  const result = number1 * number2;

  // Convert the result back to Bengali
  const resultInBangla = convertNumberToBangla(result);

  return resultInBangla;
};
