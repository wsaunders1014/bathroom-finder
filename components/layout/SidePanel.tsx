import { Ref } from "react";

type SidePanelProps ={
    isOpen:boolean;
    controls: React.ReactNode;
    children: React.ReactNode;
    ref?: React.Ref<HTMLElement>;
}

export default function SidePanel({isOpen, controls, children, ref}:SidePanelProps){
    return (
        <aside className={" bg-white absolute z-[1000] top-0 h-dvh right-0 w-110 max-w-full border-l border-line transition-transform duration-300 ease-in-out" + ((isOpen) ? " translate-x-0":" translate-x-full")} ref={ref}>
            {/* Full height so controls can sit at the top and bottom. pointer-events-none lets the
                empty middle of the column pass drags through to the map; each group turns them back on. */}
            <div className={"pointer-events-none absolute right-full top-0 bottom-0 mr-3 py-6 flex flex-col items-end justify-between"}>
                {controls}
            </div>
            {/* Scrolls here rather than on the aside, which would clip the controls hanging off its left edge. */}
            <div className="h-full overflow-y-auto p-4">
                {children}
            </div>
        </aside>
    )
}