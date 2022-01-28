import { Link } from "react-router-dom";

export default function Button({
    to,
    onClick,
    icon,
    children,
    style,
    newTab,
}: {
    to?: string;
    onClick?: () => any;
    icon?: string;
    children?: React.ReactElement | string;
    style?: React.CSSProperties;
    newTab?: boolean;
}) {
    if (to) {
        if (!to.startsWith("http")) {
            return (
                <Link style={style} to={to} className="button">
                    {icon && <img src={icon} alt="buttonIcon" />}
                    {children}
                </Link>
            );
        } else {
            return (
                <a
                    style={style}
                    href={to}
                    className="button"
                    rel={newTab !== false ? "noopener noreferrer" : undefined}
                    target={newTab !== false ? "_blank" : undefined}
                >
                    {icon && <img src={icon} alt="buttonIcon" />}
                    {children}
                </a>
            );
        }
    }
    return (
        <span style={style} className="button" onClick={onClick}>
            {icon && <img src={icon} alt="buttonIcon" />}
            {children}
        </span>
    );
}
