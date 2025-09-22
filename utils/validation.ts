import { z } from "zod";

export const isValidEmail = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

export const dateValidator = z.preprocess(
  (arg) => {
    if (typeof arg === "string") {
      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
      if (!isoRegex.test(arg)) {
        return undefined;
      }
      return new Date(arg);
    }

    if (arg instanceof Date) {
      return arg;
    }

    return undefined;
  },
  z.date({
    required_error: "Date is required",
    invalid_type_error: "Date must be a valid JavaScript Date",
  })
    .refine((date) => !isNaN(date.getTime()), {
      message: "Date is invalid or not recognized",
    })
    .refine(
      (date) => date >= new Date("1900-01-01") && date <= new Date("2100-12-31"),
      { message: "Date must be between 1900 and 2100" }
    )
);
