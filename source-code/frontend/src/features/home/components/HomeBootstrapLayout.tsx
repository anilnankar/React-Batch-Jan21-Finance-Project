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
  heroSlides: string[];
  promoSlides: string[];
};

export default function HomeBootstrapLayout({
  logoText,
  topLinks,
  actionCards,
  supportTitle,
  supportPhone,
  searchPlaceholder,
  heroSlides,
  promoSlides,
}: HomeBootstrapLayoutProps) {
  const chunkSize = 3;
  const actionCardRows: string[][] = [];
  for (let i = 0; i < actionCards.length; i += chunkSize) {
    actionCardRows.push(actionCards.slice(i, i + chunkSize));
  }

  return (
    <div className="container-fluid px-0">
      <TopHeader logoText={logoText} links={topLinks} />

      <div className="row g-3 mt-2">
        <div className="col-12 col-lg-7">
          <div className="d-grid gap-3">
            <UiCard radius="sm" style={{ minHeight: 62, padding: 0 }}>
              <div className="px-3 d-grid align-items-center" style={{ minHeight: 62 }}>
                {searchPlaceholder ? <span>{searchPlaceholder}</span> : null}
              </div>
            </UiCard>

            <div className="d-grid gap-2">
              {actionCardRows.map((row, rowIndex) => (
                <div key={`row-${rowIndex}`} className="row row-cols-3 g-2">
                  {row.map((label) => (
                    <div key={label} className="col">
                      <UiButton>{label}</UiButton>
                    </div>
                  ))}
                </div>
              ))}

              <div className="row row-cols-3 g-2" style={{display: 'none'}}>
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
          <UiCard radius="lg" style={{ minHeight: 620, padding: 0 }} className="p-0">
            <HeroCarousel id="promo-carousel" slides={promoSlides} heightPx={620} />
          </UiCard>
        </div>
      </div>
    </div>
  );
}
