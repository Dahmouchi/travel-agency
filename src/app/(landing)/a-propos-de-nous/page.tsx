/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useRef } from "react";
import HeroSub from "../_components/hero-sub";
import {
  Compass,
  Heart,
  Leaf,
  Mail,
  Phone,
  Star,
  Gem,
  Award,
  Flame,
  Shield,
  Lightbulb,
  ArrowDown,
} from "lucide-react";
const features = [
  {
    icon: Gem,
    title: "Authenticité",
    description:
      "Nous privilégions les expériences vraies, ancrées dans la culture et les traditions locales.",
    color: "from-[#8EBD22] to-[#67891a]",
  },
  {
    icon: Award,
    title: "Qualité",
    description:
      "Nous sélectionnons rigoureusement nos agences et nos services pour garantir l'excellence.",
    color: "from-yellow-500 to-yellow-600",
  },
  {
    icon: Flame,
    title: "Passion",
    description:
      "Nous sommes animés par l'amour du voyage et le désir de le partager.",
    color: "from-red-500 to-red-600",
  },
  {
    icon: Shield,
    title: "Responsabilité",
    description:
      "Nous agissons de manière éthique et durable, en respectant les lieux et les personnes.",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "Nous cherchons constamment à améliorer nos offres et à proposer de nouvelles destinations.",
    color: "from-purple-500 to-purple-600",
  },
];

