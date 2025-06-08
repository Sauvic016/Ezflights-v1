"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";

import { Alert, AlertDescription } from "@repo/ui/components/ui/alert";
import {
  AlertTriangle,
  ChevronRight,
  CreditCard,
  Gift,
  Shield,
  Wallet,
} from "lucide-react";
import { formSchema } from "@/schemas/PaymentFormSchema";
import axios from "axios";
import { useFlightStore, useUserDetails } from "@/store/Store";
import { useBookingStore } from "@/store/booking-store";
import SuccessComponent from "@/components/SuccessComponent";
import { useRouter } from "next/navigation";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
const paymentMethods = [
  {
    id: "CREDIT_CARD",
    title: "Credit Card",
    icon: CreditCard,
    description: "Pay with Visa, Mastercard, or American Express",
  },
  {
    id: "DEBIT_CARD",
    title: "Debit Card",
    icon: CreditCard,
    description: "Pay with your debit card",
  },
  {
    id: "BANK_TRANSFER",
    title: "Bank Transfer",
    icon: Wallet,
    description: "Pay using bank transfer",
  },
  {
    id: "PAYPAL",
    title: "PayPal",
    icon: Gift,
    description: "Pay with PayPal",
  },
  {
    id: "WALLET",
    title: "Digital Wallet",
    icon: Gift,
    description: "Pay with other digital wallets",
  },
];
type paymentType =
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "BANK_TRANSFER"
  | "PAYPAL"
  | "WALLET"
  | undefined;

