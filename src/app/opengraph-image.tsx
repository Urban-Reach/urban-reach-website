import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/data/site";

export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(
    join(process.cwd(), "public", "brand", "urban-reach-lockup.png"),
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0E0E0E",
          backgroundImage:
            "radial-gradient(ellipse at 50% 40%, rgba(201,146,47,0.18), transparent 62%)," +
            "linear-gradient(to right, rgba(201,146,47,0.07) 1px, transparent 1px)," +
            "linear-gradient(to bottom, rgba(201,146,47,0.07) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 60px 60px, 60px 60px",
          position: "relative",
        }}
      >
        <img src={logoSrc} alt="" width={470} height={312} />

        <div
          style={{
            display: "flex",
            width: 120,
            height: 2,
            backgroundColor: "#C9922F",
            marginTop: 48,
            marginBottom: 40,
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 40,
            color: "#F2EDE6",
            letterSpacing: "-0.01em",
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          {site.tagline}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#C9922F",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            marginTop: 32,
          }}
        >
          {site.city}, {site.state}
        </div>
      </div>
    ),
    size,
  );
}
