import { useEffect, useState } from "react";

function ProductImage({ src, alt, fallbackText = "Image unavailable" }) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [src]);

  if (!src || imageFailed) {
    return <span className="image-fallback">{fallbackText}</span>;
  }

  return <img src={src} alt={alt} loading="lazy" onError={() => setImageFailed(true)} />;
}

export default ProductImage;
