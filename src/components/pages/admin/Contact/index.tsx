"use client";
import React from "react";

import Layout from "@/components/layout/admin";
import { useSnackbar } from "@/hooks/useSnackbar";
import {
  useContactMutation,
  useGetContacts,
  useUpdateContact,
} from "@/lib/swr-services/contact";
import { ContactProps } from "@/lib/zod";

import ContactForm from "./ContactForm";

const ContactUs: React.FC = () => {
  const breadcrumbs = [
    {
      title: "Contact Us",
      link: null,
    },
  ];

  const { openSnackbar } = useSnackbar();

  // api
  const { data: contactData } = useGetContacts();
  const { trigger, isMutating: createMutating } = useContactMutation();
  const { trigger: updateTrigger, isMutating: updateMutating } =
    useUpdateContact();
  const handleCreateContact = async (data: ContactProps) => {
    await trigger(data, {
      onSuccess: (res) => {
        openSnackbar(res.data.message);
      },
    });
  };
  const handleUpdateContact = async (data: ContactProps) => {
    await updateTrigger(
      { data, id: contactData?.id },
      {
        onSuccess: (res) => {
          openSnackbar(res.data.message);
        },
      },
    );
  };
  return (
    <Layout title="Contact Us" breadcrumbs={breadcrumbs}>
      <ContactForm
        trigger={handleCreateContact}
        updateTrigger={handleUpdateContact}
        contactData={contactData}
        isMutating={createMutating || updateMutating}
      />
    </Layout>
  );
};

export default ContactUs;
