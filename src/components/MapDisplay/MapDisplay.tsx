interface MapDisplayProps {
  lat?: number;
  lon?: number;
  zoom?: number;
  width?: string;
  height?: string;
}

export default function MapDisplay({
  lat = -17.4143,
  lon = -66.1788,
  zoom = 13,
  height = "300px",
}: MapDisplayProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const src = `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${lat},${lon}&zoom=${zoom}`;

  return (
    <iframe
      title="Google Map"
      width="100%"
      height={height}
      style={{ border: "1px solid black", borderRadius: "2rem" }}
      src={src}
      allowFullScreen
    ></iframe>
  );
}
