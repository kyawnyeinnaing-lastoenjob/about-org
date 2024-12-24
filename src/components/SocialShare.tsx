"use client";
import React, { useRef, useState } from "react";
import { useAtom } from "jotai";
import Image from "next/image";
import Draggable from "react-draggable";
import {
  FacebookShareButton,
  TelegramShareButton,
  ViberShareButton,
} from "react-share";

import { useSnackbar } from "@/hooks/useSnackbar";
import { ListData } from "@/lib/swr-services/listing/types";
import ClearIcon from "@mui/icons-material/Clear";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ShareRoundedIcon from "@mui/icons-material/ShareRounded";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  PaperProps,
  PopperPlacementType,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Status } from "@prisma/client";

import { countrySlugAtom } from "./layout/user/atoms";
import { fontSize, fontWeight } from "./shared/themes/fontStyles";
import { StyledLoadingButton } from "./shared/themes/ui/styles/Button";

interface SocialShareProps {
  item: ListData;
  placement?: PopperPlacementType;
  detail?: boolean;
  fullWidth?: boolean;

  hashtag: string;
  title?: string;
}

function PaperComponent(props: PaperProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  return (
    <Draggable
      nodeRef={nodeRef as React.RefObject<HTMLElement>}
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper
        ref={nodeRef}
        {...props}
        sx={{ width: "400px", borderRadius: "16px !important" }}
      />
    </Draggable>
  );
}

