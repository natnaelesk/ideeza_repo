import { Brand, Icon } from "@/components/icons";
import type { Art, Platform } from "@/lib/data";

const BRAND_COLOR: Record<Platform, string> = {
  tiktok: "#111111",
  x: "#111111",
  linkedin: "#0A66C2",
  telegram: "#229ED9",
};

export function ChallengeArt({ art, label }: { art: Art; label: string }) {
  if (art === "tiktok" || art === "x" || art === "linkedin" || art === "telegram") {
    return (
      <div className="grid h-36 place-items-center bg-[#fbfaff]" style={{ color: BRAND_COLOR[art] }} role="img" aria-label={label}>
        <Brand name={art} className="h-14 w-14" />
      </div>
    );
  }

  const icon = art === "story" ? "quote" : art === "sketch" ? "pencil" : art === "refer" ? "users" : art === "mint" ? "coin" : "spark";

  return (
    <div className="grid h-36 place-items-center bg-[#efe8ff] text-[#4b17c9]" role="img" aria-label={label}>
      {art === "clock" ? (
        <span className="bg-gradient-to-r from-[#4b17c9] to-[#7b3bff] bg-clip-text text-5xl font-extrabold tracking-tight text-transparent">48h</span>
      ) : (
        <Icon name={icon} className="h-14 w-14" />
      )}
    </div>
  );
}

export function platformColor(platform: Platform) {
  return BRAND_COLOR[platform];
}
