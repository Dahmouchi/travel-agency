/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { startTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle2,
  MapPin,
  Clock,
  Users,
  Home,
  Zap,
  User,
  Plane,
  Map,
  Luggage,
  MapPinCheck,
} from "lucide-react";
import VideoModal from "@/components/VideoModal";
import ProjectSection from "../_components/project-section";
import CoordinatesSection from "../_components/coordinates-section";
import { createTravelRequest } from "@/actions/reservationsActions";
import { toast } from "react-toastify";

export default function VoyageSurMesurePage() {
  const [formData, setFormData] = useState({
    destination: "",
    departureDate: "",
    returnDate: "",
    isFlexible: "non",
    departureCity: "",
    needsTransport: "non",
    needsFlight: "non",
    adults: 12,
    children: 1,
    accommodationWishes: "",
    numberOfRooms: 1,
    accommodationCategory: "Standard",
    budget: 2975,
    duration: 10,
    title: "Mme",
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    destination: false,
  });

  const handleProjectChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field === "destination" && value) {
      setErrors((prev) => ({ ...prev, destination: false }));
    }
  };

  const handleCoordinatesChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate destination
    if (!formData.destination.trim()) {
      setErrors((prev) => ({ ...prev, destination: true }));
      return;
    }

    console.log("Form submitted:", formData);

    startTransition(async () => {
      const res = await createTravelRequest(formData);
      if (res.success) {
        toast.success("Demande envoyée avec succès !");
       setFormData({
          destination: "",
          departureDate: "",
          returnDate: "",
          isFlexible: "non",
          departureCity: "",
          needsTransport: "non",
          needsFlight: "non",
          adults: 1,
          children: 0,
          accommodationWishes: "",
          numberOfRooms: 1,
          accommodationCategory: "Standard",
          budget: 1000,
          duration: 7,
          title: "M.",
          firstName: "",
          lastName: "",
          email: "",
          countryCode: "France (+33)",
          phone: "",
          message: "",
        });
      } else {
        toast.error("Erreur lors de l’envoi de la demande.");
      }
    });
  };
  const benefits = [
    {
      icon: MapPin,
      title: "Voyager en toute liberté",
      description: "Selon vos envies, vos idées, vos passions",
    },
    {
      icon: Users,
      title: "Experts locaux",
      description: "Des spécialistes qui connaissent chaque destination",
    },
    {
      icon: Home,
      title: "Hébergements sélectionnés",
      description: "Du bivouac au luxe, selon vos préférences",
    },
    {
      icon: Clock,
      title: "Flexibilité totale",
      description: "Adaptez votre voyage à votre rythme",
    },
    {
      icon: Zap,
      title: "Réponse rapide",
      description: "Un spécialiste vous contactera sous 48h",
    },
  ];

  const steps = [
    {
      number: 1,
      title: "Votre destination",
      description:
        "Où voulez-vous aller ? Laissez-vous inspirer par nos destinations",
    },
    {
      number: 2,
      title: "Vos dates et transport",
      description: "Choisissez vos dates et indiquez vos besoins de transport",
    },
    {
      number: 3,
      title: "Vos préférences",
      description: "Hébergement, budget, nombre de voyageurs",
    },
    {
      number: 4,
      title: "Validez votre demande",
      description: "Vérifiez vos coordonnées et envoyez votre demande",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className="relative bg-gradient-to-b h-[60vh] from-white from-10% dark:from-darkmode bg-cover to-[#8ebd21] to-90% dark:to-darklight overflow-x-hidden"
        style={{
          backgroundImage:
            "url(https://images.pexels.com/photos/34260949/pexels-photo-34260949.jpeg)",
        }}
      >
        <div className="w-full h-full absolute top-0 bg-black/25 z-0"></div>
        <div className="w-full px-4 lg:px-8 z-50 relative text-center h-full flex flex-col justify-center items-center">
          <h1 className="text-4xl text-white lg:text-5xl font-bold mb-4">
            Voyage sur Mesure
          </h1>
          <p className="text-xl max-w-2xl text-white">
            Créez le voyage de vos rêves avec nos experts. Une expérience
            personnalisée, une aventure unique.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <div className="relative flex justify-center mb-24 -top-12 ">
        <div className=" w-[95%] lg:w-[90%]">
          <main className="bg-white p-5 md:p-12 shadow-2xl rounded-xl w-full">
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-6"
            >
              {/* Header with sections */}

              {/* Main Content Grid */}
              <div className="  ">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center">
                    <Plane className="w-5 h-5 text-gray-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Votre projet
                  </h2>
                </div>
                <ProjectSection
                  formData={formData}
                  errors={errors}
                  onChange={handleProjectChange}
                />

                <div>
                  <div className="flex items-center gap-3 mb-8 mt-12">
                    <div className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Vos coordonnées
                    </h2>
                  </div>
                  <CoordinatesSection
                    formData={formData}
                    onChange={handleCoordinatesChange}
                  />
                </div>
              </div>
              {/* Message Section */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    handleCoordinatesChange("message", e.target.value)
                  }
                  placeholder="Décrivez votre projet : les étapes et les activités souhaitées, ce que vous aimez, ce que vous n'aimez pas, le niveau de difficulté que vous souhaitez sur des programmes physiques, vos interrogations sur ce voyage..."
                  className="w-full h-32 p-4 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* Footer */}
              <div className="flex flex-col items-center gap-4">
                <p className="text-xs text-gray-600">*Champ obligatoire</p>
                <button
                  type="submit"
                  className="px-12 py-3 bg-[#8ebd21] hover:bg-yellow-500 text-white cursor-pointer font-bold rounded-full transition-colors"
                >
                  Valider votre demande
                </button>
              </div>
            </form>
          </main>
        </div>
      </div>
      {/* Spirit Section 
      <section className="py-16 lg:py-24 about-section">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                L&apos;esprit Happy Trip Sur-Mesure
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Voyager en toute liberté selon ses envies, ses idées, ses
                passions. Chez Happy Trip, nous croyons que chaque voyageur est
                unique et mérite un voyage qui lui ressemble.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Nos experts locaux connaissent chaque coin de nos destinations
                et sauront créer un programme qui correspond exactement à vos
                attentes.
              </p>
              <ul className="space-y-3">
                {benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="">
              <div className="about-image">
                <div className="img-1">
                  <img
                    src={
                      "https://images.pexels.com/photos/18778277/pexels-photo-18778277.jpeg"
                    }
                    alt=""
                  />
                  <VideoModal />
                </div>
                <div className="img-2">
                  <img
                    src={
                      "https://images.pexels.com/photos/21856204/pexels-photo-21856204.jpeg"
                    }
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>*/}

      {/* Steps Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center">
            Comment ça fonctionne ?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <Card
                key={step.number}
                className="p-6 text-center bg-[#f8ffef] rounded-none flex items-start gap-1"
              >
                <div className="w-12 h-12 bg-[#8EBD22] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

     
      <section className="w-full bg-[#eef5ec] py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-4xl md:text-5xl font-serif text-[#2c2c2c] mb-4 italic">
              L&apos;esprit Voyageurs du Monde
            </h2>
            <p className="text-base md:text-lg text-[#666] space-y-1">
              <span className="block">
                Voyager en toute liberté selon ses envies,
              </span>
              <span className="block text-[#8EBD22]">
                ses idées, ses passions
              </span>
              
            </p>
          </div>

          {/* Three Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-16">
            {/* Column 1: Où je veux */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-8">
                <Map className=" text-[#8EBD22] w-16 h-auto"/>
              </div>
              <h3 className="text-2xl md:text-3xl font-serif text-[#2c2c2c] mb-4 italic">
                Où je veux
              </h3>
              <p className="text-sm md:text-base text-[#666] leading-relaxed">
                250 conseillers spécialisés par pays et par régions : Amoureux
                du beach lamas à court d&apos;idées, les vours inspirent ou
                crèent un voyage ultra-personnalisé : étapes, hébergements,
                ateliers, rencontres…
              </p>
            </div>

            {/* Column 2: Quand je veux */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-8">
               <Luggage className=" text-[#8EBD22] w-16 h-auto"/>
              </div>
              <h3 className="text-2xl md:text-3xl font-serif text-[#2c2c2c] mb-4 italic">
                Quand je veux
              </h3>
              <p className="text-sm md:text-base text-[#666] leading-relaxed">
                À votre écoute : conseiller dédié, conciergerie francophone,
                assistance 24h/24, nos équipes vous suivent et adaptent en temps
                réel, pour un voyage à la fois libre et bien accompagné.
              </p>
            </div>

            {/* Column 3: Comme je veux */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-8">
                <MapPinCheck className=" text-[#8EBD22] w-16 h-auto" />
               
              </div>
              <h3 className="text-2xl md:text-3xl font-serif text-[#2c2c2c] mb-4 italic">
                Comme je veux
              </h3>
              <p className="text-sm md:text-base text-[#666] leading-relaxed">
                En famille, à deux, à dix, en road trip, en train, en bateau, en
                tour du monde, des voyages personnalisables à l&apos;envi,
                bordés de services malins, pour voyager avec toujours plus de
                fluidité.
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <button className="bg-[#8EBD22] hover:bg-[#678a13] text-white px-8 py-3 rounded-full text-base md:text-lg font-medium transition-colors">
              Faites créer votre voyage
            </button>
          </div>
        </div>
      </section>
      {/* Blog Preview Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-12">
            Blog Voyage sur Mesure
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((idx) => (
              <Card
                key={idx}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={`/travel-blog-destination-.jpg?height=300&width=400&query=travel blog destination ${idx}`}
                  alt="Blog post"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    Découvrez nos conseils de voyageurs
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Inspirez-vous de nos articles pour préparer votre voyage sur
                    mesure.
                  </p>
                  <Button variant="outline" className="w-full bg-transparent">
                    Lire l&apos;article
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
