"use client";

import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";

import "./ListGlowItemBorders.css";

export interface IMousePos {
    x: number;
    y: number;
}

interface IRadial {
    size?: CSSProperties["top"];
    color?: CSSProperties["color"];
    falloff?: CSSProperties["top"];
    opacity?: CSSProperties["opacity"];
}

export interface IItemStyles {
    itemStyle?: {
        borderWidth?: CSSProperties["top"];
        borderRadius?: CSSProperties["top"];
        borderColor?: CSSProperties["color"];
        blur?: CSSProperties["top"];
        backgroundColor?: CSSProperties["backgroundColor"];
    };
    radialBackdrop?: IRadial;
    borderGlow?: IRadial;
}

/**
 * Lists out items that wrap you component in order to add a glowing border hover effect.
 *
 * @component
 * @example
 * <ListGlowItemBorders
 *     list={objectList}
 *     cardComponent={Card}
 *     itemStyles={itemStyles}
 *     className={"object-list"}
 *     itemClassName={"customize-item"}
 *     uniqueKey={"id"}
 * />
 *
 * @param {Object[]} list - A list of objects.
 * @param {ReactNode} cardComponent - The card component that will be wrapped.
 * @param {string} [className] - (Optional) Class name used to style the list.
 * @param {string} [itemClassName] - (Optional) Class name used to style the item container which wraps the card compoment.
 * @param {IItemStyles} [itemStyles] - (Optional) Object to change appearance of glow effects.
 * @param {string} [uniqueKey="id"] - (Optional default="id") Name of the property in the list objects to access the unique key when mapping.
 *
 * @example
 * // Example of `itemStyles` object structure:
 * const itemStyles = {
 *   itemStyle: {
 *       borderWidth: "3px",
 *       borderRadius: "auto",
 *       borderColor: "rgba(146, 146, 146, 0.1)",
 *       blur: "0px",
 *       backgroundColor: "rgb(26, 26, 26)",
 *   },
 *   radialBackdrop: {
 *       size: "500px",
 *       color: "rgba(255, 255, 255, 0.04)",
 *       falloff: "40%",
 *       opacity: "1",
 *   },
 *   borderGlow: {
 *       size: "500px",
 *       color: "rgba(255, 255, 255, 0.4)",
 *       falloff: "40%",
 *       opacity: "1",
 *   },
 * };
 */
