/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";
import prisma from "@/lib/prisma";
import { TravelRequestStatus } from "@prisma/client";
import { sendEmailToClient } from "./meetingsActions";

export async function createEventForm(data: any) {
  try {
    const eventForm = await prisma.eventForm.create({
      data: {
        // Vous
        company: data.company || "",
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        eventType: data.eventType,
        participants: data.participants || "",
        projectDescription: data.projectDescription || "",

        // Dates
        departureDate: data.departureDate ? new Date(data.departureDate) : null,
        returnDate: data.returnDate ? new Date(data.returnDate) : null,
        dateFlexibility: data.dateFlexibility === "oui",
        dateComments: data.dateComments || "",

        // Hébergement
        accommodationLevel: data.accommodationLevel || "Milieu de gamme",
        hasAccommodation: data.hasAccommodation === "oui",
        roomType: data.roomType || "Double",
        hasMeetingRoom: data.hasMeetingRoom === "oui",
        accommodationComments: data.accommodationComments || "",

        // Destination & Transport
        destination: data.destination,
        hasTransport: data.hasTransport === "oui",
        departureCity: data.departureCity || "",

        // Activités
        activities: data.activities || [],
        activitiesComments: data.activitiesComments || "",

        // Enjeux
        objectives: data.objectives || [],
        objectivesComments: data.objectivesComments || "",

        // Réunion
        halfDays: parseInt(data.halfDays) || 0,

        // Budget
        budgetPerPerson: data.budgetPerPerson || "",
        budgetComments: data.budgetComments || "",

        // Contact
        contactPreference: data.contactPreference || "Email",

        // Message global
        message: data.message || "",
      },
    });
    await sendTeamBuildingReservationEmail(eventForm);
    return { success: true, eventForm };
  } catch (error) {
    console.error("❌ Error creating event form:", error);
    return { success: false, error: "Failed to create event form" };
  }
}

