import prisma from "@/lib/client";
import { ContactUs, Social, Status } from "@prisma/client";
// import { ContactProps } from "@/lib/zod";

// Create a new ContactUs
type ContactUsProps = {
  phone: string[];
  email: string[];
  description: string;
  socials: Omit<Social, "id" | "contactId">[];
};
export const createContact = async (data: ContactUsProps) => {
  try {
    const newContact = await prisma.contactUs.create({
      data: {
        phone: data.phone,
        email: data.email,
        description: data.description,
        Socials: {
          create: data.socials.map((each) => ({
            name: each.name,
            url: each.url,
            slug: each.name.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "_") || "",
            status: each.status || Status.ACTIVE,
            ...(each.image !== null &&
              each.image.length > 0 && {
                image: each.image,
              }),
          })),
        },
      },
      include: {
        Socials: true,
      },
    });
    return {
      status: 201,
      message: "Created!",
      data: newContact,
    };
  } catch (error) {
    console.error("Error creating contact:", error);
    throw error;
  }
};

// // Read a ContactUs by ID
// export const getContactById = async (id: string) => {
//   try {
//     const contact = await prisma.contactUs.findUnique({
//       where: { id },
//       include: {
//         socials: true
//       }
//     });
//     return contact;
//   } catch (error) {
//     console.error("Error fetching contact:", error);
//     throw error;
//   }
// };

// Update a ContactUs by ID
export const updateContact = async (
  id: string,
  data: Partial<Omit<ContactUs, "id">> & {
    Socials: Omit<Social, "contactId">[];
  },
) => {
  try {
    // delete unwanted social data
    await prisma.social.deleteMany({
      where: {
        id: {
          notIn: data.Socials.map((social) => social.id),
        },
      },
    });

    const updatedContact = await prisma.contactUs.update({
      where: { id },
      data: {
        ...data,
        Socials: {
          upsert: data.Socials.map((each) => ({
            where: { id: each.id ?? undefined },
            create: {
              name: each.name,
              url: each.url,
              slug: each.slug,
              status: each.status,
              ...(each.image !== null &&
                each.image.length > 0 && {
                  image: each.image,
                }),
            },
            update: {
              name: each.name,
              url: each.url,
              status: each.status,
              ...(each.image !== null &&
                each.image.length > 0 && {
                  image: each.image,
                }),
            },
          })),
        },
      },
      include: {
        Socials: true,
      },
    });

    return {
      message: "Updated!",
      status: 200,
      data: updatedContact,
    };
  } catch (error) {
    console.log("error => ", error);
    throw error;
  }
};

// // Delete a ContactUs by ID
// export const deleteContact = async (id: string) => {
//   try {
//     await prisma.contactUs.delete({
//       where: { id }
//     });
//     return { message: "Contact deleted successfully" };
//   } catch (error) {
//     console.error("Error deleting contact:", error);
//     throw error;
//   }
// };

// Get all Contacts
export const getContact = async () => {
  try {
    const contacts = await prisma.contactUs.findMany({
      include: {
        Socials: true,
      },
    });
    return {
      data: contacts,
      message: "Successfully!",
      status: 200,
    };
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw error;
  }
};
