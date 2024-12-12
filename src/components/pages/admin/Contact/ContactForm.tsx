import * as React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import RTEEditor from "@/components/shared/themes/ui/TextEditor";
import { contactUsSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AddIcon from "@mui/icons-material/Add";
import AddIcCallIcon from "@mui/icons-material/AddIcCall";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { LoadingButton } from "@mui/lab";
import { Stack } from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid2";
import { styled } from "@mui/system";
import { Status } from "@prisma/client";

import InputList from "./Form/InputList";
import SocialsInputList from "./Form/SocialsInputList";

interface InputItem {
  value: string;
  isEditing: boolean;
}

interface SocialInput {
  name: string;
  url: string;
  id: string;
  contactId: string;
  slug: string;
  status: string;
  image: string;
}

interface ContactUsForm {
  phone: InputItem[];
  email: InputItem[];
  socials: SocialInput[];
  description: string;
}

interface ContactProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trigger: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contactData: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateTrigger: any;
  isMutating: boolean;
}

const FormGrid = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "column",
}));

const ContactCreate: React.FC<ContactProps> = ({
  trigger,
  updateTrigger,
  contactData,
  isMutating,
}) => {
  const {
    control,
    handleSubmit,
    // reset,
    setValue,
    formState: { errors },
  } = useForm<ContactUsForm>({
    resolver: zodResolver(contactUsSchema),
    defaultValues: {
      phone: [{ value: "", isEditing: true }],
      email: [{ value: "", isEditing: true }],
      socials: [
        {
          name: "",
          url: "",
          slug: "",
          id: "",
          contactId: "",
          status: Status.ACTIVE,
          image: "",
        },
      ],
      description: "",
    },
  });

  const onSubmit: SubmitHandler<ContactUsForm> = async (data) => {
    const newPhone = data?.phone?.map((p) => ({
      value: p.value,
    }));
    const newEmail = data?.email?.map((e) => ({
      value: e.value,
    }));

    if (contactData) {
      await updateTrigger({
        phone: newPhone,
        email: newEmail,
        socials: data.socials,
        description: data.description,
      });
    } else {
      await trigger({
        phone: newPhone,
        email: newEmail,
        socials: data.socials,
        description: data.description,
      });
    }
  };

  React.useEffect(() => {
    setValue("description", contactData?.description);
    setValue("phone", contactData?.phone);
    setValue("email", contactData?.email);
    setValue("socials", contactData?.socials);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactData]);

  return (
    <Stack component="form">
      <Grid container spacing={3}>
        <FormGrid size={{ xs: 12, md: 6 }} sx={{ display: "none" }}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => {
              return (
                <InputList
                  label="Phone Number"
                  type="phone"
                  placeholder="Enter phone number"
                  value={field.value}
                  onChange={field.onChange}
                  error={!!errors.phone}
                  helperText={errors?.phone}
                  icon={
                    <AddIcCallIcon sx={{ width: "20px", height: "20px" }} />
                  }
                />
              );
            }}
            name="phone"
          />
        </FormGrid>
        <FormGrid size={{ xs: 12, md: 6 }} sx={{ display: "none" }}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <InputList
                label="Email"
                type="email"
                placeholder="Enter email"
                value={field.value}
                onChange={field.onChange}
                error={!!errors.email}
                helperText={errors?.email}
                icon={
                  <MarkEmailReadIcon sx={{ width: "20px", height: "20px" }} />
                }
              />
            )}
            name="email"
          />
        </FormGrid>
        <FormGrid size={{ xs: 12 }} sx={{ display: "none" }}>
          <FormLabel htmlFor="address1" required>
            Description
          </FormLabel>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => {
              return (
                <RTEEditor
                  value={field.value || ""}
                  onChange={field.onChange}
                  error={!!errors.description}
                  helperText={errors?.description?.message || ""}
                />
              );
            }}
            name="description"
          />
        </FormGrid>
        <FormGrid size={{ xs: 12 }}>
          <Controller
            control={control}
            name="socials"
            rules={{
              required: false,
            }}
            render={({ field }) => {
              return (
                <SocialsInputList
                  label="Socials"
                  value={field.value || ""}
                  onChange={field.onChange}
                  error={!!errors.socials}
                  helperText={errors?.socials}
                  icon={
                    <AddIcCallIcon sx={{ width: "20px", height: "20px" }} />
                  }
                />
              );
            }}
          />
        </FormGrid>
        <FormGrid size={{ xs: 12 }}>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            spacing={2}
          >
            {/* <Button
              variant="outlined"
              onClick={() =>
                reset({
                  phone: [{ value: '', isEditing: true }],
                  email: [{ value: '', isEditing: true }],
                  description: '',
                })
              }
            >
              Cancel
            </Button> */}
            {contactData ? (
              <LoadingButton
                variant="contained"
                sx={{ width: "150px" }}
                onClick={handleSubmit(onSubmit)}
                loading={isMutating}
                // disabled={!isValid}
              >
                <AddIcon sx={{ mr: "5px" }} />
                Save
              </LoadingButton>
            ) : (
              <LoadingButton
                variant="contained"
                sx={{ width: "150px" }}
                onClick={handleSubmit(onSubmit)}
                loading={isMutating}
                // disabled={!isValid}
              >
                <AddIcon sx={{ mr: "5px" }} />
                Create
              </LoadingButton>
            )}
          </Stack>
        </FormGrid>
      </Grid>
    </Stack>
  );
};

export default ContactCreate;
