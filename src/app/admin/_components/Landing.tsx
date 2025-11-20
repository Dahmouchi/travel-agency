/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-toastify";
import {
  GetFAQ,
  GetNavItems,
  saveLandingConfig,
  saveNavbarItems,
  saveOmrahImage,
} from "@/actions/saveLandingConfig";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { Faq, NavbarItem } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Settings,
  Image as ImageIcon,
  Type,
  Layout,
  Navigation,
  CheckCircle,
  AlertCircle,
  Upload,
  Grip,
  Monitor,
  Smartphone,
  Tablet,
  Palette,
  Globe,
  Home,
  Search,
  Star,
  Users,
  MessageSquare,
  Calendar,
  Shield,
  Heart,
  Menu,
  FileQuestion,
  Box,
  Globe2Icon,
} from "lucide-react";
import FaqDashboard from "./AddFaqForm";
import ConditionGenerale from "./condition";

// Icônes pour chaque section
const sectionIcons = {
  navbar: Menu,
  search: Search,
  hero: Home,
  thisMount: Star,
  national: Globe,
  omrah: Box,
  international: Globe,
  mesure: Users,
  reviews: MessageSquare,
  meeting: Calendar,
  expert: Shield,
  trust: Heart,
  discover: Palette,
  footer: Layout,
};