export default function PaymentPage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] =
    useState<paymentType>("CREDIT_CARD");
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [bookingReference, setBookingReference] = useState("");
  const currentYear = new Date().getFullYear();
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const contact = useUserDetails((state) => state.contact);
  const travelers = useUserDetails((state) => state.travelers);
  const flight = useFlightStore((state) => state.flight);
  const selectedSeats = useBookingStore((state) => state.selectedSeats);
  const totalPrice = useBookingStore((state) => state.totalPrice);

  const removeFlight = useFlightStore((state) => state.removeFlight);
  const removeContact = useUserDetails((state) => state.removeContact);
  const clearTravelers = useUserDetails((state) => state.clearTravelers);
  const clearBooking = useBookingStore((state) => state.clearBooking);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: "CREDIT_CARD",
      cardNumber: "",
      cardHolder: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      walletType: "",
    },
  });

  useEffect(() => {
    // Check if we have all required data
    const hasRequiredData = flight && contact && travelers.length > 0;

    if (!hasRequiredData) {
      // Clear all data
      removeFlight();
      removeContact();
      clearTravelers();
      clearBooking();

      // Show toast and redirect

      router.push("/");
    }
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    form.reset({
      paymentMethod: selectedMethod,
    });
  }, [selectedMethod, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const headers = {
      "x-idempotency-key": idempotencyKey,
      "Content-Type": "application/json",
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_booking_service}/api/create-booking`,
      {
        flightId: flight?.id,
        contact: {
          email: contact?.email,
          phone: contact?.phone,
        },
        travelers: travelers.map((traveler, index) => ({
          firstName: traveler.firstName,
          lastName: traveler.lastName,
          dob: traveler.dob,
          gender: traveler.gender,
          seatNumber: selectedSeats[index]?.seatNum,
        })),
        paymentMethod: values.paymentMethod,
        totalAmount: totalPrice,
      },
      { headers },
    );

    setBookingReference("ABC" + Math.floor(Math.random() * 1000000).toString());
    setPaymentSuccessful(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20">
      <AnimatePresence mode="wait">
        {!paymentSuccessful ? (
          <motion.div
            key="payment-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto p-4 pt-32 max-w-4xl"
          >
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="space-y-8"
            >
              <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 mb-4">
                <AlertTriangle className="h-4 w-4 text-amber-800 dark:text-amber-300" />
                <AlertDescription className="text-amber-800 dark:text-amber-300">
                  <span className="font-medium">Important:</span> Please do not
                  refresh this page while making your payment. If you refresh,
                  you will lose your booking progress.
                </AlertDescription>
              </Alert>

              <motion.div
                variants={fadeInUp}
                className="flex items-center space-x-4"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-4xl font-bold text-primary">
                  Complete Payment
                </h1>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="border-2 border-white/20 bg-white/40 backdrop-blur-md shadow-xl">
                  <CardHeader className="bg-white/40 backdrop-blur-sm border-b border-white/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Payment Details</CardTitle>
                        <CardDescription>
                          Complete your booking by making the payment
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Shield className="h-4 w-4" />
                        <span>Secure Payment</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="md:col-span-2">
                            <FormField
                              control={form.control}
                              name="paymentMethod"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Payment Method</FormLabel>
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={(value) => {
                                        field.onChange(value);
                                        setSelectedMethod(value as paymentType);
                                      }}
                                      defaultValue={field.value}
                                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    >
                                      {paymentMethods.map((method) => {
                                        const Icon = method.icon;
                                        return (
                                          <FormItem key={method.id}>
                                            <FormControl>
                                              <div className="relative">
                                                <RadioGroupItem
                                                  value={method.id}
                                                  id={method.id}
                                                  className="peer sr-only"
                                                />
                                                <Label
                                                  htmlFor={method.id}
                                                  className="flex items-start space-x-4 p-4 rounded-lg border-2 border-white/20 bg-white/20 backdrop-blur-sm cursor-pointer transition-all hover:bg-white/30 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                                                >
                                                  <Icon className="h-6 w-6 text-primary" />
                                                  <div>
                                                    <div className="font-semibold">
                                                      {method.title}
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">
                                                      {method.description}
                                                    </div>
                                                  </div>
                                                </Label>
                                              </div>
                                            </FormControl>
                                          </FormItem>
                                        );
                                      })}
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {(selectedMethod === "CREDIT_CARD" ||
                            selectedMethod === "DEBIT_CARD") && (
                            <>
                              <FormField
                                control={form.control}
                                name="cardNumber"
                                render={({ field }) => (
                                  <FormItem className="md:col-span-2">
                                    <FormLabel>Card Number</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="1234 5678 9012 3456"
                                        className="bg-white/50 border-white/20"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="cardHolder"
                                render={({ field }) => (
                                  <FormItem className="md:col-span-2">
                                    <FormLabel>Cardholder Name</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="John Doe"
                                        className="bg-white/50 border-white/20"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="expiryMonth"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Expiry Month</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger className="bg-white/50 border-white/20">
                                          <SelectValue placeholder="Month" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {Array.from({ length: 12 }, (_, i) => {
                                          const month = (i + 1)
                                            .toString()
                                            .padStart(2, "0");
                                          return (
                                            <SelectItem
                                              key={month}
                                              value={month}
                                            >
                                              {month}
                                            </SelectItem>
                                          );
                                        })}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="expiryYear"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Expiry Year</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger className="bg-white/50 border-white/20">
                                          <SelectValue placeholder="Year" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {Array.from({ length: 10 }, (_, i) => {
                                          const year = (
                                            currentYear + i
                                          ).toString();
                                          return (
                                            <SelectItem key={year} value={year}>
                                              {year}
                                            </SelectItem>
                                          );
                                        })}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="cvv"
                                render={({ field }) => (
                                  <FormItem className="md:col-span-2">
                                    <FormLabel>CVV</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="password"
                                        maxLength={4}
                                        placeholder="•••"
                                        className="bg-white/50 border-white/20 max-w-[120px]"
                                        autoComplete="false"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </>
                          )}

                          {selectedMethod === "BANK_TRANSFER" && (
                            <FormField
                              control={form.control}
                              name="bankAccount"
                              render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                  <FormLabel>Bank Account Number</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Enter your bank account number"
                                      className="bg-white/50 border-white/20"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}

                          {selectedMethod === "WALLET" && (
                            <FormField
                              control={form.control}
                              name="walletType"
                              render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                  <FormLabel>Select Wallet</FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="bg-white/50 border-white/20">
                                        <SelectValue placeholder="Select Wallet" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="gpay">
                                        Google Pay
                                      </SelectItem>
                                      <SelectItem value="applepay">
                                        Apple Pay
                                      </SelectItem>
                                      <SelectItem value="other">
                                        Other Wallet
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>

                        <div className="flex justify-end pt-4">
                          <Button
                            type="submit"
                            className="group bg-primary/80 backdrop-blur-sm hover:bg-primary/90"
                          >
                            Pay Now
                            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="flex items-center justify-center space-x-2 text-sm text-muted-foreground"
              >
                <Shield className="h-4 w-4" />
                <span>Your payment information is secure and encrypted</span>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="success-component"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SuccessComponent
              email={contact?.email || "user@example.com"}
              bookingReference={bookingReference}
              totalPaid={totalPrice.toString()}
              currency="USD"
              isGuest={true}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
