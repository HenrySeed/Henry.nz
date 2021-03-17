import henrySVG from "../res/logo_1.svg";
import seedSVG from "../res/logo_2.svg";

export default function Logo({ className }: { className: string }) {
    return (
        <div className={className} style={{ width: "fit-content" }}>
            <span
                style={{
                    backgroundImage: `url(${henrySVG})`,
                }}
            ></span>
            <span
                style={{
                    backgroundImage: `url(${seedSVG})`,
                }}
            ></span>
        </div>
    );
}
