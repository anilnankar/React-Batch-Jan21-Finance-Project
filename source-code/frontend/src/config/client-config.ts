export type ClientTheme = {
  colors: {
    pageBackground: string;
    panelBackground: string;
    primaryText: string;
    border: string;
    subtleGrid: string;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
  spacing: {
    sectionGap: number;
    cardGap: number;
  };
};

export type HomeScreenConfig = {
  logoText: string;
  topLinks: {
    label: string;
    href: string;
  }[];
  actionCards: string[];
  supportTitle: string;
  supportPhone: string;
  searchPlaceholder: string;
  heroTitle: string;
  heroSlides: string[];
  promoSlides: string[];
  promoTitle: string;
};

export type ClientUiConfig = {
  theme: ClientTheme;
  home: HomeScreenConfig;
};

export const clientUiConfig: ClientUiConfig = {
  theme: {
    colors: {
      pageBackground: "#f7f7f7",
      panelBackground: "#ececec",
      primaryText: "#111111",
      border: "#3a3a3a",
      subtleGrid: "#d8d8d8",
    },
    borderRadius: {
      sm: 8,
      md: 12,
      lg: 28,
    },
    spacing: {
      sectionGap: 20,
      cardGap: 14,
    },
  },
  home: {
    logoText: "Finance System ",
    topLinks: [
      { label: "Home", href: "/" },
      { label: "Login", href: "/login" },
      { label: "Help", href: "/help" },
      { label: "About", href: "/about" },
    ],
    actionCards: ["Accounts", "Cards", "Loans", 
      "Investments", "Deposits", "Customer Care"],
    supportTitle: "Contact Support",
    supportPhone: "88888 77777",
    searchPlaceholder: "",
    heroTitle: "SLIDER",
    heroSlides: ["SLIDER 1", "SLIDER 2", "SLIDER 3"],
    promoSlides: ["SLIDER 10", "SLIDER 11", "SLIDER 12"],
    promoTitle: "SLIDER",
  },
};
