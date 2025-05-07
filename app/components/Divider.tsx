import "./Divider.css";

interface IDivider {
    text?: string;
    className?: string;
}

export default function Divider({ text, className = "" }: IDivider) {
    return (
        <div className={`divider ${className}`}>
            {text && <p className={`divider__text`}>{text}</p>}
        </div>
    );
}
