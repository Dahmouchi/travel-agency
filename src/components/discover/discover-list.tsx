/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { archiveTourDiscover, unarchiveTourDiscover } from "@/actions/discover"
import { DiscoverItem } from "./discover-items"
import { toast } from "react-toastify"



export function DiscoverList({ programs }: any) {


  const handleArchive = async (program: any) => {
    console.log("Archive program:", program)
    if(program.archive){
      const res = await unarchiveTourDiscover(program.id);
      console.log("Unarchive response:", res);
      toast.success("Tour désarchivé avec succès");
    } else {
      const res = await archiveTourDiscover(program.id);
      console.log("Archive response:", res);
      toast.success("Tour archivé avec succès");  
    }
    // TODO: Implement archive logic (API call to backend)
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {programs?.map((program:any) => (
         <DiscoverItem key={program.id} program={program} onArchive={handleArchive} />
      ))}
    </div>
  )
}
