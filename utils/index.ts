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

export const bytesToKB = (bytes: number): string => {
  const kilobytes = Math.round(bytes / 1024);
  return kilobytes.toFixed(2) + ' KB';
};

export const getExtensionFromUrl = (url: string): string => {
  const lastDotIndex = url.lastIndexOf('.');
  return lastDotIndex === -1 ? '' : url.substring(lastDotIndex + 1);
};
