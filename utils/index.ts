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

export function isBanglaNumber(numberStr: string): boolean {
  // Regular expression to match Bangla digits
  const banglaDigitRegex = /^[০-৯]+$/;

  // Test if the input string matches the Bangla digit regex
  return banglaDigitRegex.test(numberStr);
}

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

export function convertNumberToBangla(number: number): string {
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

export const isMediumStrengthPassword = (password: string): boolean => {
  // Check if the password has at least 6 characters
  if (password.length < 6) {
    return false;
  }

  // Check if the password contains at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return false;
  }

  // Check if the password contains at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return false;
  }

  // Check if the password contains at least one digit
  if (!/\d/.test(password)) {
    return false;
  }

  // Check if the password contains at least one special character
  if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password)) {
    return false;
  }

  return true;
};

// P@ssw0rd

export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleanedNumber = phoneNumber.replace(/\D/g, '');

  if (cleanedNumber.startsWith('88') && cleanedNumber.length === 12) {
    return `+${cleanedNumber}`;
  } else if (cleanedNumber.length === 10) {
    return `+880${cleanedNumber}`;
  } else if (cleanedNumber.length === 11 && cleanedNumber.startsWith('0')) {
    return `+880${cleanedNumber.substring(1)}`;
  } else {
    return phoneNumber;
  }
};
