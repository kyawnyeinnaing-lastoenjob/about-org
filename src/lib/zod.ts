import { z } from "zod";

// import { z.nativeEnum } from '@prisma/client';
import { Status } from "@prisma/client";

export const userSchema = z.object({
  name: z
    .string({ required_error: "User Name is required!" })
    .min(1, "User Name is required!"),
  userId: z
    .string({ required_error: "User ID is required!" })
    .min(1, "User ID is required!"),
  email: z
    .string({ required_error: "Email is required!" })
    .min(1, "Email is required!"),
  password: z
    .string({ required_error: "Password is required!" })
    .min(1, "Password is required!"),
  status: z.nativeEnum(Status).optional(),
  phone: z.string().optional(),
  roleId: z.string().optional(),
  image: z.string().optional(),
});
export type UserProps = z.infer<typeof userSchema>;

export const userUpdateSchema = z.object({
  name: z.string().optional(),
  userId: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
  status: z.nativeEnum(Status),
  phone: z.string().optional(),
  image: z.string().optional(),
});
export type UserUpdateProps = z.infer<typeof userSchema>;

export const loginSchema = z
  .object({
    userId: z.string().min(1, "User ID is required!").optional(),
    email: z.string().min(1, "Email is required!").optional(),
    password: z.string().min(1, "Password is required!"),
  })
  .refine((data) => data.userId || data.email, {
    message: "Either User ID or Email is required!",
    path: ["userId", "email"],
  });
export type LoginProps = z.infer<typeof loginSchema>;

export const aboutUsSchema = z.object({
  description: z.string().min(1, "Description is required"),
  slogan: z.string().min(1, "Slogan is required"),
  image: z.string().optional(),
});

export type AboutProps = z.infer<typeof aboutUsSchema>;

export const swapSortNumberSchema = z.object({
  id1: z.string().min(1, "ID 1 is required!"),
  id2: z.string().min(1, "ID 2 is required!"),
});
export type SwapSortNumberProps = z.infer<typeof swapSortNumberSchema>;

export const countrySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Country Name is required!"),
  status: z.nativeEnum(Status),
  countryCode: z.string().min(1, "Country Code is required!"),
  isDeleted: z.boolean().optional(),
  flag: z.string().min(1, "flag is required!"),
});
export type CountryProps = z.infer<typeof countrySchema>;

export const mainCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Category Name is required!"),
  categoryImage: z.string().optional(),
  countryId: z.string().min(1, "Country ID is required!"),
  status: z.nativeEnum(Status),
  isDeleted: z.boolean().optional(),
});
export type MainCategoryProps = z.infer<typeof mainCategorySchema>;

export const subCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Sub Category Name is required!"),
  status: z.nativeEnum(Status),
  isDeleted: z.boolean().optional(),
  countryId: z.string(),
  mainCategoryId: z.string().min(1, "Category ID is required!"),
  subCategoryImage: z.string().optional(),
});
export type SubCategoryProps = z.infer<typeof subCategorySchema>;

export const listingSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "listing title is required!"),
  shortDescription: z.string().min(1, "Short description is required!"),
  description: z.string().min(1, "listing description is required!"),
  mainCategoryId: z.string().min(1, "MainCategory ID is required!"),
  countryId: z.string().min(1, "country ID is required!"),
  detailImage: z.string().optional(),
  subCategoryId: z.string().optional(),
  status: z.nativeEnum(Status),
  isDeleted: z.boolean().optional(),
  shareHashTag: z.string().optional(),
  shareTitle: z.string().optional(),
  shareDescription: z.string().optional(),
  shareToFacebook: z.nativeEnum(Status),
  shareToViber: z.nativeEnum(Status),
  shareToTelegram: z.nativeEnum(Status),
});
export type ListingProps = z.infer<typeof listingSchema>;

// Define a Zod schema for the Social model
export const SocialSchema = z.object({
  name: z.string(),
  url: z.string().min(1, "Url is required!").url(),
  slug: z.string().optional(),
  id: z.string().optional(),
  contactId: z.string().optional(),
  status: z.nativeEnum(Status),
  image: z.string().optional(),
});

// Define a Zod schema for the ContactUs model
export const contactUsSchema = z.object({
  phone: z.array(
    z.object({
      value: z.string().min(1, "Phone number is required"),
      isEditing: z.boolean().optional(),
    }),
  ),
  email: z.array(
    z.object({
      value: z.string().email("Email is required").min(1, "Email is required"),
      isEditing: z.boolean().optional(),
    }),
  ),
  description: z.string().min(1, "Description is required"),
  socials: z.array(SocialSchema),
});
export type ContactProps = z.infer<typeof contactUsSchema>;