export default function ListGlowItemBorders<T extends Record<string, any>>({
    list,
    cardComponent: CardComponent,
    className,
    itemClassName,
    itemStyles,
    uniqueKey = "id",
}: {
    list: T[];
    cardComponent: React.ComponentType<T>;
    className?: string;
    itemClassName?: string;
    itemStyles?: IItemStyles;
    uniqueKey?: string;
}) {
    const [mousePos, setMousePos] = useState<IMousePos>({ x: 0, y: 0 });
    const [windowChange, setWindowChange] = useState<boolean>(false);
    const [style, setStyle] = useState<CSSProperties>({});

    const listRef = useRef<HTMLDivElement | null>(null);

    // Update the mousePos when moving the mouse inside the list container
    const handleMouseMove = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        setMousePos((prevPos) => ({ ...prevPos, x: e.clientX, y: e.clientY }));
    };

    // Set CSS variables for properties included in itemStyles
    useEffect(() => {
        if (!itemStyles) return;

        const styleObj: Record<string, string | number> = {};
        // Item border styles
        if (itemStyles.itemStyle) {
            if (itemStyles.itemStyle.borderWidth)
                styleObj["--LGIB-item-border-width"] = itemStyles.itemStyle.borderWidth;
            if (itemStyles.itemStyle.borderRadius)
                styleObj["--LGIB-item-border-radius"] = itemStyles.itemStyle.borderRadius;
            if (itemStyles.itemStyle.borderColor)
                styleObj["--LGIB-item-border-color"] = itemStyles.itemStyle.borderColor;
            if (itemStyles.itemStyle.blur) styleObj["--LGIB-item-blur"] = itemStyles.itemStyle.blur;
            if (itemStyles.itemStyle.backgroundColor)
                styleObj["--LGIB-item-background-color"] = itemStyles.itemStyle.backgroundColor;
        }

        // Backdrop radial styles
        if (itemStyles.radialBackdrop) {
            if (itemStyles.radialBackdrop.size)
                styleObj["--LGIB-backdrop-size"] = itemStyles.radialBackdrop.size;
            if (itemStyles.radialBackdrop.color)
                styleObj["--LGIB-backdrop-color"] = itemStyles.radialBackdrop.color;
            if (itemStyles.radialBackdrop.falloff)
                styleObj["--LGIB-backdrop-falloff"] = itemStyles.radialBackdrop.falloff;
            if (itemStyles.radialBackdrop.opacity)
                styleObj["--LGIB-backdrop-opacity"] = itemStyles.radialBackdrop.opacity;
        }

        // Border radial glow styles
        if (itemStyles.borderGlow) {
            if (itemStyles.borderGlow.size)
                styleObj["--LGIB-borderGlow-size"] = itemStyles.borderGlow.size;
            if (itemStyles.borderGlow.color)
                styleObj["--LGIB-borderGlow-color"] = itemStyles.borderGlow.color;
            if (itemStyles.borderGlow.falloff)
                styleObj["--LGIB-borderGlow-falloff"] = itemStyles.borderGlow.falloff;
            if (itemStyles.borderGlow.opacity)
                styleObj["--LGIB-borderGlow-opacity"] = itemStyles.borderGlow.opacity;
        }

        setStyle(styleObj);
    }, [itemStyles]);

    // Helps prevent unnecessary boundingClientRect calculations
    useEffect(() => {
        if (!listRef.current) return;

        // Add event listeners, so that getBoundingClientRect gets updated
        const updateWindow = () => {
            // Toggle state so that dependency will cause an update
            setWindowChange((prev) => !prev);
        };
        window.addEventListener("resize", updateWindow);
        document.body.addEventListener("scroll", updateWindow);

        // Remove listeners on unmount
        return () => {
            window.removeEventListener("resize", updateWindow);
            document.body.removeEventListener("scroll", updateWindow);
        };
    }, []);

    return (
        <div
            className={`list-glow-item-borders ${className ? className : ""}`}
            style={style}
            onMouseMove={handleMouseMove}
            ref={listRef}
        >
            {list.map((item) => {
                return (
                    <ItemContainer
                        mousePos={mousePos}
                        windowChange={windowChange}
                        itemClassName={itemClassName}
                        key={item[uniqueKey]}
                    >
                        <CardComponent {...item} />
                    </ItemContainer>
                );
            })}
        </div>
    );
}

function ItemContainer({
    mousePos,
    windowChange,
    itemClassName,
    children,
}: {
    mousePos: IMousePos;
    windowChange: boolean;
    itemClassName?: string;
    children: ReactNode;
}) {
    const [cardRect, setCardRect] = useState<DOMRect | null>(null);
    const cardRef = useRef<HTMLDivElement | null>(null);

    // Update the bounding client when the window changes size or body scrolls
    // Otherwise the effect will be offset incorrectly
    useEffect(() => {
        if (cardRef.current) {
            setCardRect(cardRef.current.getBoundingClientRect());
        }
    }, [windowChange]);

    // Get left and top position for the card
    const left = cardRect?.left || 0;
    const top = cardRect?.top || 0;

    // Calculate and set the updated position for the radial gradient
    const style = {
        "--mouse-x": `${mousePos.x - left}px`,
        "--mouse-y": `${mousePos.y - top}px`,
    } as CSSProperties;

    return (
        <div
            className={`lgib-item-container ${itemClassName ? itemClassName : ""}`}
            style={style}
            ref={cardRef}
        >
            <div className="lgib-item-container__wrapper">{children}</div>
        </div>
    );
}
