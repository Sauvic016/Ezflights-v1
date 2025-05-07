"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Download, Plane, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFlightStore, useUserDetails } from "@/store/Store";
import { useBookingStore } from "@/store/booking-store";

import { Button } from "@repo/ui/components/ui/button";
import { Card, CardContent, CardHeader } from "@repo/ui/components/ui/card";

import { Separator } from "@repo/ui/components/ui/separator";
import { Alert, AlertDescription } from "@repo/ui/components/ui/alert";

interface SuccessMessageProps {
  email?: string;
  bookingReference?: string;
  totalPaid?: string;
  currency?: string;
  isGuest?: boolean;
}

export default function SuccessMessage({
  email = "johndoe@example.com",
  bookingReference = "ABC123456",
  totalPaid = "1,249.99",
  currency = "USD",
  isGuest = false,
}: SuccessMessageProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const router = useRouter();
  const removeFlight = useFlightStore((state) => state.removeFlight);
  const clearBooking = useBookingStore((state) => state.clearBooking);
  const removeContact = useUserDetails((state) => state.removeContact);
  const clearTravelers = useUserDetails((state) => state.clearTravelers);

  const handleDownload = () => {
    setIsDownloading(true);
    // Simulate download delay
    setTimeout(() => {
      setIsDownloading(false);
    }, 2000);
  };

  const handleBookNewFlight = () => {
    // Clear all Zustand states
    removeFlight();
    clearBooking();
    removeContact();
    clearTravelers();
    // Navigate to flights page
    router.push("/");
  };

  return (
    <div className="flex pt-24 items-center justify-center p-4">
      <Card className="w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-6 flex justify-center">
          <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center animate-in zoom-in-50 duration-300">
              <Check className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <CardHeader className="text-center pt-6 pb-2">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              🎉 Thank you! Your flight has been booked successfully.
            </h1>
            <p className="text-muted-foreground">
              We&apos;ve sent your itinerary and e-ticket to{" "}
              <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Booking Reference
                </p>
                <p className="font-medium">{bookingReference}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="font-medium">
                  {currency} {totalPaid}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {isGuest
              ? (
                <>
                  <Button
                    className="w-full"
                    onClick={handleDownload}
                    disabled={isDownloading}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {isDownloading ? "Downloading..." : "Download E-Ticket"}
                  </Button>

                  <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                    <AlertDescription className="text-amber-800 dark:text-amber-300">
                      <span className="font-medium">Important:</span>{" "}
                      Please save your booking reference and download your
                      ticket now. You&apos;ll need the booking reference
                      ({bookingReference}) and your email to retrieve your
                      booking details later.
                    </AlertDescription>
                  </Alert>

                  <Button variant="secondary" className="w-full">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create an account to manage bookings
                  </Button>
                </>
              )
              : (
                <div className="flex gap-4">
                  <Button className="flex-1" asChild>
                    <Link href="/bookings">
                      <Plane className="mr-2 h-4 w-4" />
                      View Booking
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleDownload}
                    disabled={isDownloading}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {isDownloading ? "Downloading..." : "Download Ticket"}
                  </Button>
                </div>
              )}

            <Button
              variant="secondary"
              className="w-full"
              onClick={handleBookNewFlight}
            >
              <Plane className="mr-2 h-4 w-4" />
              Book Another Flight
            </Button>
          </div>
        </CardContent>

        <Separator />

        {
          /* <CardFooter className="block p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Need help?</h3>

            <Accordion type="single" collapsible className="w-full">
              {isGuest && (
                <AccordionItem value="item-0">
                  <AccordionTrigger>
                    How do I access my booking details later?
                  </AccordionTrigger>
                  <AccordionContent>
                    {` As a guest, you should download your e-ticket now for safekeeping. If you need to access your
                    booking details later, you can use our "Retrieve Booking" page and enter your booking reference (
                    ${bookingReference}) and the email address you provided (${email}).`}
                  </AccordionContent>
                </AccordionItem>
              )}
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I change my flight?</AccordionTrigger>
                <AccordionContent>
                  {isGuest
                    ? "You can change your flight by visiting the 'Retrieve Booking' page, entering your booking reference and email, then selecting 'Modify Booking'. Changes may incur additional fees depending on your fare type."
                    : "You can change your flight by visiting the 'Manage Booking' section and selecting your booking. Changes may incur additional fees depending on your fare type."}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>
                  What if I don&apos;t receive my e-ticket?
                </AccordionTrigger>
                <AccordionContent>
                  If you haven&apos;t received your e-ticket within 30 minutes,
                  please check your spam folder. You can also download your
                  ticket directly from{" "}
                  {isGuest ? "this page now" : "your account"}{" "}
                  or contact our support team.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>
                  How early should I arrive at the airport?
                </AccordionTrigger>
                <AccordionContent>
                  We recommend arriving at least 2 hours before domestic flights
                  and 3 hours before international flights to allow time for
                  check-in, security, and boarding.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                <span>Need more help?</span>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/#">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Support
                </Link>
              </Button>
            </div>
          </div>
        </CardFooter> */
        }
      </Card>
    </div>
  );
}
