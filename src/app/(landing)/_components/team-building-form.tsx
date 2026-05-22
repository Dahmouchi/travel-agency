/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState, startTransition } from "react";
import { Briefcase, User } from "lucide-react";
import { toast } from "react-toastify";
import { createEventForm } from "@/actions/team-building";

const TeamBuildingFomr = () => {
  const [formData, setFormData] = useState({
    // Vous
    company: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    eventType: "",
    participants: "",
    projectDescription: "",

    // Dates
    departureDate: "",
    returnDate: "",
    dateFlexibility: "non",
    dateComments: "",

    // Hébergement
    accommodationLevel: "Milieu de gamme",
    hasAccommodation: "oui",
    roomType: "Double",
    hasMeetingRoom: "oui",
    accommodationComments: "",

    // Destination & Transport
    destination: "",
    hasTransport: "oui",
    departureCity: "",

    // Activités
    activities: [] as string[],
    activitiesComments: "",

    // Enjeux
    objectives: [] as string[],
    objectivesComments: "",

    // Réunion
    halfDays: "0",

    // Budget
    budgetPerPerson: "",
    budgetComments: "",

    // Contact
    contactPreference: "Email",

    // Message global
    message: "",
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(value)
        ? (prev[field as keyof typeof prev] as string[]).filter(
            (item) => item !== value,
          )
        : [...(prev[field as keyof typeof prev] as string[]), value],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Example validation: required fields
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.destination.trim()
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires !");
      return;
    }

    console.log("Event form submitted:", formData);

    startTransition(async () => {
      const res = await createEventForm(formData);
      if (res.success) {
        toast.success("Formulaire envoyé avec succès !");
        setFormData({
          // Vous
          company: "",
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          eventType: "",
          participants: "",
          projectDescription: "",

          // Dates
          departureDate: "",
          returnDate: "",
          dateFlexibility: "non",
          dateComments: "",

          // Hébergement
          accommodationLevel: "Milieu de gamme",
          hasAccommodation: "oui",
          roomType: "Double",
          hasMeetingRoom: "oui",
          accommodationComments: "",

          // Destination & Transport
          destination: "",
          hasTransport: "oui",
          departureCity: "",

          // Activités
          activities: [],
          activitiesComments: "",

          // Enjeux
          objectives: [],
          objectivesComments: "",

          // Réunion
          halfDays: "0",

          // Budget
          budgetPerPerson: "",
          budgetComments: "",

          // Contact
          contactPreference: "Email",

          // Message global
          message: "",
        });
      } else {
        toast.error("Erreur lors de l’envoi du formulaire.");
      }
    });
  };
  const activities = [
    "Voyage",
    "Découverte",
    "Détente",
    "Cohésion d'équipe / team building",
    "Séminaire",
    "Festives",
    "Sportives",
    "Culturelles",
    "Dîner de gala",
  ];

  const objectives = [
    "Fédérer",
    "Motiver",
    "Récompenser",
    "Travailler",
    "Décompression",
    "Intégration",
    "Détente",
    "Passer un message",
  ];

  return (
    <main className="relative -top-20 z-50">
      <form
        onSubmit={handleSubmit}
        className="max-w-[95%] relative border-4 border-[#8EBD22] lg:max-w-[90%] bg-white mx-auto shadow-lg p-4 lg:p-8 md:p-12 rounded-xl"
      >
        {/* Header Sections */}
        <div className="absolute top-4 right-4">
          <img
            src="/images/chape3.png"
            alt=""
            className="lg:w-24 w-14 h-auto"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Vous</h2>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Left Column - Project Details */}
          <div className="space-y-8">
            {/* Vous Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 bg-[#8EBD22] w-fit px-4 rounded-full ">
                Informations
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Société / Association *
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleChange("company", e.target.value)}
                    className="w-full px-0 py-2 border-b border-gray-300 text-gray-900 focus:outline-none focus:border-yellow-400 focus:ring-0"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleChange("firstName", e.target.value)
                      }
                      className="w-full px-0 py-2 border-b border-gray-300 text-gray-900 focus:outline-none focus:border-yellow-400 focus:ring-0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      Nom *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      className="w-full px-0 py-2 border-b border-gray-300 text-gray-900 focus:outline-none focus:border-yellow-400 focus:ring-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full px-0 py-2 border-b border-gray-300 text-gray-900 focus:outline-none focus:border-yellow-400 focus:ring-0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full px-0 py-2 border-b border-gray-300 text-gray-900 focus:outline-none focus:border-yellow-400 focus:ring-0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Type d&apos;événement *
                  </label>
                  <input
                    type="text"
                    value={formData.eventType}
                    onChange={(e) => handleChange("eventType", e.target.value)}
                    className="w-full px-0 py-2 border-b border-gray-300 text-gray-900 focus:outline-none focus:border-yellow-400 focus:ring-0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Nombre de participants *
                  </label>
                  <input
                    type="number"
                    value={formData.participants}
                    onChange={(e) =>
                      handleChange("participants", e.target.value)
                    }
                    className="w-full px-0 py-2 border-b border-gray-300 text-gray-900 focus:outline-none focus:border-yellow-400 focus:ring-0"
                  />
                </div>
              </div>
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Votre projet en quelques mots *
              </label>
              <textarea
                value={formData.projectDescription}
                onChange={(e) =>
                  handleChange("projectDescription", e.target.value)
                }
                className="w-full h-24 p-3 border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {/* Dates */}
            <div>
              <h3 className="text-lg font-semibold bg-[#8EBD22] w-fit px-4 rounded-full text-white mb-4">
                Dates de séjour
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Date de départ *
                  </label>
                  <input
                    type="date"
                    value={formData.departureDate}
                    onChange={(e) =>
                      handleChange("departureDate", e.target.value)
                    }
                    className="w-full px-0 py-2 border-b border-gray-300 text-gray-900 focus:outline-none focus:border-yellow-400 focus:ring-0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Date de retour *
                  </label>
                  <input
                    type="date"
                    value={formData.returnDate}
                    onChange={(e) => handleChange("returnDate", e.target.value)}
                    className="w-full px-0 py-2 border-b border-gray-300 text-gray-900 focus:outline-none focus:border-yellow-400 focus:ring-0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Flexibilité sur les dates *
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="oui"
                        checked={formData.dateFlexibility === "oui"}
                        onChange={(e) =>
                          handleChange("dateFlexibility", e.target.value)
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-900">Oui</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="non"
                        checked={formData.dateFlexibility === "non"}
                        onChange={(e) =>
                          handleChange("dateFlexibility", e.target.value)
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-900">Non</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Commentaires
                  </label>
                  <textarea
                    value={formData.dateComments}
                    onChange={(e) =>
                      handleChange("dateComments", e.target.value)
                    }
                    className="w-full h-20 p-3 border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>
            </div>

            {/* Hébergement */}
            <div>
              <h3 className="text-lg font-semibold bg-[#8EBD22] w-fit px-4 rounded-full text-white mb-4">
                Hébergement
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Gamme d&apos;hébergement *
                  </label>
                  <select
                    value={formData.accommodationLevel}
                    onChange={(e) =>
                      handleChange("accommodationLevel", e.target.value)
                    }
                    className="w-full px-0 py-2 border-b border-gray-300 text-gray-900 focus:outline-none focus:border-yellow-400 focus:ring-0"
                  >
                    <option>Économique</option>
                    <option>Milieu de gamme</option>
                    <option>Haut de gamme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Hébergement *
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="oui"
                        checked={formData.hasAccommodation === "oui"}
                        onChange={(e) =>
                          handleChange("hasAccommodation", e.target.value)
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-900">Oui</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="non"
                        checked={formData.hasAccommodation === "non"}
                        onChange={(e) =>
                          handleChange("hasAccommodation", e.target.value)
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-900">Non</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Nature des chambres *
                  </label>
                  <select
                    value={formData.roomType}
                    onChange={(e) => handleChange("roomType", e.target.value)}
                    className="w-full px-0 py-2 border-b border-gray-300 text-gray-900 focus:outline-none focus:border-yellow-400 focus:ring-0"
                  >
                    <option>Individuelles</option>
                    <option>Double</option>
                    <option>Triple</option>
                    <option>Quadruple</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Salle de réunion *
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="oui"
                        checked={formData.hasMeetingRoom === "oui"}
                        onChange={(e) =>
                          handleChange("hasMeetingRoom", e.target.value)
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-900">Oui</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="non"
                        checked={formData.hasMeetingRoom === "non"}
                        onChange={(e) =>
                          handleChange("hasMeetingRoom", e.target.value)
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-900">Non</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Commentaires / Demandes spécifiques
                  </label>
                  <textarea
                    value={formData.accommodationComments}
                    onChange={(e) =>
                      handleChange("accommodationComments", e.target.value)
                    }
                    className="w-full h-20 p-3 border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>
            </div>

            {/* Destination & Transport */}
          </div>

          {/* Right Column - Message Section */}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold bg-[#8EBD22] w-fit px-4 rounded-full text-white mb-4">
                Destination & Transport
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Destination souhaitée *
                  </label>
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) =>
                      handleChange("destination", e.target.value)
                    }
                    className="w-full px-0 py-2 border-b border-gray-300 text-gray-900 focus:outline-none focus:border-yellow-400 focus:ring-0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Inclure le transport Aller / Retour *
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="oui"
                        checked={formData.hasTransport === "oui"}
                        onChange={(e) =>
                          handleChange("hasTransport", e.target.value)
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-900">Oui</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="non"
                        checked={formData.hasTransport === "non"}
                        onChange={(e) =>
                          handleChange("hasTransport", e.target.value)
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-900">Non</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Ville de départ *
                  </label>
                  <input
                    type="text"
                    value={formData.departureCity}
                    onChange={(e) =>
                      handleChange("departureCity", e.target.value)
                    }
                    className="w-full px-0 py-2 border-b border-gray-300 text-gray-900 focus:outline-none focus:border-yellow-400 focus:ring-0"
                  />
                </div>
              </div>
            </div>

            {/* Activités */}
            <div>
              <h3 className="text-lg font-semibold bg-[#8EBD22] w-fit px-4 rounded-full text-white mb-4">
                Activités
              </h3>
              <div className="space-y-3 mb-4">
                {activities.map((activity) => (
                  <label key={activity} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.activities.includes(activity)}
                      onChange={() =>
                        handleCheckboxChange("activities", activity)
                      }
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-gray-900">{activity}</span>
                  </label>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Commentaires / Demandes spécifiques
                </label>
                <textarea
                  value={formData.activitiesComments}
                  onChange={(e) =>
                    handleChange("activitiesComments", e.target.value)
                  }
                  className="w-full h-20 p-3 border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>

            {/* Enjeux */}
            <div>
              <h3 className="text-lg font-semibold bg-[#8EBD22] w-fit px-4 rounded-full text-white mb-4">
                Vos enjeux
              </h3>
              <div className="space-y-3 mb-4">
                {objectives.map((objective) => (
                  <label key={objective} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.objectives.includes(objective)}
                      onChange={() =>
                        handleCheckboxChange("objectives", objective)
                      }
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-gray-900">{objective}</span>
                  </label>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Commentaires
                </label>
                <textarea
                  value={formData.objectivesComments}
                  onChange={(e) =>
                    handleChange("objectivesComments", e.target.value)
                  }
                  className="w-full h-20 p-3 border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>

            {/* Réunion */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Nombre de demi-journées de réunion *
              </label>
              <select
                value={formData.halfDays}
                onChange={(e) => handleChange("halfDays", e.target.value)}
                className="w-full px-0 py-2 border-b border-gray-300 text-gray-900 focus:outline-none focus:border-yellow-400 focus:ring-0"
              >
                {Array.from({ length: 11 }, (_, i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div>
              <h3 className="text-lg font-semibold bg-[#8EBD22] w-fit px-4 rounded-full text-white mb-4">
                Budget
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Budget par personne *
                  </label>
                  <input
                    type="number"
                    value={formData.budgetPerPerson}
                    onChange={(e) =>
                      handleChange("budgetPerPerson", e.target.value)
                    }
                    className="w-full px-0 py-2 border-b border-gray-300 text-gray-900 focus:outline-none focus:border-yellow-400 focus:ring-0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Commentaires
                  </label>
                  <textarea
                    value={formData.budgetComments}
                    onChange={(e) =>
                      handleChange("budgetComments", e.target.value)
                    }
                    className="w-full h-20 p-3 border border-gray-300 rounded text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 my-4">
          <div className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Vos coordonnées</h2>
        </div>
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Besoins techniques & Demandes spécifiques
            </h3>
            <textarea
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder="Décrivez vos besoins techniques, demandes spéciales et autres commentaires..."
              className="w-full h-40 p-4 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Contact Preference */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Comment souhaitez-vous être contacté ? *
            </h3>
            <div className="space-y-3">
              {["Appel Téléphonique", "Email", "Message Texte"].map(
                (method) => (
                  <label key={method} className="flex items-center gap-3">
                    <input
                      type="radio"
                      value={method}
                      checked={formData.contactPreference === method}
                      onChange={(e) =>
                        handleChange("contactPreference", e.target.value)
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-900">{method}</span>
                  </label>
                ),
              )}
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="flex flex-col items-center gap-4 mt-12">
          <p className="text-xs text-gray-600">*Champ obligatoire</p>
          <button
            type="submit"
            className="px-12 py-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-full transition-colors"
          >
            Valider votre demande
          </button>
        </div>
      </form>
    </main>
  );
};
export default TeamBuildingFomr;
