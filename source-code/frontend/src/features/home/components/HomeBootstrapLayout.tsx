import UiButton from "@/components/atoms/ui/UiButton";
import UiCard from "@/components/atoms/ui/UiCard";
import TopHeader from "@/components/molecules/TopHeader";
import HeroCarousel from "./HeroCarousel";

type HomeBootstrapLayoutProps = {
  logoText: string;
  topLinks: string[];
  actionCards: string[];
  supportTitle: string;
  supportPhone: string;
  searchPlaceholder?: string;
  heroTitle: string;
  heroSlides: string[];
  promoTitle: string;
};

export default function HomeBootstrapLayout({
  logoText,
  topLinks,
  actionCards,
  supportTitle,
  supportPhone,
  searchPlaceholder,
  heroSlides,
  promoTitle,
}: HomeBootstrapLayoutProps) {
  const firstRow = actionCards.slice(0, 3);
  const secondRow = actionCards.slice(3, 5);

  return (
    <div className="container-fluid px-0">
      <TopHeader logoText={logoText} links={topLinks} />

      <div className="row g-3 mt-2">
        <div className="col-12 col-lg-7">
          <div className="d-grid gap-3">
            <UiCard radius="sm" style={{ minHeight: 62, padding: 0 }}>
              <div className="d-grid align-items-center px-3" style={{ minHeight: 62 }}>
                {searchPlaceholder ? <span>{searchPlaceholder}</span> : null}
              </div>
            </UiCard>

            <div className="d-grid gap-2">
              <div className="row row-cols-3 g-2">
                {firstRow.map((label) => (
                  <div key={label} className="col">
                    <UiButton>{label}</UiButton>
                  </div>
                ))}
              </div>

              <div className="row row-cols-3 g-2">
                {secondRow[0] ? (
                  <div className="col">
                    <UiButton>{secondRow[0]}</UiButton>
                  </div>
                ) : null}

                {secondRow[1] ? (
                  <div className="col">
                    <UiButton>{secondRow[1]}</UiButton>
                  </div>
                ) : null}

                <div className="col">
                  <UiCard radius="md" style={{ minHeight: 92, padding: 0 }} className="text-center">
                    <div
                      className="d-grid align-items-center justify-content-center"
                      style={{ minHeight: 92 }}
                    >
                      <p className="m-0" style={{ fontSize: 28, fontWeight: 700 }}>
                        {supportTitle}
                      </p>
                      <strong style={{ fontSize: 34 }}>{supportPhone}</strong>
                    </div>
                  </UiCard>
                </div>
              </div>
            </div>

            <UiCard radius="lg" style={{ minHeight: 290, padding: 0 }} className="p-0">
              <HeroCarousel id="hero-carousel" slides={heroSlides} heightPx={290} />
            </UiCard>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <UiCard radius="lg" style={{ minHeight: 620, padding: 0 }} className="text-center">
            <div
              className="d-grid align-items-center justify-content-center"
              style={{ minHeight: 620 }}
            >
              <h2 className="m-0" style={{ fontSize: "clamp(40px, 6vw, 92px)", letterSpacing: 2 }}>
                {promoTitle}
              </h2>
            </div>
          </UiCard>
        </div>
      </div>
    </div>
  );
}
