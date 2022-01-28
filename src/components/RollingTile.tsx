import "./RollingTile.css";

export function RollingTile({
    front,
    bottom,
}: {
    front: React.ReactElement;
    bottom: React.ReactElement;
}) {
    return (
        <div className="spinnerContainer">
            <div className="spinner">
                <div className="front">{front}</div>
                <div className="bottom">{bottom}</div>
            </div>
        </div>
    );
}