export default function ModernPageControl({
  initialData,
}: {
  initialData: any;
}) {
  const [sections, setSections] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [cardImage, setCardImage] = useState<File[] | null>(null);
  const [cardImageOmrah, setCardImageOmrah] = useState<File[] | null>(null);

  const [imagePreview, setImagePreview] = useState<string>(
    initialData.imageHero
  );
    const [imagePreviewOmrah, setImagePreviewOmrah] = useState<string>(
    initialData.imageOmrah
  );
  const [navbarItems, setNavbarItems] = useState<NavbarItem[]>([]);
  const [faq, setFaq] = useState<Faq[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("content");

  const [previewMode, setPreviewMode] = useState("desktop");

  useEffect(() => {
    if (cardImage && cardImage.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        
      };
      reader.readAsDataURL(cardImage[0]);
      setHasChanges(true);
    }
     if (cardImageOmrah && cardImageOmrah.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviewOmrah(e.target?.result as string);
      };
      reader.readAsDataURL(cardImageOmrah[0]);
      setHasChanges(true);
    }
  }, [cardImage,cardImageOmrah]);

  useEffect(() => {
    async function fetchNavbarItems() {
      const response = await GetNavItems();
      const responses = await GetFAQ();
      const data = response.data;
      const datas = responses.data;
      setNavbarItems(data);
      setFaq(datas);
      setIsLoading(false);
    }
    fetchNavbarItems();
  }, []);

  const handleToggleVisibility = (id: string) => {
    setNavbarItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, isVisible: !item.isVisible } : item
      )
    );
  };

  const handleOrderChange = (id: string, value: number) => {
    setNavbarItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, order: value } : item
      )
    );
  };

  const handleSaveitems = async () => {
    setIsLoading(true);
    const res = await saveNavbarItems(navbarItems);
    if (res.success) {
      toast.success("Navigation mise à jour avec succès");
      setIsLoading(false);
    }
  };

  const handleToggle = (sectionName: string, enabled: boolean) => {
    setSections((prev: any) => ({ ...prev, [sectionName]: enabled }));
    setHasChanges(true);
  };

  const handleTextChange = (fieldName: string, value: string) => {
    setSections((prev: any) => ({
      ...prev,
      [fieldName]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveLandingConfig(sections, cardImage);
      toast.success("Modifications sauvegardées avec succès!");
      setHasChanges(false);
      if (cardImage && cardImage.length > 0) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(cardImage[0]);
      }
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };
 const handleSaveOmrah = async () => {
    setIsSaving(true);
    try {
      await saveOmrahImage(sections, cardImageOmrah);
      toast.success("Modifications sauvegardées avec succès!");
      setHasChanges(false);
      if (cardImageOmrah && cardImageOmrah.length > 0) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(cardImageOmrah[0]);
      }
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };
  const handleReload = () => {
    setSections(initialData);
    setCardImage(null);
    setImagePreview(initialData.imageHero);
    setHasChanges(false);
    toast.info("Modifications annulées");
  };

  // Animations variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#6EC207]"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header avec actions */}
        <motion.div
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 bg-white rounded-2xl p-6 shadow-sm border"
          variants={cardVariants}
        >
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestion de la Page d&apos;Accueil
            </h1>
            <p className="text-gray-600">
              Personnalisez le contenu et l&apos;apparence de votre page
              d&apos;atterrissage
            </p>
            {hasChanges && (
              <Badge
                variant="secondary"
                className="mt-2 bg-orange-100 text-orange-800"
              >
                <AlertCircle className="w-3 h-3 mr-1" />
                Modifications non sauvegardées
              </Badge>
            )}
          </div>
        </motion.div>

        {/* Onglets principaux */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 bg-[#8EBD22] rounded-sm p-1 shadow-sm">
            <TabsTrigger
              value="content"
              className={`flex items-center space-x-2 ${activeTab === "content" ? "text-slate-800" : "text-white"}`}
            >
              <Type className="w-4 h-4" />
              <span>Contenu</span>
            </TabsTrigger>
            <TabsTrigger
              value="layout"
              className={`flex items-center space-x-2 ${activeTab === "layout" ? "text-slate-800" : "text-white"}`}
            >
              <Layout className="w-4 h-4" />
              <span>Mise en page</span>
            </TabsTrigger>
            <TabsTrigger
              value="navigation"
              className={`flex items-center space-x-2 ${activeTab === "navigation" ? "text-slate-800" : "text-white"}`}
            >
              <Navigation className="w-4 h-4" />
              <span>Navigation</span>
            </TabsTrigger>
          </TabsList>

          {/* Onglet Contenu */}
          <TabsContent value="content" className="space-y-6">
            <motion.div variants={cardVariants}>
              <Card className="shadow-sm border-0 bg-white">
                <CardHeader className="pb-4 flex items-center justify-between lg:flex-row flex-col">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <ImageIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Section Hero</CardTitle>
                      <CardDescription>
                        Configurez l&apos;image et les textes de votre section
                        principale
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Sélecteur de mode d'aperçu */}

                    <Button
                      variant="outline"
                      onClick={handleReload}
                      disabled={!hasChanges || isSaving}
                      className="flex items-center space-x-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Annuler</span>
                    </Button>

                    <Button
                      onClick={handleSave}
                      disabled={!hasChanges || isSaving}
                      className="bg-[#6EC207] hover:bg-[#5BA906] text-white flex items-center space-x-2"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Sauvegarde...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Sauvegarder</span>
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Upload d'image avec aperçu */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-gray-700">
                        Image Hero
                      </Label>
                      <FileUploader
                        value={cardImage}
                        onValueChange={setCardImage}
                        dropzoneOptions={{
                          maxFiles: 1,
                          maxSize: 10 * 1024 * 1024,
                          accept: {
                            "image/*": [".jpg", ".jpeg", ".png", ".gif"],
                          },
                        }}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                        orientation="vertical"
                      >
                        <FileInput className="text-center">
                          <div className="flex flex-col items-center space-y-2">
                            <Upload className="w-8 h-8 text-gray-400" />
                            <p className="text-sm text-gray-600">
                              Glissez votre image ici ou cliquez pour parcourir
                            </p>
                            <p className="text-xs text-gray-400">
                              PNG, JPG, GIF jusqu&apos;à 10MB
                            </p>
                          </div>
                        </FileInput>

                        <FileUploaderContent className="mt-4">
                          {cardImage?.map((file, index) => (
                            <FileUploaderItem
                              key={index}
                              index={index}
                              className="bg-white rounded-lg p-3 border"
                            >
                              <span className="truncate max-w-[200px] text-sm">
                                {file.name}
                              </span>
                            </FileUploaderItem>
                          ))}
                        </FileUploaderContent>
                      </FileUploader>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-gray-700">
                        Aperçu
                      </Label>
                      <div className="aspect-video relative rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-100">
                        <img
                          src={imagePreview}
                          alt="Aperçu Hero"
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute top-0 w-full h-full flex items-center text-center justify-center">
                          <div>
                            <h1 className="text-white font-semibold text-2xl">
                              {sections?.titleHero}
                            </h1>
                            <h1 className="text-white font-bold text-4xl">
                              {sections?.subTitleHero}
                            </h1>
                            <h1 className="text-white font-semibold text-sm">
                              {sections?.subTitleHero1}
                            </h1>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Champs de texte */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        id: "titleHero",
                        label: "Titre Principal",
                        placeholder: "Entrez le titre principal",
                      },
                      {
                        id: "subTitleHero",
                        label: "Sous-titre 1",
                        placeholder: "Premier sous-titre",
                      },
                      {
                        id: "subTitleHero1",
                        label: "Sous-titre 2",
                        placeholder: "Deuxième sous-titre",
                      },
                      {
                        id: "thisMountText",
                        label: "Description Voyage du Mois",
                        placeholder: "Description du voyage",
                      },
                      {
                        id: "nationalTitle",
                        label: "Titre National",
                        placeholder: "Description section nationale",
                      },
                      {
                        id: "nationalText",
                        label: "Description National",
                        placeholder: "Description section nationale",
                      },
                      {
                        id: "internationalTitle",
                        label: "Titre International",
                        placeholder: "Description section nationale",
                      },
                      {
                        id: "internationalText",
                        label: "Description International",
                        placeholder: "Description section internationale",
                      },
                      {
                        id: "discoverTitle",
                        label: "Titre Découvrir le Maroc",
                        placeholder: "Titre section découvrir le maroc",

                      },
                      {
                        id: "discoverSubtitle",
                        label: "Description Découvrir le Maroc",
                        placeholder: "Description section découvrir le maroc",  
                      },
                    ].map((field) => (
                      <div key={field.id} className="space-y-2">
                        <Label
                          htmlFor={field.id}
                          className="text-sm font-medium text-gray-700"
                        >
                          {field.label}
                        </Label>
                        <Input
                          id={field.id}
                          value={sections?.[field.id] || ""}
                          onChange={(e) =>
                            handleTextChange(field.id, e.target.value)
                          }
                          placeholder={field.placeholder}
                          className="border-gray-300 focus:border-[#6EC207] focus:ring-[#6EC207]"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="my-2 p-4">
                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-gray-700">
                        Image Omrah
                      </Label>
                      <FileUploader
                        value={cardImageOmrah}
                        onValueChange={setCardImageOmrah}
                        dropzoneOptions={{
                          maxFiles: 1,
                          maxSize: 10 * 1024 * 1024,
                          accept: {
                            "image/*": [".jpg", ".jpeg", ".png", ".gif"],
                          },
                        }}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                        orientation="vertical"
                      >
                        <FileInput className="text-center">
                          <div className="flex flex-col items-center space-y-2">
                            <Upload className="w-8 h-8 text-gray-400" />
                            <p className="text-sm text-gray-600">
                              Glissez votre image ici ou cliquez pour parcourir
                            </p>
                            <p className="text-xs text-gray-400">
                              PNG, JPG, GIF jusqu&apos;à 10MB
                            </p>
                          </div>
                        </FileInput>

                        <FileUploaderContent className="mt-4">
                          {cardImageOmrah?.map((file, index) => (
                            <FileUploaderItem
                              key={index}
                              index={index}
                              className="bg-white rounded-lg p-3 border"
                            >
                              <span className="truncate max-w-[200px] text-sm">
                                {file.name}
                              </span>
                            </FileUploaderItem>
                          ))}
                        </FileUploaderContent>
                      </FileUploader>
                    </div>
                     <div className="space-y-4">
                      <Label className="text-sm font-medium text-gray-700">
                        Aperçu
                      </Label>
                      <div className="aspect-video h-[300px] w-full relative rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-100">
                        <img
                          src={imagePreviewOmrah}
                          alt="Aperçu Hero"
                          className="object-cover w-full h-full"
                        />
                       
                      </div>
                    </div>
                      <Button
                      onClick={handleSaveOmrah}
                      
                      className="bg-[#6EC207] hover:bg-[#5BA906] text-white flex items-center space-x-2"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Sauvegarde...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Sauvegarder</span>
                        </>
                      )}
                    </Button>
                   
              </Card>
              <FaqDashboard />
              <ConditionGenerale section={sections}/>
            </motion.div>
          </TabsContent>

          {/* Onglet Mise en page */}
          <TabsContent value="layout" className="space-y-6">
            <motion.div variants={cardVariants}>
              <Card className="shadow-sm border-0 bg-white">
                <CardHeader className="pb-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Layout className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        Sections de la Page
                      </CardTitle>
                      <CardDescription>
                        Activez ou désactivez les sections de votre page
                        d&apos;accueil
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Sélecteur de mode d'aperçu */}

                    <Button
                      variant="outline"
                      onClick={handleReload}
                      disabled={!hasChanges || isSaving}
                      className="flex items-center space-x-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Annuler</span>
                    </Button>

                    <Button
                      onClick={handleSave}
                      disabled={!hasChanges || isSaving}
                      className="bg-[#6EC207] hover:bg-[#5BA906] text-white flex items-center space-x-2"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Sauvegarde...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Sauvegarder</span>
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(sections)
                      .filter(([key]) =>
                        [
                          "navbar",
                          "search",
                          "hero",
                          "thisMount",
                          "national",
                          "international",
                          "mesure",
                          "reviews",
                          "meeting",
                          "omrah",
                          "discover",
                          "discover-morocco",
                          "expert",
                          "trust",
                          "footer",
                        ].includes(key)
                      )
                      .map(([sectionName, enabled]) => {
                        const Icon =
                          sectionIcons[
                            sectionName as keyof typeof sectionIcons
                          ] || Layout;
                        const sectionLabels: Record<string, string> = {
                          navbar: "Barre de Navigation",
                          search: "Recherche",
                          discover:"Découvrir le Maroc",
                          hero: "Section Hero",
                          thisMount: "Voyage du Mois",
                          national: "Section Nationale",
                          international: "Section Internationale",
                          mesure: "Section Mesures",
                          reviews: "Avis Clients",
                          meeting: "Section Rencontre",
                          expert: "Section Expert",
                          trust: "Section Confiance",
                          footer: "Pied de Page",
                          
                        };

                        return (
                          <motion.div
                            key={sectionName}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <SectionToggleCard
                              name={sectionName}
                              label={sectionLabels[sectionName] || sectionName}
                              enabled={enabled as boolean}
                              onToggle={handleToggle}
                              icon={Icon}
                            />
                          </motion.div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Onglet Navigation */}
          <TabsContent value="navigation" className="space-y-6">
            <motion.div variants={cardVariants}>
              <Card className="shadow-sm border-0 bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Navigation className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">
                          Configuration Navigation
                        </CardTitle>
                        <CardDescription>
                          Gérez l&apos;ordre et la visibilité des éléments de
                          navigation
                        </CardDescription>
                      </div>
                    </div>

                    <Button
                      onClick={handleSaveitems}
                      disabled={isLoading}
                      className="bg-[#6EC207] hover:bg-[#5BA906] text-white"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sauvegarde...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Sauvegarder Navigation
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {navbarItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border hover:shadow-sm transition-shadow duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <Grip className="w-4 h-4 text-gray-400 cursor-move" />
                          <Checkbox
                            checked={item.isVisible}
                            onCheckedChange={() =>
                              handleToggleVisibility(item.id)
                            }
                            className="data-[state=checked]:bg-[#6EC207] data-[state=checked]:border-[#6EC207]"
                          />
                        </div>

                        <div className="flex-1">
                          <Input
                            value={item.label}
                            onChange={(e) =>
                              setNavbarItems((prevItems) =>
                                prevItems.map((i) =>
                                  i.id === item.id
                                    ? { ...i, label: e.target.value }
                                    : i
                                )
                              )
                            }
                            className="border-gray-300 focus:border-[#6EC207] focus:ring-[#6EC207]"
                            placeholder="Libellé de navigation"
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Label className="text-sm text-gray-600">
                            Ordre:
                          </Label>
                          <Input
                            type="number"
                            value={item.order}
                            onChange={(e) =>
                              handleOrderChange(
                                item.id,
                                parseInt(e.target.value)
                              )
                            }
                            className="w-20 border-gray-300 focus:border-[#6EC207] focus:ring-[#6EC207]"
                            min="1"
                          />
                        </div>

                        <div className="flex items-center">
                          {item.isVisible ? (
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Visible
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="bg-gray-100 text-gray-600"
                            >
                              <EyeOff className="w-3 h-3 mr-1" />
                              Masqué
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}

// Composant pour les cartes de section
function SectionToggleCard({
  name,
  label,
  enabled,
  onToggle,
  icon: Icon,
}: {
  name: string;
  label: string;
  enabled?: boolean;
  onToggle: (name: string, enabled: boolean) => void;
  icon: any;
}) {
  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        enabled ? "border-[#6EC207] bg-green-50" : "border-gray-200 bg-white"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-lg ${
                enabled
                  ? "bg-[#6EC207] text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{label}</h3>
              <p
                className={`text-sm ${
                  enabled ? "text-green-600" : "text-gray-500"
                }`}
              >
                {enabled ? "Visible sur la page" : "Masqué de la page"}
              </p>
            </div>
          </div>

          <Switch
            checked={enabled}
            onCheckedChange={(checked) => onToggle(name, checked)}
            className="data-[state=checked]:bg-[#6EC207]"
          />
        </div>
      </CardContent>
    </Card>
  );
}