export async function getEvent() {
  try {
    const blogs = await prisma.eventForm.findMany({
      orderBy: { createdAt: "asc" },
    });
    return blogs;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function UpdateStatuEvent(
  reservationId: string,
  newStatus: TravelRequestStatus
) {
  try {
    const blogs = await prisma.eventForm.findUnique({
      where: { id: reservationId },
    });
    if (!blogs) {
      throw new Error("TravelRequest not found");
    }
    await prisma.eventForm.update({
      where: { id: reservationId },
      data: { status: newStatus },
    });

    return blogs;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
// Utility to format date nicely
function formatDate(date: string | Date) {
  const d = new Date(date);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// 1️⃣ Email for "Voyage sur mesure"
export async function sendCustomTravelReservationEmail(reservation: any) {
  const adminEmail = "happy.trip.voyage@gmail.com";

  await sendEmailToClient(
    adminEmail,
    "Nouvelle réservation sur mesure - Happy Trip",
    `<div style="font-family: Arial, sans-serif; color: #222; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #fff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <img src="https://happytrip.ma/horizontal.png" alt="Happy Trip Logo" style="max-height: 80px; display: block; margin: 0 auto;">
      </div>
      <div style="padding: 20px; background-color: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #D97D55; margin-top: 0;">Nouvelle réservation sur mesure reçue !</h2>
        <p style="font-size: 16px; line-height: 1.5;">
          Une réservation de voyage sur mesure a été effectuée sur Happy Trip.
        </p>
        <div style="margin: 20px 0; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #D97D55;">
          <h3 style="color: #D97D55; margin-top: 0; margin-bottom: 12px;">Détails de la réservation</h3>
          <p style="margin: 8px 0;"><strong>🔹 Client :</strong> ${reservation.nom} ${reservation.prenom}</p>
          <p style="margin: 8px 0;"><strong>🔹 Email :</strong> ${reservation.email}</p>
          <p style="margin: 8px 0;"><strong>🔹 Téléphone :</strong> ${reservation.phone}</p>
          <p style="margin: 8px 0;"><strong>🔹 Dates :</strong> Du ${formatDate(reservation.departureDate)} au ${formatDate(reservation.returnDate)}</p>
          <p style="margin: 8px 0;"><strong>🔹 Destination :</strong> ${reservation.destination}</p>
          <p style="margin: 8px 0;"><strong>🔹 Participants :</strong> ${reservation.participants}</p>
        </div>
        <div style="margin: 20px 0; text-align: center;">
          <a href="https://happytrip.ma/admin" style="display: inline-block; padding: 10px 20px; background-color: #D97D55; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Voir la réservation
          </a>
        </div>
        <div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px; margin-top: 24px;">
          <h4 style="margin-top: 0; color: #D97D55;">Informations supplémentaires :</h4>
          <pre style="white-space: pre-wrap; font-family: Arial; margin: 0;">${JSON.stringify(reservation, null, 2)}</pre>
        </div>
        <p style="margin-top: 24px; font-size: 15px;">
          Cordialement,<br>
          <strong style="color: #D97D55;">Système de notification Happy Trip</strong>
        </p>
      </div>
      <div style="text-align: center; padding: 16px; color: #64748b; font-size: 12px;">
        <p style="margin: 0;">© ${new Date().getFullYear()} Happy Trip. Tous droits réservés.</p>
      </div>
    </div>`
  );
}

// 2️⃣ Email for "Team Building"
export async function sendTeamBuildingReservationEmail(reservation: any) {
  const adminEmail = "happy.trip.voyage@gmail.com";

  await sendEmailToClient(
    adminEmail,
    "Nouvelle réservation Team Building - Happy Trip",
    `<div style="font-family: Arial, sans-serif; color: #222; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #fff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <img src="https://happytrip.ma/horizontal.png" alt="Happy Trip Logo" style="max-height: 80px; display: block; margin: 0 auto;">
      </div>
      <div style="padding: 20px; background-color: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #D97D55; margin-top: 0;">Nouvelle réservation Team Building reçue !</h2>
        <p style="font-size: 16px; line-height: 1.5;">
          Une réservation Team Building a été effectuée sur Happy Trip.
        </p>
        <div style="margin: 20px 0; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #D97D55;">
          <h3 style="color: #D97D55; margin-top: 0; margin-bottom: 12px;">Détails de la réservation</h3>
          <p style="margin: 8px 0;"><strong>🔹 Entreprise :</strong> ${reservation.company}</p>
          <p style="margin: 8px 0;"><strong>🔹 Contact :</strong> ${reservation.firstName} ${reservation.lastName}</p>
          <p style="margin: 8px 0;"><strong>🔹 Email :</strong> ${reservation.email}</p>
          <p style="margin: 8px 0;"><strong>🔹 Téléphone :</strong> ${reservation.phone}</p>
          <p style="margin: 8px 0;"><strong>🔹 Nombre de participants :</strong> ${reservation.participants}</p>
          <p style="margin: 8px 0;"><strong>🔹 Date :</strong> ${formatDate(reservation.eventDate)}</p>
        </div>
        <div style="margin: 20px 0; text-align: center;">
          <a href="https://happytrip.ma/admin" style="display: inline-block; padding: 10px 20px; background-color: #D97D55; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Voir la réservation
          </a>
        </div>
        <div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px; margin-top: 24px;">
          <h4 style="margin-top: 0; color: #D97D55;">Informations supplémentaires :</h4>
          <pre style="white-space: pre-wrap; font-family: Arial; margin: 0;">${JSON.stringify(reservation, null, 2)}</pre>
        </div>
        <p style="margin-top: 24px; font-size: 15px;">
          Cordialement,<br>
          <strong style="color: #D97D55;">Système de notification Happy Trip</strong>
        </p>
      </div>
      <div style="text-align: center; padding: 16px; color: #64748b; font-size: 12px;">
        <p style="margin: 0;">© ${new Date().getFullYear()} Happy Trip. Tous droits réservés.</p>
      </div>
    </div>`
  );
}
