/* eslint-disable @next/next/no-img-element */
"use client";

import type React from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Target,
  Lightbulb,
  Award,
  TrendingUp,
  Heart,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import TeamBuildingFomr from "../_components/team-building-form";

const TeamBuildingPage = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const seminarTypes = [
    {
      icon: Heart,
      title: "Team Building & Expériences Incentive",
      description:
        "Le team building incentive est bien plus qu'une simple sortie d'entreprise — c'est une expérience de reconnaissance et de motivation qui fédère vos équipes autour de moments forts et inoubliables.",
      features: [
        "Expériences inoubliables dans des lieux d'exception",
        "Activités exclusives et moments de détente",
        "Valorisation, motivation et fidélisation des équipes",
      ],
      color: "from-[#8EBD22]/20 to-[#8EBD22]/5",
    },
    {
      icon: Users,
      title: "Séminaire de cohésion",
      description:
        "Le séminaire de cohésion a pour objectif de créer des moments privilégiés qui renforcent la cohésion de vos équipes.",
      features: [
        "Activités team building intégrées",
        "Moments d'échange et de partage pour renforcer les liens",
        "Ateliers collaboratifs",
      ],
      color: "from-blue-500/20 to-blue-500/5",
    },
    {
      icon: Target,
      title: "Séminaire stratégique",
      description:
        "Le séminaire stratégique permet d'aborder en profondeur des enjeux business essentiels pour votre entreprise.",
      features: [
        "Sessions de réflexion et brainstorming",
        "Conférences et ateliers de travail",
        "Objectifs business et plans d'action",
      ],
      color: "from-purple-500/20 to-purple-500/5",
    },
    {
      icon: Lightbulb,
      title: "Séminaire de formation",
      description:
        "Un séminaire de formation est l'occasion idéale de développer les compétences de vos équipes sur des thématiques spécifiques.",
      features: [
        "Ateliers pratiques et sessions de coaching",
        "Acquisition de compétences et mises en situation réelles",
        "Développement personnel et professionnel",
      ],
      color: "from-orange-500/20 to-orange-500/5",
    },
  ];

  const benefits = [
    {
      icon: Users,
      title: "Renforcer la cohésion d'équipe",
      description:
        "Voyager ensemble, partager des moments forts, découvrir de nouveaux horizons… Nos programmes de team building favorisent les échanges, la collaboration et la confiance mutuelle.",
    },
    {
      icon: Award,
      title: "Valoriser et récompenser vos collaborateurs",
      description:
        "Offrez à vos équipes une parenthèse d'exception pour saluer leur engagement et leur performance. Un geste fort pour fidéliser les talents.",
    },
    {
      icon: TrendingUp,
      title: "Créer une expérience mémorable",
      description:
        "Chaque projet organisé par Happy Trip est pensé sur mesure : lieux d'exception, activités exclusives, animations ludiques ou culturelles.",
    },
  ];

  const whyChoose = [
    {
      title: "Offres négociées",
      description:
        "Grâce à notre réseau de partenaires privilégiés, nous vous faisons bénéficier de tarifs négociés sur une large sélection de logements, d'activités et de prestataires.",
    },
    {
      title: "Parfaitement adapté à vos objectifs",
      description:
        "Parce que chaque entreprise a ses propres objectifs, nous créons des Team building et Séminaires sur-mesure, pensés pour répondre précisément à vos besoins.",
    },
    {
      title: "Expériences inoubliables",
      description:
        "Nos Team building sont bien plus que des événements : ce sont des moments uniques qui marquent les esprits et renforcent l'engagement.",
    },
  ];

  return (
    <div>
      <div
        className="breadcumb-area min-h-[80vh] bg-center"
        style={{
          backgroundImage:
            "url(https://images.pexels.com/photos/7793678/pexels-photo-7793678.jpeg)",
        }}
      >
        <div className="container flex items-center justify-center">
          <div className="row">
            <div className="col-12">
              <div className="breadcumb-wrap max-w-3xl">
                <h3>Organisez votre séminaire ou team building sur mesure</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="shape">
          <svg width="128" height="357" viewBox="0 0 128 357" fill="none">
            <path
              d="M-9.73063 357C-11.832 304.262 -1.65343 268.562 21.3305 247.878C27.4705 242.355 34.4642 238.095 41.2608 233.944C44.6099 231.887 48.0903 229.757 51.4066 227.519C63.6866 219.217 71.3041 210.301 74.5875 200.338C75.1457 198.713 75.5397 196.981 75.7695 195.212C68.2505 198.569 62.1762 199.688 56.5944 198.749C50.5201 197.703 43.5592 193.19 41.6548 185.43C40.3086 179.871 42.2787 173.987 46.974 169.691C52.5229 164.601 60.1405 163.23 65.8865 166.262C74.686 170.882 78.4948 181.639 78.0679 191.783C98.3923 181.603 114.58 162.002 121.77 138.72C129.289 114.318 126.695 86.4868 114.809 64.2508C110.048 55.3348 103.711 46.9963 97.6043 38.9466C86.375 24.1467 74.7845 8.87758 72.6831 -10.3623C70.8116 -28.1583 78.0679 -46.4596 91.2016 -57L92.3508 -55.2312C79.7753 -45.124 72.8473 -27.6529 74.686 -10.6511C76.6889 7.93905 87.6227 22.3419 99.1475 37.5388C105.32 45.6607 111.69 54.0714 116.55 63.1318C128.698 85.8731 131.358 114.39 123.675 139.369C116.221 163.591 99.2131 183.913 77.9366 194.201C77.6739 196.584 77.1814 198.894 76.4591 201.06C72.9786 211.528 65.1313 220.769 52.4573 229.36C49.1082 231.634 45.5949 233.764 42.213 235.821C35.5148 239.9 28.5868 244.16 22.5782 249.538C0.0867844 269.753 -9.82913 304.839 -7.76058 356.856L-9.73063 357ZM59.3525 166.767C55.1825 166.767 51.1111 168.716 48.2873 171.315C44.2159 175.033 42.4757 180.087 43.6249 184.816C45.2994 191.638 51.5379 195.645 56.9556 196.584C62.1762 197.486 67.955 196.367 75.1457 193.154C75.4412 193.01 75.7695 192.866 76.065 192.721C76.7217 182.975 73.1756 172.398 65.0656 168.139C63.2269 167.2 61.2568 166.767 59.3525 166.767Z"
              fill="white"
              fillOpacity="0.18"
            />
          </svg>
        </div>
        <div className="shape-s2">
          <img src="/images/chape2.png" alt="" className="w-24 h-auto" />
        </div>
        
      </div>

      {/* Hero Section */}
      <TeamBuildingFomr />
      
      {/* Why Section */}
      <section className="pb-16 md:pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Pourquoi organiser un Team Building avec{" "}
              <span className="text-[#8EBD22]">Happy Trip</span> ?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Un séminaire ou une activité de team building n&apos;est pas
              qu&apos;un simple voyage professionnel — c&apos;est une expérience
              humaine, immersive et inspirante.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card
                  key={index}
                  className="p-8 hover:shadow-xl transition-all duration-300 border-2 hover:border-[#8EBD22] group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8EBD22] to-[#7AA91D] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </Card>
              );
            })}
          </div>
           <div className="container mx-auto px-4 max-w-7xl mt-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 border-2 hover:border-[#8EBD22] transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-[#8EBD22]/10 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-[#8EBD22]" />
              </div>
              <h3 className="text-xl font-bold mb-3">
                Séminaires clés en main
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Profitez d&apos;une organisation complète, de la logistique à
                l&apos;animation, pour un séjour professionnel sans stress et
                parfaitement orchestré.
              </p>
            </Card>

            <Card className="p-8 border-2 hover:border-[#8EBD22] transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-[#8EBD22]/10 flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-[#8EBD22]" />
              </div>
              <h3 className="text-xl font-bold mb-3">
                Expérience personnalisée
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Chaque projet est adapté à vos objectifs, vos valeurs et vos
                besoins spécifiques : réunions, ateliers, incentives ou moments
                de détente.
              </p>
            </Card>

            <Card className="p-8 border-2 hover:border-[#8EBD22] transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-[#8EBD22]/10 flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-[#8EBD22]" />
              </div>
              <h3 className="text-xl font-bold mb-3">
                Esprit d&apos;équipe et motivation
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Vivez un moment fort et fédérateur qui renforce la cohésion, la
                communication et l&apos;engagement de vos collaborateurs.
              </p>
            </Card>
          </div>
        </div>
        </div>
      </section>

      {/* Seminar Types */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Trouvez le Team Building qui répond à vos{" "}
              <span className="text-[#8EBD22]">objectifs</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Chaque entreprise a ses ambitions, ses valeurs et ses défis.
              C&apos;est pourquoi Happy Trip conçoit des expériences sur mesure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {seminarTypes.map((seminar, index) => {
              const Icon = seminar.icon;
              return (
                <Card
                  key={index}
                  className="overflow-hidden border-2 hover:border-[#8EBD22] transition-all duration-300 group cursor-pointer"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div
                    className={`h-2 bg-gradient-to-r ${seminar.color} group-hover:h-3 transition-all`}
                  />
                  <div className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-[#8EBD22]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#8EBD22] transition-colors">
                        <Icon
                          className={`w-6 h-6 ${hoveredCard === index ? "text-white" : "text-[#8EBD22]"} transition-colors`}
                        />
                      </div>
                      <h3 className="text-xl font-bold leading-tight">
                        {seminar.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {seminar.description}
                    </p>
                    <ul className="space-y-3">
                      {seminar.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-[#8EBD22] flex-shrink-0 mt-0.5" />
                          <span className="text-sm leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Happy Trip */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Pourquoi choisir{" "}
              <span className="text-[#8EBD22]">Happy Trip</span> ?
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Organiser un Team Building d&apos;entreprise demande du temps, de
              l&apos;expertise et une parfaite connaissance des destinations.
              Bénéficiez d&apos;un accompagnement clé en main.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {whyChoose.map((item, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8EBD22] to-[#7AA91D] flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold text-white">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#8EBD22] to-[#7AA91D] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold">
              Prêt à créer une expérience inoubliable pour vos équipes ?
            </h2>
            <p className="text-lg text-white/90 leading-relaxed">
              Contactez-nous dès aujourd&apos;hui pour discuter de votre projet
              et recevoir une proposition personnalisée adaptée à vos besoins et
              objectifs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                variant="secondary"
                className="px-8 py-6 text-lg bg-white text-[#8EBD22] hover:bg-white/90"
              >
                Demander un devis gratuit
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg border-2 border-white text-white hover:bg-white/10 bg-transparent"
              >
                Nous contacter
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default TeamBuildingPage;
