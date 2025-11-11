import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "../../utils/helper";

type ImageCarouselProps = {
  images: string[];
};

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const carouselImages = images.length > 0 ? images : [];
  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent((current - 1 + carouselImages.length) % carouselImages.length);
  const next = () => setCurrent((current + 1) % carouselImages.length);

  // Handle dot click
  const goToSlide = (index: number) => setCurrent(index);

  if (!carouselImages) return null;

  return (
    <div className="bg-gray-50 flex flex-col items-center justify-center font-sans">
      <div className="relative w-full max-w-2xl mx-auto shadow-2xl rounded-xl overflow-hidden">
        <div className="w-full overflow-hidden">
          <div
            className="flex transition-transform ease-in-out duration-500"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {images.map(getImageUrl).map((src, index) => (
              <div key={index} className="min-w-full flex-shrink-0">
                <img
                  src={src}
                  alt={`Ảnh ${index + 1}`}
                  className="w-full h-80 sm:h-96 object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-between p-4">
          <button
            onClick={prev}
            className="p-3 rounded-full shadow-lg bg-white/30 text-white backdrop-blur-sm hover:bg-white/50 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-teal-400"
            aria-label="Ảnh trước"
          >
            <ChevronLeft size={24} strokeWidth={3} />
          </button>

          <button
            onClick={next}
            className="p-3 rounded-full shadow-lg bg-white/30 text-white backdrop-blur-sm hover:bg-white/50 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-teal-400"
            aria-label="Ảnh sau"
          >
            <ChevronRight size={24} strokeWidth={3} />
          </button>
        </div>

        {/* Chỉ báo Vị trí */}
        <div className="absolute bottom-4 left-0 right-0">
          <div className="flex items-center justify-center gap-2">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full h-2 ${
                  index === current
                    ? "w-8 bg-teal-500"
                    : "w-2 bg-white/70 hover:bg-white"
                } shadow-md`}
                aria-label={`Chuyển đến ảnh ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
