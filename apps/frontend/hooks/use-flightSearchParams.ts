import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import * as z from "zod";
import { flightSearchSchema } from "@/schemas/FlightSearchSchema";

type FlightSearchValues = z.infer<typeof flightSearchSchema>;

export const useFlightSearchParams = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd");
  };

  const getSearchParams = () => {
    try {
      const adults = parseInt(searchParams?.get("adults") || "1");
      const children = parseInt(searchParams?.get("children") || "0");

      return {
        flightType:
          (searchParams?.get("flightType") as "oneWay" | "roundTrip") ||
          "oneWay",
        from: searchParams?.get("from") || "",
        to: searchParams?.get("to") || "",
        departureDate: searchParams?.get("departureDate")
          ? new Date(searchParams.get("departureDate")!)
          : new Date(),
        returnDate: searchParams?.get("returnDate")
          ? new Date(searchParams.get("returnDate")!)
          : null,
        passengers: {
          adults,
          children,
        },
      };
    } catch (error) {
      console.error("Error parsing search params:", error);
      return {
        flightType: "oneWay" as const,
        from: "",
        to: "",
        departureDate: new Date(),
        returnDate: null,
        passengers: {
          adults: 1,
          children: 0,
        },
      };
    }
  };

  const updateSearchParams = (values: FlightSearchValues) => {
    try {
      const searchParamsObject = {
        flightType: values.flightType,
        from: values.from,
        to: values.to,
        departureDate: formatDate(values.departureDate),
        returnDate: values.returnDate ? formatDate(values.returnDate) : "",
        adults: values.passengers.adults.toString(),
        children: values.passengers.children.toString(),
      };
      const params = new URLSearchParams(searchParamsObject);
      router.push(`/flights?${params.toString()}`);
    } catch (error) {
      console.error("Error updating search params:", error);
    }
  };

  return {
    getSearchParams,
    updateSearchParams,
  };
};
