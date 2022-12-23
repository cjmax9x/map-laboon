import dynamic from "next/dynamic";

export default function Map() {
  const MapWithNoSSR = dynamic(() => import("./MapSSR"), {
    ssr: false,
  });

  return <MapWithNoSSR />;
}