const SocialShare: React.FC<SocialShareProps> = ({
  item,
  detail,
  fullWidth,
  hashtag,
  title,
}) => {
  const [isCopied, setIsCopied] = useState<boolean>();
  const [copiedText, setCopiedText] = useState<string>("");
  const [openId, setOpenId] = useState<string | number | null>(null);

  const [countrySlug] = useAtom(countrySlugAtom);

  const anchorRefs = useRef<Record<string | number, HTMLButtonElement | null>>(
    {},
  );
  const { openSnackbar } = useSnackbar();
  const theme = useTheme();

  const host = window.location.host;
  const protocol = window.location.protocol;
  const baseUrl = `${protocol}//${host}`;

  const handleToggle = (id: string | number) => {
    setOpenId((prevOpenId) => (prevOpenId === id ? null : id));
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (
      openId &&
      anchorRefs.current[openId]?.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpenId(null);
    setIsCopied(false);
  };

  const handleListKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Tab" || event.key === "Escape") {
      setOpenId(null);
    }
  };

  const handleCopyAndRetrieve = async () => {
    try {
      await navigator.clipboard.writeText(
        `${baseUrl}/${countrySlug}/detail/${item?.mainCategory?.slug}/${item?.subCategory?.slug}/${item?.id}`,
      );

      const text = await navigator.clipboard.readText();
      setCopiedText(text);
      // setIsCopied(true);

      // Reset the copied state after 2 seconds
      // setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy and retrieve URL: ", error);
    }
  };

  const handleCopied = () => {
    handleCopyAndRetrieve();
    setIsCopied(true);
    openSnackbar("Copied to clipboard", "info");
  };

  return (
    <React.Fragment>
      {detail ? (
        <StyledLoadingButton
          ref={(el) => {
            if (el) {
              anchorRefs.current[item.id] = el;
            }
          }}
          onClick={() => {
            handleToggle(item.id);
            handleCopyAndRetrieve();
          }}
          sx={{
            color: theme.palette.colors.white,
            border: 0,
            background: `linear-gradient(90deg, ${theme.palette.colors.orange[900]} 0%, ${theme.palette.colors.orange[900]} 100%)`,
            minWidth: 140,
            fontSize: theme.spacing(2),
            ...(fullWidth && { width: "100%" }),
          }}
        >
          <ShareOutlinedIcon
            sx={{
              width: 22,
              height: 22,
              marginRight: theme.spacing(1),
              color: theme.palette.colors.white,
            }}
          />
          Share
        </StyledLoadingButton>
      ) : (
        <IconButton
          type="button"
          size="small"
          className="icon-btn"
          ref={(el) => {
            if (el) {
              anchorRefs.current[item.id] = el;
            }
          }}
          onClick={() => {
            handleToggle(item.id);
            handleCopyAndRetrieve();
          }}
        >
          <Image
            src="/uploads/icons/share.svg"
            width={16}
            height={16}
            alt="share"
          />
        </IconButton>
      )}
      <Dialog
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={anchorRefs.current[item.id] as any}
        open={openId === item.id}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ bgcolor: theme.palette.colors.white, p: "16px 24px" }}
        >
          <DialogTitle
            sx={{
              cursor: "move",
              color: theme.palette.colors.blue[900],
              fontWeight: fontWeight.semibold,
              fontSize: fontSize.xl,
              p: 0,
            }}
            id="draggable-dialog-title"
          >
            Share Now
          </DialogTitle>
          <IconButton
            sx={{ borderRadius: "50%", border: "none", p: 0 }}
            onClick={() => {
              setOpenId(null);
              setIsCopied(false);
            }}
          >
            <ClearIcon sx={{ color: theme.palette.colors.blue[200] }} />
          </IconButton>
        </Stack>
        <DialogContent
          sx={{ px: 3, pt: 0, bgcolor: theme.palette.colors.white }}
        >
          <MenuList
            autoFocusItem={openId === item.id}
            id="composition-menu"
            aria-labelledby="composition-button"
            onKeyDown={handleListKeyDown}
            sx={{ p: 0 }}
          >
            {item.shareToFacebook === Status.ACTIVE && (
              <FacebookShareButton
                url={copiedText}
                hashtag={hashtag}
                title={title}
                className="share-btn"
              >
                <MenuItem sx={{ mb: 2 }}>
                  <ListItemIcon>
                    <Image
                      src="/uploads/icons/social-share/facebook.svg"
                      width={32}
                      height={32}
                      alt="copy"
                    />
                  </ListItemIcon>
                  <ListItemText sx={{ textAlign: "left" }}>
                    Share on Facebook
                  </ListItemText>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    <ShareRoundedIcon
                      sx={{
                        color: theme.palette.colors.blue[200],
                        width: 20,
                        height: 20,
                      }}
                    />
                  </Typography>
                </MenuItem>
              </FacebookShareButton>
            )}
            {item.shareToTelegram === Status.ACTIVE && (
              <TelegramShareButton
                url={copiedText}
                title={title}
                className="share-btn"
              >
                <MenuItem sx={{ mb: 2 }}>
                  <ListItemIcon>
                    <Image
                      src="/uploads/icons/social-share/telegram.svg"
                      width={32}
                      height={32}
                      alt="copy"
                    />
                  </ListItemIcon>
                  <ListItemText sx={{ textAlign: "left" }}>
                    Share on Telegram
                  </ListItemText>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    <ShareRoundedIcon
                      sx={{
                        color: theme.palette.colors.blue[200],
                        width: 20,
                        height: 20,
                      }}
                    />
                  </Typography>
                </MenuItem>
              </TelegramShareButton>
            )}
            {item.shareToViber === Status.ACTIVE && (
              <ViberShareButton
                url={copiedText}
                title={title}
                className="share-btn"
              >
                <MenuItem sx={{ mb: 2 }}>
                  <ListItemIcon>
                    <Image
                      src="/uploads/icons/social-share/viber.svg"
                      width={32}
                      height={32}
                      alt="copy"
                    />
                  </ListItemIcon>
                  <ListItemText sx={{ textAlign: "left" }}>
                    Share on Viber
                  </ListItemText>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    <ShareRoundedIcon
                      sx={{
                        color: theme.palette.colors.blue[200],
                        width: 20,
                        height: 20,
                      }}
                    />
                  </Typography>
                </MenuItem>
              </ViberShareButton>
            )}
            <MenuItem
              sx={{
                bgcolor: theme.palette.colors.blue[50],
                p: theme.spacing(2),
                borderRadius: theme.spacing(2),
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  WebkitLineClamp: 1,
                  width: "calc(100% - 30px)",
                  textWrap: "wrap",
                  color: theme.palette.colors.blue[900],
                  ...(isCopied && {
                    bgcolor: theme.palette.colors.blue[400],
                    color: theme.palette.colors.white,
                    borderRadius: 1,
                    px: theme.spacing(1),
                  }),
                }}
              >
                {copiedText}
              </Typography>
              <Box onClick={handleCopied}>
                <ContentCopyRoundedIcon
                  sx={{ color: theme.palette.colors.blue[900] }}
                />
              </Box>
            </MenuItem>
          </MenuList>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default SocialShare;
