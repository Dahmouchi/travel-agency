/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// reservationActions.ts
"use server";
import prisma from "@/lib/prisma";
import { ReservationStatus, TravelRequestStatus } from "@prisma/client";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { sendEmailToClient } from "./meetingsActions";
import { sendCustomTravelReservationEmail } from "./team-building";
import { reservationReceivedMessage } from "@/lib/whatsapp-templates";
import { sendWhatsAppMessage, sendWhatsAppTemplate } from "@/lib/whatsapp";

interface Reservation {
  tourId: string;
  hotelId?: string | null;
  travelDateId: string;
  fullName: string;
  email: string;
  phone: string;
  adultCount: number;
  childCount: number;
  infantCount: number;
  singleRoom?: boolean;
  specialRequests?: string;
  totalPrice: number;
  termsAccepted: boolean;
}
export async function getTravelRequest() {
  try {
    const blogs = await prisma.travelRequest.findMany({
      orderBy: { createdAt: "asc" },
    });
    return blogs;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
export async function createTravelRequest(data: any) {
  try {
    const travelRequest = await prisma.travelRequest.create({
      data: {
        destination: data.destination,
        departureDate: new Date(data.departureDate),
        returnDate: new Date(data.returnDate),
        isFlexible: data.isFlexible,
        departureCity: data.departureCity,
        needsTransport: data.needsTransport,
        needsFlight: data.needsFlight,
        adults: data.adults,
        children: data.children,
        accommodationWishes: data.accommodationWishes,
        numberOfRooms: data.numberOfRooms,
        accommodationCategory: data.accommodationCategory,
        budget: data.budget,
        duration: data.duration,
        title: data.title,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        countryCode: data.countryCode,
        phone: data.phone,
        message: data.message,
      },
    });
    await sendCustomTravelReservationEmail(travelRequest);
    return { success: true, travelRequest };
  } catch (error) {
    console.error("❌ Error creating travel request:", error);
    return { success: false, error: "Failed to create travel request" };
  }
}
export async function CreateReservation(data: Reservation) {
  try {
    let hotelPrice = 0;
    if (data.hotelId) {
      const hotel = await prisma.hotel.findUnique({
        where: { id: data.hotelId },
        select: { price: true },
      });
      hotelPrice = hotel?.price || 0;
    }

    let tourPrice = 0;
    if (data.tourId) {
      const tour = await prisma.tour.findUnique({
        where: { id: data.tourId },
        select: { priceDiscounted: true },
      });
      tourPrice = tour?.priceDiscounted || 0;
    }

    const reservation = await prisma.reservation.create({
      data: {
        tourId: data.tourId,
        hotelId: data.hotelId ? data.hotelId : null,
        travelDateId: data.travelDateId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        adultCount: data.adultCount,
        childCount: data.childCount,
        infantCount: data.infantCount,
        singleRoom: data.singleRoom ?? false,
        specialRequests: data.specialRequests,
        totalPrice:
          data.totalPrice +
          (data.singleRoom ? 100 : 0) +
          hotelPrice +
          tourPrice,
        termsAccepted: data.termsAccepted,
        status: ReservationStatus.PENDING,
      },
    });

    return reservation;
  } catch (error) {
    throw new Error("Failed to create reservation");
  }
}

type CreateReservationInput = {
  tourId: string;
  travelDateId: string; // still passed in to identify which TourDate to copy from
  nom: string;
  prenom: string;
  phone: string;
  email?: string;
  data: any; // your customFields
  basePrice: number;
  finalPrice: number;
};
export async function UpdateStatuSurMesure(
  reservationId: string,
  newStatus: TravelRequestStatus,
) {
  try {
    const blogs = await prisma.travelRequest.findUnique({
      where: { id: reservationId },
    });
    if (!blogs) {
      throw new Error("TravelRequest not found");
    }
    await prisma.travelRequest.update({
      where: { id: reservationId },
      data: { status: newStatus },
    });

    return blogs;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
export async function CreateReservations(input: CreateReservationInput) {
  try {
    // Normalise phone to E.164 so the WhatsApp API never rejects it.
    // parsePhoneNumberFromString accepts numbers with or without a country code;
    // we default to Morocco (MA) when no country prefix is present.
    const parsedPhone = parsePhoneNumberFromString(input.phone, "MA");
    const e164Phone = parsedPhone?.isValid()
      ? parsedPhone.format("E.164")
      : input.phone; // fallback: keep raw value rather than blocking the reservation

    // First, find the TourDate to get startDate and endDate
    const tourDate = await prisma.tourDate.findUnique({
      where: { id: input.travelDateId },
      select: { startDate: true, endDate: true },
    });

    if (!tourDate) {
      throw new Error("TourDate not found");
    }

    // Create reservation with copied dates instead of travelDateId relation
    const reservation = await prisma.reservations.create({
      data: {
        tourId: input.tourId,
        nom: input.nom,
        prenom: input.prenom,
        phone: e164Phone,
        email: input.email,
        data: input.data,
        basePrice: input.basePrice,
        finalPrice: input.finalPrice,
        status: "PENDING", // or ReservationStatus.PENDING if enum imported
        startDate: tourDate.startDate ?? new Date(),
        endDate: tourDate.endDate ?? tourDate.startDate ?? new Date(),
      },
      include: {
        tour: true,
      },
    });
    await sendEmailToAdmin(reservation);
    // NEW: Send WhatsApp to user
    try {
      // 1. Send initial Template to open the 24h window
      // 'hello_world' is the default template provided by Meta
      await sendWhatsAppTemplate(reservation.phone, "hello_world");

      // 2. Send the actual Reservation details
      const message = reservationReceivedMessage({
        prenom: reservation.prenom,
        nom: reservation.nom,
        tourName: reservation.tour.title,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        finalPrice: reservation.finalPrice,
        reservationId: reservation.id,
      });
      await sendWhatsAppMessage(reservation.phone, message);
    } catch (err) {
      // Don't block reservation if WhatsApp fails
      console.error("WhatsApp send failed:", err);
    }
    return reservation;
  } catch (error) {
    console.error(error);
    throw new Error("❌ Failed to create reservation.");
  }
}
export async function CreateReservationsDiscoverr(
  input: CreateReservationInput,
) {
  try {
    // First, find the TourDate to get startDate and endDate

    // Create reservation with copied dates instead of travelDateId relation
    const reservation = await prisma.reservations.create({
      data: {
        tourId: input.tourId,
        nom: input.nom,
        prenom: input.prenom,
        phone: input.phone,
        email: input.email,
        data: input.data,
        basePrice: input.basePrice,
        finalPrice: input.finalPrice,
        status: "PENDING", // or ReservationStatus.PENDING if enum imported
        startDate: new Date(),
        endDate: new Date(),
      },
      include: {
        tour: true,
      },
    });
    await sendEmailToAdmin(reservation);
    return reservation;
  } catch (error) {
    console.error(error);
    throw new Error("❌ Failed to create reservation.");
  }
}
function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export async function sendEmailToAdmin(reservation: any) {
  const adminEmail = "hassandahmouchi0@gmail.com";

  await sendEmailToClient(
    adminEmail,
    "Nouvelle réservation - Happy Trip",
    `<div style="font-family: Arial, sans-serif; color: #222; max-width: 600px; margin: 0 auto;">
      <!-- Header with logo and color accent -->
      <div style="background-color: #fff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <img src="https://happytrip.ma/horizontal1.png" alt="Happy Trip Logo" style="max-height: 80px; display: block; margin: 0 auto;">
      </div>
      
      <!-- Email content -->
      <div style="padding: 20px; background-color: #ffffff; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
        <h2 style="color: #8EBD22; margin-top: 0;">Nouvelle réservation reçue !</h2>
        <p style="font-size: 16px; line-height: 1.5;">
          Une nouvelle réservation a été effectuée sur le site Happy Trip.
        </p>
        
        <!-- Reservation details card -->
        <div style="margin: 20px 0; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #8EBD22;">
          <h3 style="color: #8EBD22; margin-top: 0; margin-bottom: 12px;">Détails de la réservation</h3>
          
          <p style="margin: 8px 0;"><strong>🔹 Référence :</strong> ${reservation?.tour?.title}</p>
          <p style="margin: 8px 0;"><strong>🔹 Client :</strong> ${reservation.nom} ${reservation.prenom}</p>
          <p style="margin: 8px 0;"><strong>🔹 Email :</strong> ${reservation.email}</p>
          <p style="margin: 8px 0;"><strong>🔹 Téléphone :</strong> ${reservation.phone}</p>
          <p style="margin: 8px 0;"><strong>🔹 Dates :</strong> Du ${formatDate(reservation.startDate)} au ${formatDate(reservation.endDate)}</p>
          <p style="margin: 8px 0;"><strong>🔹 Montant total :</strong> ${reservation.finalPrice} MAD</p>
          <p style="margin: 8px 0;"><strong>🔹 Statut :</strong> ${reservation.status}</p>
        </div>
        
        <!-- Action buttons -->
        <div style="margin: 20px 0; text-align: center;">
          <a href="https://happytrip.ma/admin" 
             style="display: inline-block; padding: 10px 20px; background-color: #8EBD22; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">
            Voir la réservation
          </a>
        </div>
        
        <!-- Client information -->
        <div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px; margin-top: 24px;">
          <h4 style="margin-top: 0; color: #8EBD22;">Informations supplémentaires :</h4>
          <pre style="white-space: pre-wrap; font-family: Arial; margin: 0;">${JSON.stringify(reservation.data, null, 2)}</pre>
        </div>
        
        <!-- Signature -->
        <p style="margin-top: 24px; font-size: 15px;">
          Cordialement,<br>
          <strong style="color: #8EBD22;">Système de notification Happy Trip</strong>
        </p>
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; padding: 16px; color: #64748b; font-size: 12px;">
        <p style="margin: 0;">© ${new Date().getFullYear()} Happy Trip. Tous droits réservés.</p>
      </div>
    </div>`,
  );
}

export async function GetAllReservations() {
  try {
    const reservations = await prisma.reservations.findMany({
      where: { isDiscover: false },
      include: {
        tour: {
          include: {
            reservationForm: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return reservations;
  } catch (error) {
    throw new Error("Failed to fetch reservations");
  }
}
export async function GetAllReservationsDiscover() {
  try {
    const reservations = await prisma.reservations.findMany({
      where: { isDiscover: true },
      include: {
        tour: {
          include: {
            reservationForm: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return reservations;
  } catch (error) {
    throw new Error("Failed to fetch reservations");
  }
}
export async function UpdateReservationStatus(
  id: string,
  status: ReservationStatus,
) {
  try {
    const updatedReservation = await prisma.reservations.update({
      where: { id },
      data: { status },
    });

    return { success: true, reservation: updatedReservation };
  } catch (error) {
    return { success: false, error: "Failed to update reservation status" };
  }
}

export async function UpdateReservation(
  id: string,
  data: Partial<Reservation>,
) {
  try {
    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: {
        hotelId: data.hotelId ? data.hotelId : null,
        travelDateId: data.travelDateId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        adultCount: data.adultCount,
        childCount: data.childCount,
        infantCount: data.infantCount,
        singleRoom: data.singleRoom ?? false,
        specialRequests: data.specialRequests,
        totalPrice: data.totalPrice,
        termsAccepted: data.termsAccepted,
      },
    });

    return { success: true, reservation: updatedReservation };
  } catch (error) {
    return { success: false, error: "Failed to update reservation" };
  }
}

export async function DeleteReservation(id: string) {
  try {
    await prisma.reservation.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete reservation" };
  }
}
