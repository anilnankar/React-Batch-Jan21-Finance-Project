import type { CSSProperties } from "react";
import { clientUiConfig } from "@/config/client-config";
import HomeBootstrapLayout from "./HomeBootstrapLayout";

export default function HomeScreen() {
  const { theme, home } = clientUiConfig;

  return (
    <main
      className="min-vh-100 p-2"
      style={
        {
          backgroundColor: theme.colors.pageBackground,
          color: theme.colors.primaryText,

          "--page-bg": theme.colors.pageBackground,
          "--panel-bg": theme.colors.panelBackground,
          "--border-color": theme.colors.border,
          "--primary-text": theme.colors.primaryText,
          "--grid-color": theme.colors.subtleGrid,
          "--radius-sm": `${theme.borderRadius.sm}px`,
          "--radius-md": `${theme.borderRadius.md}px`,
          "--radius-lg": `${theme.borderRadius.lg}px`,
          "--section-gap": `${theme.spacing.sectionGap}px`,
          "--card-gap": `${theme.spacing.cardGap}px`,
        } as CSSProperties
      }
    >
      <HomeBootstrapLayout
        logoText={home.logoText}
        topLinks={home.topLinks}
        actionCards={home.actionCards}
        supportTitle={home.supportTitle}
        supportPhone={home.supportPhone}
        searchPlaceholder={home.searchPlaceholder}
        heroTitle={home.heroTitle}
        heroSlides={home.heroSlides}
        promoTitle={home.promoTitle}
      />
    </main>
  );
}