const AboutUs = () => {
  const sectionsRef = useRef<any>([]);

  useEffect(() => {
    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      });
    }, observerOptions);

    // Observe all elements with section-reveal class
    sectionsRef.current.forEach((el: any) => {
      if (el) observer.observe(el);
    });

    // Smooth scrolling for anchor links
    const handleAnchorClick = (e: any) => {
      e.preventDefault();
      const target = document.querySelector(
        e.currentTarget.getAttribute("href"),
      );
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    };

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", handleAnchorClick);
    });

    // Parallax effect for hero section
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallax = document.querySelector(".gradient-bg");
      const speed = scrolled * 0.5;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      sectionsRef.current.forEach((el: any) => {
        if (el) observer.unobserve(el);
      });
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.removeEventListener("click", handleAnchorClick);
      });
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const addToRefs = (el: any) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/a-propos-de-nous", text: "Qui sommes-nous ?" },
  ];

  return (
    <div>
      <>
        <section className="relative min-h-fit py-16 flex items-center justify-center bg-gradient-to-br from-[#6d911a] via-[#8EBD22] to-[#c0f83f] overflow-hidden gradient-bg">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-1/4 text-white/20 animate-bounce">
            <i className="fas fa-plane text-6xl"></i>
          </div>
          <div
            className="absolute bottom-20 right-1/4 text-white/20 animate-bounce"
            style={{ animationDelay: "-3s" }}
          >
            <i className="fas fa-mountain text-5xl"></i>
          </div>
          <div
            className="absolute top-1/3 right-10 text-white/20 animate-bounce"
            style={{ animationDelay: "-1.5s" }}
          >
            <i className="fas fa-compass text-4xl"></i>
          </div>

          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
            <div className="lg:mb-8 mb-4 animate-fade-in">
              <span className="inline-block px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                ✨ Votre agence voyage de confiance
              </span>
            </div>

            <h1 className="text-3xl md:text-6xl lg:text-4xl font-bold text-white mb-6 animate-slide-up">
              Qui sommes-nous ?
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up">
              Découvrez l&apos;histoire et les valeurs qui font de Happy Trip
              votre agence de voyage idéale
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <a
                href="#notre-histoire"
                className="inline-flex justify-center items-center px-8 py-4 bg-white text-[#8EBD22] rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <span>Découvrir notre histoire</span>
                <ArrowDown className="fas fa-arrow-down ml-2" />
              </a>
              <a
                href="#contact"
                className="inline-flex justify-center items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-[#8EBD22] transition-all duration-300 transform hover:scale-105"
              >
                <Phone className="fas fa-phone mr-2" />
                <span>Nous contacter</span>
              </a>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
            <i className="fas fa-chevron-down text-2xl"></i>
          </div>
        </section>

        <div className="font-sans bg-gray-50 text-gray-900 overflow-x-hidden">
          {/* Notre Histoire Section */}
          <section
            id="notre-histoire"
            className="py-4 lg:py-12 bg-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50 to-transparent"></div>

            <div className="container mx-auto px-6 relative z-10">
              <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-2 lg:gap-16 items-center">
                  <div className="section-reveal" ref={addToRefs}>
                    <div className="mb-6">
                      <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                        Une passion pour
                        <span className="bg-gradient-to-r from-[#8EBD22] to-[#67891a] bg-clip-text text-transparent">
                          {" "}
                          l&apos;exploration
                        </span>
                      </h2>
                    </div>

                    <div className="space-y-6 lg:text-lg text-sm text-gray-600 leading-relaxed">
                      <p>
                        Bienvenue chez{" "}
                        <strong className="text-[#8EBD22]">Happy Trip</strong>,
                        votre agence de confiance pour des voyages inoubliables
                        au Maroc et au-delà. Fondée avec la passion de
                        l&apos;exploration et le désir de partager la beauté de
                        notre monde, Happy Trip s&apos;est donné pour mission de
                        créer des expériences de voyage uniques, authentiques et
                        enrichissantes pour tous nos clients.
                      </p>

                      <p>
                        Depuis notre création, nous nous engageons à offrir des
                        aventures qui vont au-delà du simple tourisme. Nous
                        croyons que chaque voyage est une opportunité de
                        découverte, de connexion et de croissance personnelle.
                        C&apos;est pourquoi nous mettons tout en œuvre pour
                        concevoir des itinéraires qui allient
                        l&apos;émerveillement des paysages, la richesse
                        culturelle et la chaleur des rencontres humaines.
                      </p>
                    </div>
                  </div>

                  <div className="section-reveal" ref={addToRefs}>
                    <div className="relative">
                      <div className="bg-gradient-to-br from-[#8EBD22] to-[#b6d66a] rounded-3xl p-8 text-white">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="text-center">
                            <div className="text-4xl font-bold mb-2">1650+</div>
                            <div className="text-blue-100">
                              Voyages organisés
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-4xl font-bold mb-2">98%</div>
                            <div className="text-blue-100">
                              Clients satisfaits
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-4xl font-bold mb-2">130+</div>
                            <div className="text-blue-100">Destinations</div>
                          </div>
                          <div className="text-center">
                            <div className="text-4xl font-bold mb-2">24/7</div>
                            <div className="text-blue-100">Support client</div>
                          </div>
                        </div>
                      </div>

                      {/* Decorative elements */}
                      <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20"></div>
                      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-400 rounded-full opacity-20"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Notre Mission Section */}
          <section className="py-20 lg:py-32 bg-gradient-to-br from-gray-50 to-blue-50 relative">
            <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto">
                <div
                  className="text-center mb-16 section-reveal"
                  ref={addToRefs}
                >
                  <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                    Transformer vos rêves en
                    <span className="bg-gradient-to-r from-[#8EBD22] to-[#bbe756] bg-clip-text text-transparent">
                      {" "}
                      réalité
                    </span>
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Notre mission est de transformer vos rêves de voyage en
                    réalité. Nous nous efforçons de créer des expériences
                    exceptionnelles qui marquent à vie.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div
                    className="section-reveal bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                    ref={addToRefs}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-[#8EBD22] to-[#67891a] rounded-2xl flex items-center justify-center mb-6">
                      <Star className="fas fa-star text-white text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Expériences uniques
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Proposer des itinéraires originaux et personnalisés qui
                      sortent des sentiers battus.
                    </p>
                  </div>

                  <div
                    className="section-reveal bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                    ref={addToRefs}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
                      <Leaf className="fas fa-leaf text-white text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Tourisme responsable
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Respecter l&apos;environnement et soutenir les communautés
                      locales.
                    </p>
                  </div>

                  <div
                    className="section-reveal bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                    ref={addToRefs}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6">
                      <Heart className="fas fa-heart text-white text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Satisfaction client
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Offrir un service irréprochable, de la planification à la
                      réalisation de votre voyage.
                    </p>
                  </div>

                  <div
                    className="section-reveal bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                    ref={addToRefs}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                      <Compass className="fas fa-compass text-white text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Inspirer l&apos;aventure
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Encourager chacun à explorer de nouveaux horizons et à
                      créer des souvenirs impérissables.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Nos Valeurs Section */}
          <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#8EBD22]/5 to-cyan-500/5"></div>

            <div className="container mx-auto px-6 relative z-10">
              <div className="max-w-6xl mx-auto">
                <div
                  className="text-center mb-16 section-reveal"
                  ref={addToRefs}
                >
                  <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                    Le fondement de
                    <span className="bg-gradient-to-r from-[#8EBD22] to-[#67891a] bg-clip-text text-transparent">
                      {" "}
                      notre action
                    </span>
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Chez Happy Trip, nos valeurs sont le fondement de tout ce
                    que nous faisons et guident chacune de nos décisions.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {features.map((value, index) => {
                    const Icon = value.icon;
                    return (
                      <div
                        key={index}
                        className="section-reveal group hover:-translate-y-2 hover:scale-105 transition-all duration-300"
                        ref={addToRefs}
                      >
                        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 h-full relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#8EBD22]/10 to-[#67891a]/10 rounded-full -translate-y-16 translate-x-16"></div>
                          <div className="relative z-10">
                            <div
                              className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                            >
                              <Icon className="text-white w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                              {value.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                              {value.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section
            id="contact"
            className="py-20 lg:py-32 bg-gradient-to-br from-[#8EBD22] via-[#67891a] to-[#bcf538] relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <div className="section-reveal" ref={addToRefs}>
                  <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4">
                    Contactez-nous
                  </span>
                  <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                    Prêt à planifier votre
                    <span className="text-yellow-300">
                      {" "}
                      prochaine aventure ?
                    </span>
                  </h2>
                  <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
                    Contactez-nous dès aujourd&apos;hui pour commencer à créer
                    le voyage de vos rêves !
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <div
                    className="section-reveal hover:-translate-y-2 transition-all duration-300"
                    ref={addToRefs}
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Phone className=" text-white text-2xl" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">
                        Téléphone
                      </h3>
                      <a
                        href="tel:+212628324880"
                        className="text-xl text-white/90 hover:text-yellow-300 transition-colors duration-300"
                      >
                        +212 628 324 880
                      </a>
                    </div>
                  </div>

                  <div
                    className="section-reveal hover:-translate-y-2 transition-all duration-300"
                    ref={addToRefs}
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Mail className="fas fa-envelope text-white text-2xl" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">
                        Email
                      </h3>
                      <a
                        href="mailto:happy.trip.voyage@gmail.com"
                        className="text-xl text-white/90 hover:text-yellow-300 transition-colors duration-300"
                      >
                        happy.trip.voyage@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="section-reveal" ref={addToRefs}>
                  <p className="text-2xl text-white font-semibold mb-8">
                    Nous avons hâte de vous faire voyager ! ✈️
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="tel:+212628324880"
                      className="inline-flex items-center px-8 py-4 bg-white text-[#8EBD22] rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <i className="fas fa-phone mr-2"></i>
                      <span>Appelez maintenant</span>
                    </a>
                    <a
                      href="mailto:happy.trip.voyage@gmail.com"
                      className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-blue-700 transition-all duration-300 transform hover:scale-105"
                    >
                      <i className="fas fa-envelope mr-2"></i>
                      <span>Envoyez un email</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}

          <style jsx>{`
            .section-reveal {
              opacity: 0;
              transform: translateY(50px);
              transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .section-reveal.revealed {
              opacity: 1;
              transform: translateY(0);
            }

            .animate-fade-in {
              animation: fadeIn 0.6s ease-in-out;
            }

            .animate-slide-up {
              animation: slideUp 0.6s ease-out;
            }

            @keyframes fadeIn {
              0% {
                opacity: 0;
                transform: translateY(20px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes slideUp {
              0% {
                opacity: 0;
                transform: translateY(30px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      </>
    </div>
  );
};

export default AboutUs;
