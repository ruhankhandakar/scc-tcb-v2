export const convertBlob = (data: Blob) => {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();

    fr.onload = () => {
      resolve(fr.result);
    };

    fr.onerror = (error) => {
      reject(error);
    };

    fr.readAsDataURL(data);
  });
};
