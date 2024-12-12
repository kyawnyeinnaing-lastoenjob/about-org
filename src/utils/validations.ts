import { z } from "zod";

interface ValidationErrors {
  [key: string]: string;
}

export const validateData = async (
  schema: z.ZodSchema<unknown>,
  data: unknown,
): Promise<ValidationErrors | null> => {
  try {
    await schema.parseAsync(data);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors.reduce((acc: ValidationErrors, err) => {
        const key = err.path[0];
        if (typeof key === "string" && err.message) {
          acc[key] = err.message;
        }
        return acc;
      }, {});
    }
    return { general: "An unknown error occurred." };
  }
};

// import { ZodSchema } from "zod";

// interface ValidationErrors {
//   [key: string]: string;
// }

// export const validateData = <T>(
//   schema: ZodSchema<T>,
//   data: T
// ): ValidationErrors | null => {
//   const result = schema.safeParse(data);

//   if (!result.success) {
//     const errors: ValidationErrors = {};
//     const fieldErrors = result.error.formErrors.fieldErrors as Record<
//       string,
//       string[]
//     >;

//     for (const [key, messages] of Object.entries(fieldErrors)) {
//       if (
//         Array.isArray(messages) &&
//         messages.length > 0 &&
//         messages[0] !== undefined
//       ) {
//         errors[key] = messages[0];
//       }
//     }

//     return errors;
//   }

//   return null;
// };
