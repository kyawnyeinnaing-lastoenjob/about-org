"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import ErrorUI from "@/components/Error";
import UserLayout from "@/components/layout/user";
import { useGetSetting } from "@/lib/swr-services/setting";
import { Box } from "@mui/material";
// import { useRouter } from "next/navigation";

const Maintenance: React.FC = ({}) => {
  const router = useRouter();
  const { data } = useGetSetting();

  useEffect(() => {
    if (data) {
      const checkMaintenance = data?.some(
        (item) => item.type === "maintenance" && item.status === "ACTIVE",
      );
      if (!checkMaintenance) {
        router.replace("/");
      }
    }
  }, [router, data]);

  return (
    <UserLayout>
      <ErrorUI
        icon={
          <Box
            sx={{
              width: { xs: "120px", lg: "240px" },
              height: { xs: "80px", lg: "160px" },
            }}
          >
            <Image
              width={100}
              height={100}
              alt="404 icon"
              src={"/error/maintain.svg"}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </Box>
        }
        title="We Are Fixing Things Up for You!"
        desc="The system is currently now undergoing some maintenances and will be right back."
      />
    </UserLayout>
  );
};

export default Maintenance;
