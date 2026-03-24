type LogoBadgeProps = {
  text: string;
};

export default function LogoBadge({ text }: LogoBadgeProps) {
  return <div className="ui-logo-badge">{text}</div>;
}
