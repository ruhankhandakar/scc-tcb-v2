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
