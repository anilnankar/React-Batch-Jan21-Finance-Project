"use client";

import { useEffect, useMemo, useState } from "react";

type HeroCarouselProps = {
  id: string;
  slides: string[];
  heightPx: number;
};

export default function HeroCarousel({ id, slides, heightPx }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = slides.length;

  const safeSlides = useMemo(() => slides.filter(Boolean), [slides]);

  useEffect(() => {
    let el: HTMLElement | null = null;
    let carouselInstance: any = null;
    let cancelled = false;

    const onSlide = (event: any) => {
      const next = typeof event?.to === "number" ? event.to : 0;
      setActiveIndex(next);
    };

    const run = async () => {
      await import("bootstrap/dist/js/bootstrap.bundle.min.js");
      if (cancelled) return;

      el = document.getElementById(id);
      if (!el) return;

      const b = (window as any).bootstrap;
      if (b?.Carousel) {
        carouselInstance = new b.Carousel(el, {
          interval: 3500,
          wrap: true,
          ride: true,
        });
      }

      el.addEventListener("slide.bs.carousel", onSlide);
      el.addEventListener("slid.bs.carousel", onSlide);
    };

    run();

    return () => {
      cancelled = true;
      if (el) {
        el.removeEventListener("slide.bs.carousel", onSlide);
        el.removeEventListener("slid.bs.carousel", onSlide);
      }
      carouselInstance?.dispose?.();
    };
  }, [id]);

  return (
    <div id={id} className="carousel slide" aria-label="Hero slider">
      <div className="carousel-inner" style={{ height: heightPx }}>
        {safeSlides.map((text, idx) => (
          <div
            key={`${id}-${idx}`}
            className={`carousel-item${idx === 0 ? " active" : ""}`}
            style={{ height: heightPx }}
          >
            <div className="d-grid align-items-center justify-content-center h-100">
              <h2
                className="m-0 text-center"
                style={{ fontSize: "clamp(40px, 6vw, 92px)", letterSpacing: 2 }}
              >
                {text}
              </h2>
            </div>
          </div>
        ))}
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target={`#${id}`}
        data-bs-slide="prev"
        aria-label="Previous"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true" />
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target={`#${id}`}
        data-bs-slide="next"
        aria-label="Next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true" />
        <span className="visually-hidden">Next</span>
      </button>

      <div className="visually-hidden" aria-live="polite">
        Slide {activeIndex + 1} of {total}
      </div>
    </div>
  );
}

