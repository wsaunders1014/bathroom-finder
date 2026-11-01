import { Ref } from "react";

type SidePanelProps ={
    isOpen:boolean;
    controls: React.ReactNode;
    children: React.ReactNode;
    ref?: React.Ref<HTMLElement>;
}

export default function SidePanel({isOpen, controls, children, ref}:SidePanelProps){
    return (
        <aside className={" bg-white absolute z-[1000] w-3 top-0 h-dvh right-0 w-sm transition-transform duration-300 ease-in-out" + ((isOpen) ? " translate-x-0":" translate-x-full")} ref={ref}>
            <div className={"absolute right-full bottom-6 mr-3 flex flex-col gap-2"}>
                {controls}
            </div>
            <div>
                {children}
            </div>
        </aside>
    )
}