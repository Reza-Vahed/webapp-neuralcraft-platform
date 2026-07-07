import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NeuralCraft — KI-Beratung für Unternehmen",
    short_name: "NeuralCraft",
    description:
      "NeuralCraft begleitet Unternehmen jeder Größe als langfristiger Technologiepartner beim praktischen und messbaren Einsatz von Künstlicher Intelligenz.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#4f46e5",
    icons: [
      { src: "/icon/pwa-192", sizes: "192x192", type: "image/png" },
      { src: "/icon/pwa-512", sizes: "512x512", type: "image/png" },
    ],
  };
}
