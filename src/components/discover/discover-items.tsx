/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Archive, Edit, CheckCircle2, XCircle, ArchiveRestore } from "lucide-react"
import SafeHTML from "../SafeHTML"
import { redirect } from "next/navigation"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"

export function DiscoverItem({ program, onArchive }: any) {
  return (
    <Card className="overflow-hidden pt-0 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="relative aspect-video overflow-hidden bg-muted group">
        <img
          src={program.imageUrl || "/placeholder.svg"}
          alt={program.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          {program.active ? (
            <Badge className="bg-green-500 hover:bg-green-600 gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Active
            </Badge>
          ) : (
            <Badge variant="destructive" className="gap-1">
              <XCircle className="w-3 h-3" />
              Inactive
            </Badge>
          )}
        </div>
      </div>

      <CardHeader className="flex-grow">
        <CardTitle className="text-xl">{program.title}</CardTitle>
        <CardDescription className="line-clamp-3">
          <SafeHTML html={program.description} />
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          {program.tour && (
            <div className="bg-muted p-2 rounded">
              <p className="text-muted-foreground text-xs font-semibold">Tour</p>
              <p className="font-medium truncate">{program.tour}</p>
            </div>
          )}
          {program.ville && (
            <div className="bg-muted p-2 rounded">
              <p className="text-muted-foreground text-xs font-semibold">Ville</p>
              <p className="font-medium truncate">{program.ville}</p>
            </div>
          )}
        </div>

        {/* Pricing and duration badges */}
        <div className="flex gap-2">
          <Badge variant="secondary">{program.durationDays} days</Badge>
          <Badge variant="outline">{program.priceOriginal} MAD</Badge>
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={() => redirect(`/admin/dashboard/discover-morocco/update/${program.id}`)} variant="default" size="sm" className="flex-1 cursor-pointer gap-2">
            <Edit className="w-4 h-4" />
            Update
          </Button>
          {!program.archive ? 
          <AlertDialog>
            <AlertDialogTrigger>
               <Button variant="outline" size="sm" className="flex-1 gap-2">
            <Archive className="w-4 h-4" />
            Archive
          </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <div className="p-4">
                <AlertDialogTitle>Confirm l archivation</AlertDialogTitle>
                <p className="mb-4">Are you sure you want to archive this tour?</p>
                <div className="flex justify-end gap-2">
                  <AlertDialogCancel>
                    Cancel
                  </AlertDialogCancel>
                  <Button onClick={() => onArchive?.(program)}>
                    Confirm archive
                  </Button>
                </div>
              </div>
            </AlertDialogContent>
          </AlertDialog>
          
          :
          <AlertDialog>
            <AlertDialogTrigger>
               <Button variant="outline" size="sm" className="flex-1 gap-2">
            <ArchiveRestore className="w-4 h-4" />
            unarchive
          </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <div className="p-4">
                <AlertDialogTitle>
                  Confirm Unarchive
                </AlertDialogTitle>
                <p className="mb-4">Are you sure you want to unarchive this tour?</p>
                <div className="flex justify-end gap-2">
                  <AlertDialogCancel >
                    Cancel
                  </AlertDialogCancel>
                  <Button onClick={() => onArchive?.(program)}>
                    Confirm Unarchive
                  </Button>
                </div>
              </div>
            </AlertDialogContent>
          </AlertDialog>
          }
        </div>
      </CardContent>
    </Card>
  )
}
