import type { MetadataRoute } from "next";

const BASE_URL = "https://read-japan.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/anki", "/bunpou", "/katsuyou", "/kotoba", "/prep"];

  return routes.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
}
