import { useEffect, useRef } from '@webpack/common';

const GridCollage = ({ imageUrls }: { imageUrls: string[]; }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const loadImage = async (url: string) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
    };

    const drawCollage = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = 400;
      canvas.height = 400;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const images = await Promise.all(imageUrls.map(loadImage));

      const rows = Math.ceil(Math.sqrt(images.length));
      const cols = Math.ceil(images.length / rows);

      const minDimension = canvas.width / cols;

      let x = 0;
      let y = 0;

      images.forEach((img) => {
        const aspectRatio = img.width / img.height;
        const drawWidth = minDimension * aspectRatio;
        const drawHeight = minDimension;
        ctx.drawImage(img, x, y, drawWidth, drawHeight);
        x += minDimension;
        if (x >= canvas.width) {
          x = 0;
          y += minDimension;
        }
      });
    };

    drawCollage();
  }, [imageUrls]);

  return <canvas ref={canvasRef} />;
};

export default GridCollage;
