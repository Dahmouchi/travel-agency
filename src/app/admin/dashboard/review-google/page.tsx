/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/dashboard/blogs/page.tsx
"use client";
import { motion } from "framer-motion";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import {
  MoreVertical,
  Trash2,
  Edit,
  Plus,
  PlusCircle,
  Star,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { GoogleReview } from "@prisma/client";
import { toast } from "react-toastify";
import Loading from "@/components/Loading";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  createGoogleReview,
  deleteGoogleReview,
  getGoogleReview,
  updateGoogleReview,
} from "@/actions/googleReviews";
import { getLanding, saveGoogleAvieButton } from "@/actions/saveLandingConfig";
const formSchema = z.object({
  authorName: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  rating: z.number().min(1).max(5),
  originalText: z.number().min(1),
  text: z.string().optional(),
  profilePhotoUrl: z.any(),
  language: z.any(),
  time: z.string().datetime().optional(),
  status: z.boolean().default(true),
});

export default function BlogManagementPage() {
  const [blogs, setBlogs] = useState<GoogleReview[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<GoogleReview | null>(null);
  const [isEnabled, setIsEnabled] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileProfil, setSelectedFileProfil] = useState<File | null>(
    null
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      form.setValue("language", file);
    }
  };

  const handleFileChangeProfile = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFileProfil(file);
      form.setValue("profilePhotoUrl", file);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      authorName: "",
      rating: 5,
      originalText:1,
      text: "",
      profilePhotoUrl: null,
      language: null,
      time: new Date().toISOString(),
      status: true,
    },
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getGoogleReview();
        setBlogs(response);
        const resLanding = await getLanding();
        setIsEnabled(resLanding?.googleAvie);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blog.text && blog.text.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      formData.append("authorName", values.authorName);
      formData.append("text", values.text || "");
      formData.append("rating", values.rating.toString() || "5");
       formData.append("originalText", values.originalText.toString() || "1");
      formData.append("time", values.time || new Date().toISOString());
      formData.append("status", values.status.toString());
      if (selectedFile) {
        formData.append("language", selectedFile);
      }
      if (selectedFileProfil) {
        formData.append("profilePhotoUrl", selectedFileProfil);
      }
      // Use updateBlog for edits, createBlog for new posts
      if (currentBlog) {
        await updateGoogleReview(currentBlog.id, formData);
        toast.success("avie update with success");
        setIsDialogOpen(false);
      } else {
        const res = await createGoogleReview(formData);
        if (res.success) {
          toast.success("avie add with success");
        }
        setIsDialogOpen(false);
      }

      // Refresh blogs list
      const response = await getGoogleReview();
      setBlogs(response);
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error saving blog:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGoogleReview(id);
      setBlogs(blogs.filter((blog) => blog.id !== id));
      toast.info("Le commentaire supprimé avec succéss");
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const openEditDialog = (blog: GoogleReview) => {
    setCurrentBlog(blog);
    form.reset({
      authorName: blog.authorName,
      text: blog.text || "",
      rating: blog.rating || 5,
      time: blog.time ? new Date(blog.time).toISOString() : "",
      status: blog.status,
    });

    setIsDialogOpen(true);
  };
  const renderStars = (rating: any) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}`}
        />
      ));
  };

  const [expandedReviews, setExpandedReviews] = useState<
    Record<string, boolean>
  >({});

  const toggleExpand = (reviewId: string) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };
  const getInitialsAvatar = (fullName: string) => {
    // Split the name into parts
    const nameParts = fullName.trim().split(" ");

    // Get first letter of first name
    const firstNameInitial = nameParts[0] ? nameParts[0][0] : "";

    // Get first letter of last name (if exists)
    const lastNameInitial =
      nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : "";

    return `${firstNameInitial}${lastNameInitial}`;
  };

  const getRandomColor = () => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-yellow-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const openCreateDialog = () => {
    setCurrentBlog(null);
    form.reset({
      authorName: "",
      text: "",
      rating: 5,
      time: "",
      status: true,
    });
    setIsDialogOpen(true);
  };
 const formatRelativeTime = (inputDate: string | Date): string => {
    // Convert input to Date object if it's a string
    const date =
      typeof inputDate === "string" ? new Date(inputDate) : inputDate;
    const now = new Date();

    // Calculate time difference in seconds
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // Define time intervals in seconds
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    // Calculate time passed for each interval
    if (diffInSeconds >= intervals.year) {
      const years = Math.floor(diffInSeconds / intervals.year);
      return `${years}${years === 1 ? " années" : " années"}`;
    }
    if (diffInSeconds >= intervals.month) {
      const months = Math.floor(diffInSeconds / intervals.month);
      return `${months}${months === 1 ? " mois" : " mois"}`;
    }
    if (diffInSeconds >= intervals.week) {
      const weeks = Math.floor(diffInSeconds / intervals.week);
      return `${weeks}${weeks === 1 ? " semaines" : " semaines"}`;
    }
    if (diffInSeconds >= intervals.day) {
      const days = Math.floor(diffInSeconds / intervals.day);
      return `${days}${days === 1 ? " jours" : " jours"}`;
    }
    if (diffInSeconds >= intervals.hour) {
      const hours = Math.floor(diffInSeconds / intervals.hour);
      return `${hours}${hours === 1 ? "h" : "h"}`;
    }
    if (diffInSeconds >= intervals.minute) {
      const minutes = Math.floor(diffInSeconds / intervals.minute);
      return `${minutes}${minutes === 1 ? "m" : "m"}`;
    }

    return "Just now";
  };
  const handleToggle = async (newValue: boolean) => {
    setLoading(true);
    try {
      const res = await saveGoogleAvieButton(newValue);
      if (res.success) {
        toast.success("Modifié");
        setIsEnabled(newValue);
      } else {
        toast.error("Échec de la modification");
      }
    } catch (error) {
      console.error("Failed to update Google Avie visibility", error);
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Header with search and add button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold">Gestion les avis de Google</h1>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <label htmlFor="googleAvie" className="text-sm">
              Voir Google Bouton
            </label>
            <Switch
              id="googleAvie"
              checked={isEnabled}
              onCheckedChange={handleToggle}
              disabled={loading}
            />
            <Input
              placeholder="Search avis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={openCreateDialog}
                  className="flex items-center gap-2 bg-green-600 hover:bg-emerald-600 cursor-pointer"
                >
                  <PlusCircle className="w-5 h-5" />
                  Ajouter un avis Google
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-5xl">
                <DialogHeader>
                  <DialogTitle>
                    {currentBlog ? "Edit Avis" : "Create New Avis"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-6"
                    encType="multipart/form-data"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="authorName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom de l&apos;auteur*</FormLabel>

                              <FormControl>
                                <Input placeholder="Titre du blog" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="language"
                          render={() => (
                            <FormItem>
                              <FormLabel>Photo Profil</FormLabel>
                              <FormDescription>
                                Téléchargez une image pour le profil
                              </FormDescription>
                              <FormControl>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileChangeProfile}
                                  className="block w-full text-sm text-gray-500
                                                      file:mr-4 file:py-2 file:px-4
                                                      file:rounded-md file:border-0
                                                      file:text-sm file:font-semibold
                                                      file:bg-blue-50 file:text-blue-700
                                                      hover:file:bg-blue-100"
                                />
                              </FormControl>
                              {selectedFileProfil && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  Fichier sélectionné : {selectedFileProfil.name}
                                </p>
                              )}
                              {currentBlog?.profilePhotoUrl && !selectedFile && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  Image actuelle : {currentBlog.profilePhotoUrl}
                                </p>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="rating"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Note (1-5)*</FormLabel>

                              <FormControl>
                                <Input
                                  placeholder="Titre du blog"
                                  {...field}
                                  type="number"
                                  min="1"
                                  max="5"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="text"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Commentaire</FormLabel>

                              <FormControl>
                                <Textarea
                                  placeholder="Contenu de l'avis"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date de l&apos;avis</FormLabel>

                              <FormControl>
                                <Input {...field} type="datetime-local" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="language"
                          render={() => (
                            <FormItem>
                              <FormLabel>Image du commentaire</FormLabel>
                              <FormDescription>
                                Téléchargez une image 
                              </FormDescription>
                              <FormControl>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                  className="block w-full text-sm text-gray-500
                                                      file:mr-4 file:py-2 file:px-4
                                                      file:rounded-md file:border-0
                                                      file:text-sm file:font-semibold
                                                      file:bg-blue-50 file:text-blue-700
                                                      hover:file:bg-blue-100"
                                />
                              </FormControl>
                              {selectedFile && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  Fichier sélectionné : {selectedFile.name}
                                </p>
                              )}
                              {currentBlog?.language && !selectedFile && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  Image actuelle : {currentBlog.language}
                                </p>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel>Statut</FormLabel>
                                <FormDescription>
                                  Publier ou dépublier le commentaire
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="originalText"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre d&apos;avis</FormLabel>

                              <FormControl>
                                <Input
                                  placeholder="Nombre d'avis"
                                  {...field}
                                  type="number"
                                 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Annuler
                      </Button>
                      <Button type="submit">
                        {currentBlog ? "Update" : "Create"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Blog List */}
        {isLoading ? (
          <Loading />
        ) : filteredBlogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              {searchTerm ? "No matching blogs found" : "No blogs available"}
            </p>
            {!searchTerm && (
              <Button onClick={openCreateDialog} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Créez votre premier blog
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((review: any) => {
              const shouldShowMore = review.text.length > 150;
              const displayText = expandedReviews[review.id]
                ? review.text
                : review.text.slice(0, 150);

              return (
                <div key={review.id}>
                  <motion.div
                    className="bg-white text-slate-700 p-4 rounded-lg mb-4 shadow-lg h-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Header avec avatar et infos utilisateur */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {
                          review.profilePhotoUrl ? 
                          <img src={`${review?.profilePhotoUrl}`} alt="" className="h-10 w-10 rounded-full"/> 
                          : 
                          <div
                                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${getRandomColor()}`}
                                    >
                                      {getInitialsAvatar(review.authorName)}
                                    </div>
                        }
                        <div>
                          <h3 className="font-medium text-black text-sm">
                            {review.authorName}
                          </h3>
                          <div className="flex items-center text-gray-400 text-xs space-x-1">
                            <span>{review.originalText || 1} avis</span>
                          </div>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {/* Edit Option */}
                          <DropdownMenuItem
                            onClick={() => openEditDialog(review)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>

                          {/* Delete Option with Confirmation Dialog */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                onSelect={(e) => e.preventDefault()} // Empêche la fermeture immédiate
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Êtes-vous absolument sûr ?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action est irréversible. Cela supprimera
                                  définitivement ce blog.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => handleDelete(review.id)}
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Rating et date */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-gray-400 text-sm">
                          {formatRelativeTime(review.time)}
                        </span>
                      </div>
                    </div>

                    {/* Texte de l'avis */}
                    <div className="mb-4">
                      <p className="text-gray-800 text-sm leading-relaxed">
                        {displayText}
                        {shouldShowMore && !expandedReviews[review.id] && (
                          
                          <button
                            onClick={() =>{ toggleExpand(review.id)}}
                            className="text-blue-400 hover:text-blue-300 ml-1 font-medium"
                          >
                            Plus
                          </button>
                        )}
                        {expandedReviews[review.id] && shouldShowMore && (
                          <button
                            onClick={() => toggleExpand(review.id)}
                            className="text-blue-400 hover:text-blue-300 ml-1 font-medium"
                          >
                            Moins
                          </button>
                        )}
                      </p>
                    </div>
                   {review.language &&  <img src={review?.language} alt="" className="w-full h-40 rounded-2xl"/>}
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const GoogleMapsReview = ({ review }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const renderStars = (rating: any) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}`}
        />
      ));
  };

  const shouldShowMore = review.text.length > 150;
  const displayText = isExpanded ? review.fullText : review.text;

  return (
    <motion.div
      className="bg-white text-slate-700 p-4 rounded-lg mb-4 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header avec avatar et infos utilisateur */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img
            src={review.authorAvatar}
            alt={review.authorName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-medium text-black text-sm">
              {review.authorName}
            </h3>
            <div className="flex items-center text-gray-400 text-xs space-x-1">
              <span>{review.reviewCount} avis</span>
              {review.photoCount > 0 && (
                <>
                  <span>·</span>
                  <span>{review.photoCount} photos</span>
                </>
              )}
            </div>
          </div>
        </div>

        <button className="text-gray-400 hover:text-white transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Rating et date */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            {renderStars(review.rating)}
          </div>
          <span className="text-gray-400 text-sm">{review.timeAgo}</span>
          {review.isNew && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
              Nouveau
            </span>
          )}
        </div>
      </div>

      {/* Texte de l'avis */}
      <div className="mb-4">
        <p className="text-gray-800 text-sm leading-relaxed">
          {displayText}
          {shouldShowMore && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-blue-400 hover:text-blue-300 ml-1 font-medium"
            >
              Plus
            </button>
          )}
          {isExpanded && shouldShowMore && (
            <button
              onClick={() => setIsExpanded(false)}
              className="text-blue-400 hover:text-blue-300 ml-1 font-medium flex items-center"
            >
              Moins
            </button>
          )}
        </p>
      </div>

      {/* Photos */}
      {review.photos && review.photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {review.photos.map((photo: any, index: any) => (
            <motion.div
              key={index}
              className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedPhoto(photo)}
            >
              <img
                src={photo}
                alt={`Photo ${index + 1} de ${review.authorName}`}
                className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-200"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox pour les photos */}
      {selectedPhoto && (
        <motion.div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedPhoto(null)}
        >
          <motion.img
            src={selectedPhoto}
            alt="Photo agrandie"
            className="max-w-full max-h-full object-contain"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
          >
            ×
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};
