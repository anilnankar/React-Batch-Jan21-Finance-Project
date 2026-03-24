import type { CSSProperties } from "react";
import { clientUiConfig } from "@/config/client-config";
import TopHeader from "@/components/molecules/TopHeader";

export default function HomeScreen() {
  const { theme, home } = clientUiConfig;

  return (
    <main
      className="home-page"
      style={
        {
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
      <TopHeader logoText={home.logoText} links={home.topLinks} />

      <section className="home-content">
        <section className="left-column">
          <div className="search-strip">{home.searchPlaceholder}</div>

          <div className="action-grid">
            {home.actionCards.map((item) => (
              <button key={item} type="button" className="action-card">
                {item}
              </button>
            ))}
            <div className="support-card">
              <p>{home.supportTitle}</p>
              <strong>{home.supportPhone}</strong>
            </div>
          </div>

          <section className="hero-slider" aria-label="Hero">
            <h2>{home.heroTitle}</h2>
          </section>
        </section>

        <section className="right-column" aria-label="Promotions">
          <h2>{home.promoTitle}</h2>
        </section>
      </section>
    </main>
  );
}
