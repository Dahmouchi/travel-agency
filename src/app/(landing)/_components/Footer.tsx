/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { createNewsLetter } from "@/actions/saveLandingConfig";
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { toast } from "react-toastify";
import {
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Phone,
  Mail,
  MapPin,
  Award,
  Slash,
} from "lucide-react";
import { Category, Destination, Nature } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const Footer = ({
  voyage,
  nature,
}: {
  voyage?: Destination[];
  nature?: Nature[];
}) => {
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const form = e.target;
    const data = {
      prenom: form.prenom.value,
      nom: form.nom.value,
      email: form.email.value,
      phone: form.phone.value,
      message: form.message.value,
    };

    try {
      const res = await createNewsLetter(
        data.nom,
        data.prenom,
        data.email,
        data.phone,
        data.message,
      );
      if (res) {
        toast.success("Votre message a été envoyé");
      }
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'envoi du message.");
    }
  };

  // Données des médias sociaux
  const socialMediaLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: "https://www.facebook.com/happytripclub",
      color: "hover:text-blue-600",
      bgColor: "hover:bg-blue-50",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://www.instagram.com/happytripclub",
      color: "hover:text-pink-600",
      bgColor: "hover:bg-pink-50",
    },

    {
      name: "YouTube",
      icon: Youtube,
      url: "https://www.youtube.com/@happytrip6851",
      color: "hover:text-red-600",
      bgColor: "hover:bg-red-50",
    },
  ];

  return (
    <footer className="">
      <div>
        <div>
          <div className="w-full flex justify-center">
            <img
              src="/footer/happy-trip.png"
              alt="happy-trip logo"
              className="lg:max-w-3xl md:max-w-2xl max-w-[30vh]"
            />
          </div>
          <div className="relative flex flex-col items-center p-2 lg:p-4">
            <img
              src="/footer/mountain.png"
              alt="mountain"
              className="max-w-screen absolute bottom-0 z-0"
            />
            <div className="relative z-50 lg:w-[50%] w-full self-center rounded-2xl grid bg-[#D2E094] shadow-xl">
              <div className="flex flex-col items-left rounded-l-2xl lg:py-8 md:py-16 py-4 lg:pl-12 md:p-16 p-4">
                <div className="lg:text-5xl md:text-5xl text-2xl font-thin mb-2">
                  Newsletter
                </div>
                <p className="lg:text-[18px] md:text-[18px] text-[12px] font-medium my-1">
                  Besoin de conseil ? un projet de voyage, une question ?
                </p>
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col space-y-3 lg:mt-3 lg:mr-60 w-full"
                >
                  <div className="flex items-center lg:flex-row flex-col w-full gap-4">
                    <input
                      type="text"
                      name="prenom"
                      placeholder="Prénom"
                      required
                      className="rounded w-full bg-white p-2 text-black placeholder:text-gray-400 focus:border-lime-900 focus:outline-none focus:ring-2 focus:ring-lime-900"
                    />
                    <input
                      type="text"
                      name="nom"
                      placeholder="Nom"
                      required
                      className="rounded w-full bg-white p-2 text-black placeholder:text-gray-400 focus:border-lime-900 focus:outline-none focus:ring-2 focus:ring-lime-900"
                    />
                  </div>
                  <div className="gap-4 flex items-center lg:flex-row flex-col w-full">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      required
                      className="rounded w-full bg-white p-2 text-black placeholder:text-gray-400 focus:border-lime-900 focus:outline-none focus:ring-2 focus:ring-lime-900"
                    />
                    <input
                      type="phone"
                      name="phone"
                      placeholder="Téléphone"
                      required
                      className="rounded w-full bg-white p-2 text-black placeholder:text-gray-400 focus:border-lime-900 focus:outline-none focus:ring-2 focus:ring-lime-900"
                    />
                  </div>
                  <textarea
                    name="message"
                    placeholder="Votre message"
                    required
                    className="rounded bg-white p-2 text-black placeholder:text-gray-400 focus:border-lime-900 focus:outline-none focus:ring-2 focus:ring-lime-900"
                    rows={4}
                  />
                  <button
                    type="submit"
                    className="w-full cursor-pointer bg-green-800 text-white text-sm lg:text-lg p-2 rounded hover:bg-lime-900 transition-colors duration-300"
                  >
                    Envoyer
                  </button>
                </form>
              </div>
              <div className="invisible lg:visible md:invisible lg:flex hidden flex-col items-center absolute rounded-r-2xl -right-34 -mt-30">
                <img
                  src="/footer/flight.png"
                  alt=""
                  className="max-w-sm max-h-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#8EBD22] w-full pt-10 md:pt-10 lg:pt-10 pb-4 md:pb-4 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 lg:pr-20">
            {/* Logo Section */}
            <div className="flex justify-center md:justify-start lg:col-span-2">
              <div className="flex flex-col items-center bg-white rounded-2xl w-fit h-fit p-5 mb-8">
                <div className="w-32 h-28 relative">
                  <img
                    src="/footer/happy-trip-logo.png"
                    alt="logo"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Section Médias Sociaux */}
                <div className="mt-4 w-full">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 text-center">
                    Suivez-nous
                  </h4>
                  <div className="flex justify-center space-x-2">
                    {socialMediaLinks.map((social) => (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2 rounded-full text-gray-600 transition-all duration-300 ${social.color} ${social.bgColor} hover:scale-110`}
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                    <a
                      key="tiktok"
                      href="https://www.tiktok.com/@happytripclub"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-full text-gray-600 transition-all duration-300  hover:scale-110`}
                    >
                      <img
                        src="/icons/tik-tok.png"
                        alt=""
                        className="w-5 h-5"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Links Section */}
            <div className="col-span-1 md:col-span-2 lg:col-span-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* First column */}
                <div>
                  <ul>
                    <li className="py-1">
                      <a href="" className="text-xl text-white font-thin">
                        Accueil
                      </a>
                    </li>
                    <li className="py-1">
                      <a
                        href="/a-propos-de-nous"
                        className="underline text-white font-medium my-1 hover:text-gray-200 transition-colors duration-300"
                      >
                        Qui sommes-nous?
                      </a>
                    </li>
                    <li className="py-1">
                      <a
                        href="/contact"
                        className="underline text-white font-medium my-1 hover:text-gray-200 transition-colors duration-300"
                      >
                        Contactez-nous
                      </a>
                    </li>
                    <li className="py-1">
                      <a
                        href="/conditions-generales-de-vente"
                        className="underline text-white font-medium my-1 hover:text-gray-200 transition-colors duration-300"
                      >
                        Conditions générales de vente
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Second column 
                <div>
                  <ul>
                    <li className="py-1">
                      <a
                        href="/destination"
                        className="text-xl text-white font-thin"
                      >
                        Destinations
                      </a>
                    </li>
                    {voyage
                      ?.filter((voyage) => voyage.visible)
                      .map((voyage) => (
                        <li className="py-1" key={voyage.id}>
                          <a
                            href={`/destination/national?destinations=${voyage.id}`}
                            className="underline text-white font-medium my-1 hover:text-gray-200 transition-colors duration-300"
                          >
                            {voyage.name}
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>*/}

                {/* Third column 
                <div>
                  <ul>
                    <li className="py-1">
                      <a href="" className="text-xl text-white font-thin">
                        Activités
                      </a>
                    </li>
                    {nature
                      ?.filter((activity) => activity.visible)
                      .map((activity) => (
                        <li className="py-1" key={activity.id}>
                          <a
                            href={`/nature?natures=${activity.id}`}
                            className="underline text-white font-medium my-1 hover:text-gray-200 transition-colors duration-300"
                          >
                            {activity.name}
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>*/}

                {/* Fifth column - Contact */}
                <div>
                  <ul>
                    <li className="py-1">
                      <a
                        href="/contact"
                        className="text-xl text-white font-thin"
                      >
                        Contact Us
                      </a>
                    </li>
                    <li className="py-1">
                      <a
                        href="tel:+212628324880"
                        className="underline text-white font-medium my-1 hover:text-gray-200 transition-colors duration-300 flex items-center"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        (212) 628324880
                      </a>
                    </li>
                    <li className="py-1">
                      <a
                        href="mailto:happy.trip.voyage@gmail.com"
                        className="underline text-white font-medium my-1 hover:text-gray-200 transition-colors duration-300 flex items-center"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        happy.trip.voyage@gmail.com
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Paiement et Copyright */}
      <div className="bg-[#7BA91F] border-t border-[#6B9A1A] py-6 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            {/* Section Méthodes de Paiement */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-3">
                {/* Icônes de cartes de paiement avec fallback */}
                <div className="bg-white p-2 rounded-xl">
                  {" "}
                  <img
                    src="/icons/Visa_logo.png"
                    className="w-auto h-6"
                    alt=""
                  />
                </div>
                <div className="bg-white p-2 rounded-xl">
                  <img
                    src="/icons/Mastercard_logo.png"
                    className="w-auto h-6"
                    alt=""
                  />
                </div>
              </div>
            </div>

            {/* Section Certifications */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-white" />
                <span className="text-white text-sm">Agence certifiée</span>
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-white" />
                <span className="text-white text-sm">Rabat, Maroc</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-white text-sm">Kénitra, Maroc</span>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 pt-4 border-t border-[#6B9A1A] text-center">
            <p className="text-white text-sm">
              © {new Date().getFullYear()} Happy Trip. Tous droits réservés. |
              <Link
                href="politique-de-confidentialite"
                rel="noopener noreferrer"
                className="hover:text-gray-200 transition-colors duration-300 ml-1"
              >
                Politique de confidentialité |
              </Link>{" "}
              <Link
                href="/conditions-generales-de-vente"
                rel="noopener noreferrer"
                className="hover:text-gray-200 transition-colors duration-300 ml-1"
              >
                Conditions générales de vente
              </Link>{" "}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
