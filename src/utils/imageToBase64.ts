export const fileToBase64 = (
  file: File,
  maxSize = 900,
  quality = 0.75
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        const ratio = Math.min(maxSize / width, maxSize / height, 1);
        width *= ratio;
        height *= ratio;

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Canvas error");

        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl.split(",")[1]); // PURE BASE64
      };
      img.src = reader.result as string;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
