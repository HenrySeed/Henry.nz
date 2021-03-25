export default function Button({
    to,
    onClick,
    icon,
    children,
    style,
}: {
    to?: string;
    onClick?: () => any;
    icon?: string;
    children?: React.ReactElement | string;
    style?: React.CSSProperties;
}) {
    if (to) {
        return (
            <a
                style={style}
                href={to}
                className="button"
                rel="noreferrer"
                target="_blank"
            >
                {icon && <img src={icon} alt="buttonIcon" />}
                {children}
            </a>
        );
    }
    return (
        <span style={style} className="button" onClick={onClick}>
            {icon && <img src={icon} alt="buttonIcon" />}
            {children}
        </span>
    );
}
