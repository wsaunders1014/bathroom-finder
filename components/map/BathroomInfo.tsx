import type { Bathroom } from "@/types/bathroom"
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
type BathroomInfoProps = {
    bathroom: Bathroom;
    onClose: () => void;
}
export default function BathroomInfo({bathroom, onClose}:BathroomInfoProps){
    return (
        <div className="">
            <div className="flex items-start justify-between gap-2">
                <strong>{bathroom.name}</strong>
                <Button type="button" variant="ghost" size="icon" aria-label="Close" onClick={onClose}>
                    <X />
                </Button>
            </div>
            <br />
            {bathroom.address || "Address not provided"}
            <br />
            Access: {bathroom.accessPolicy}
            <br />
        
            Entry: {bathroom.entryMethod}
            <div className="code-display">
                {bathroom.codes.map((code) => (
                    <div key={code.id}>
                        <div  className="code">Code: {code.code} — Unverified</div>
                        <button type="button" aria-label="upvote" className="code-vote upvote cursor" >&lt;</button>
                        <button type="button" aria-label="downvote" className="code-vote downvote cursor" >&gt;</button>
                    </div>
                ))}
                <div>
                    <button type="button">Submit New Code</button>
                </div>
            </div>
        </div>
    )
}