/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function OmraSection({imageUrl}:{imageUrl:any}) {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Desktop: Banner with hover overlay */}
      <div className="hidden md:block">
        <div className="group relative overflow-hidden rounded-2xl shadow-xl">
          <img
            src={imageUrl || ""}
            className="h-auto w-full transition-transform duration-500 group-hover:scale-105"
            alt="عمرة مباركة"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
         <Link href="/voyage/omra">
          <Button size={"lg"} className="bg-[#8EBD22] cursor-pointer hover:bg-[#7BA91F] text-white shadow-md rounded-full px-10 py-4 text-xl transition-all duration-300 flex items-center gap-1">
              احجز الآن
            </Button></Link>
          </div>
        </div>
      </div>

      <div className="md:hidden space-y-4">
        <div className="overflow-hidden rounded-2xl shadow-xl">
          <img src="/umrahBannerH.jpg" className="h-auto w-full" alt="عمرة مباركة" />
        </div>
                 <Link href="/voyage/omra">

        <Button size="lg" className="w-full bg-[#8EBD22] cursor-pointer hover:bg-[#7BA91F] text-white shadow-md  text-xl py-6 h-auto font-bold" dir="rtl">
          احجز الآن
        </Button>
        </Link>
      </div>
    </div>
  )
}
