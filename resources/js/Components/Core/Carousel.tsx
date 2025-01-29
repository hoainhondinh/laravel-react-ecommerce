import { Image } from "@/types";
import { useEffect, useState, useRef } from "react";

function Carousel({ images }: { images: Image[] }) {
  const [selectedImage, setSelectedImage] = useState<Image>(images[0]);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedImage(images[0]);
  }, [images]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    const boundedX = Math.min(Math.max(x, 0), 100);
    const boundedY = Math.min(Math.max(y, 0), 100);

    setZoomPosition({ x: boundedX, y: boundedY });
  };

  return (
    <div className="flex items-start gap-8">
      {/* Thumbnails */}
      <div className="flex flex-col items-center gap-2 py-2">
        {images.map((image) => (
          <div
            key={image.id}
            className={`border-2 transition-colors cursor-pointer ${
              selectedImage.id === image.id
                ? 'border-blue-500'
                : 'border-transparent hover:border-blue-500'
            }`}
            onMouseEnter={() => setSelectedImage(image)}
          >
            <img
              src={image.thumb}
              alt=""
              className="w-[50px] h-[50px] object-cover"
            />
          </div>
        ))}
      </div>

      {/* Main Image và Zoom Container */}
      <div className="relative flex-1">
        <div
          ref={imageRef}
          className="relative aspect-square overflow-hidden bg-white"
          onMouseEnter={() => setShowZoom(true)}
          onMouseLeave={() => setShowZoom(false)}
          onMouseMove={handleMouseMove}
        >
          {/* Ảnh chính */}
          <img
            src={selectedImage.large}
            alt=""
            className="w-full h-full object-contain transition-opacity duration-200"
          />

          {/* Hiệu ứng lens khi hover */}
          {showZoom && (
            <div className="absolute inset-0 bg-black bg-opacity-5">
              <div
                className="absolute border border-gray-400"
                style={{
                  width: '100px',
                  height: '100px',
                  left: `${zoomPosition.x}%`,
                  top: `${zoomPosition.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            </div>
          )}
        </div>

        {/* Zoom Panel */}
        {showZoom && (
          <div
            className="hidden lg:block absolute left-full top-0 ml-4 bg-white"
            style={{
              width: '500px',
              height: '500px',
              backgroundImage: `url(${selectedImage.large})`,
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              backgroundSize: '250%',
              backgroundRepeat: 'no-repeat',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Carousel;
