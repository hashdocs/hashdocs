import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const getPdfDetails = async (pdfFile: string) => {
  const pdf = await pdfjs.getDocument(pdfFile).promise;
  const num_pages = pdf.numPages;
  let thumbnail_image: string | null = null;

  try {
    const firstPage = await pdf.getPage(1);
    const viewport = firstPage.getViewport({ scale: 1 });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    if (!context) throw new Error('Could not get canvas context');

    await firstPage.render({ canvasContext: context, viewport }).promise;
    const firstPageImage = canvas.toDataURL();

    thumbnail_image = await createOgImage(
      firstPageImage,
      viewport.width,
      viewport.height
    );
  } catch (error) {}

  return { num_pages, thumbnail_image };
};

const createOgImage = (
  imgSrc: string,
  imgWidth: number,
  imgHeight: number
): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const ogWidth = 1200;
    const ogHeight = 630;
    const bgColor = '#FFFFFF'; // Dark blue color

    canvas.width = ogWidth;
    canvas.height = ogHeight;

    if (!context) throw new Error('Could not get canvas context');

    // Fill the background with dark blue color
    context.fillStyle = bgColor;
    context.fillRect(0, 0, ogWidth, ogHeight);

    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      // Calculate the scaling factor
      const scale = Math.max(ogWidth / imgWidth, ogHeight / imgHeight);
      const scaledWidth = imgWidth * scale;
      const scaledHeight = imgHeight * scale;

      // Calculate position to center the image
      const x = (ogWidth - scaledWidth) / 2;
      const y = 0;

      context.drawImage(img, x, y, scaledWidth, scaledHeight);

      const ogImage = canvas.toDataURL();
      resolve(ogImage);
    };
  });
};
