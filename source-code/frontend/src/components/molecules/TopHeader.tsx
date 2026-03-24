import LogoBadge from "../atoms/LogoBadge";
import NavLinkItem from "../atoms/NavLinkItem";

type TopHeaderProps = {
  logoText: string;
  links: string[];
};

export default function TopHeader({ logoText, links }: TopHeaderProps) {
  return (
    <header className="home-header">
      <LogoBadge text={logoText} />
      <nav className="home-header-nav" aria-label="Primary">
        {links.map((link) => (
          <NavLinkItem key={link} label={link} />
        ))}
      </nav>
    </header>
  );
}
