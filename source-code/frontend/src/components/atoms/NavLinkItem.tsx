type NavLinkItemProps = {
  label: string;
};

export default function NavLinkItem({ label }: NavLinkItemProps) {
  return (
    <button type="button" className="ui-nav-link">
      {label}
    </button>
  );
}
