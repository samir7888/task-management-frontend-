import { Loader2 } from "lucide-react"

export const LoadingButton = ({ loadingText }: { loadingText: string }) => {
    return (
        <span className="flex items-center gap-2">

            {loadingText}
            <Loader2 className="w-4 h-4 animate-spin" />
        </span>
    )
}