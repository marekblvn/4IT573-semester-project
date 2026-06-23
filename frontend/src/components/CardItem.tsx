import React, { useState, useRef, useMemo, useCallback } from "react";
import { Box, Typography } from "@mui/material";
import { UNO_COLORS } from "../theme";

export interface CardData {
  id: string;
  color: "Red" | "Blue" | "Yellow" | "Green" | "Wild";
  value:
    | "0"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "Skip"
    | "Reverse"
    | "Draw2"
    | "Wild"
    | "Wild4";
}

interface CardItemProps {
  card: CardData;
  playable: boolean;
  onPlay?: (cardId: string) => void;
  isMobile?: boolean;
}

const PLAY_THRESHOLD = -120; // Drag up 120px to play

export const CardItem: React.FC<CardItemProps> = ({
  card,
  playable,
  onPlay,
  isMobile = false,
}) => {
  const [dragY, setDragY] = useState<number>(0);
  const [dragging, setDragging] = useState<boolean>(false);
  const touchStartYRef = useRef<number>(0);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent): void => {
      if (!playable || !isMobile || !onPlay) return;
      touchStartYRef.current = e.touches[0].clientY;
      setDragging(true);
    },
    [isMobile, onPlay, playable],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent): void => {
      if (!dragging || !isMobile) return;
      const currentY = e.touches[0].clientY;
      const diffY = currentY - touchStartYRef.current;

      // Only allow dragging upwards (negative Y)
      if (diffY < 0) {
        setDragY(diffY);
      } else {
        setDragY(diffY * 0.2); // Apply resistance for dragging downwards
      }
    },
    [dragging, isMobile],
  );

  const handleTouchEnd = useCallback((): void => {
    if (!dragging || !isMobile) return;
    setDragging(false);

    if (dragY < PLAY_THRESHOLD && onPlay) {
      onPlay(card.id);
    }
    setDragY(0);
  }, [card.id, dragY, dragging, isMobile, onPlay]);

  const cardSymbol = useMemo((): string => {
    switch (card.value) {
      case "Skip":
        return "Ø";
      case "Reverse":
        return "⇆";
      case "Draw2":
        return "+2";
      case "Wild4":
        return "+4";
      case "Wild":
        return "W";
      default:
        return card.value;
    }
  }, [card.value]);

  // Card coloring
  const isWild = useMemo((): boolean => card.color === "Wild", [card.color]);
  const background = useMemo(
    (): string => (isWild ? UNO_COLORS.Wild : UNO_COLORS[card.color]),
    [card.color, isWild],
  );
  const glowColor = useMemo(
    (): string => (isWild ? "rgba(255,255,255,0.4)" : UNO_COLORS[card.color]),
    [card.color, isWild],
  );

  // Dragging translation styles
  const transformStyle = useMemo(
    (): string =>
      dragging
        ? `translateY(${dragY}px) scale(1.05)`
        : "translateY(0px) scale(1)",
    [dragY, dragging],
  );
  const transitionStyle = useMemo(
    (): string =>
      dragging
        ? "none"
        : "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    [dragging],
  );

  const cardSymbolFontSize = useMemo((): string => {
    if (card.value.length > 3) {
      return isMobile ? "1.2rem" : "1.5rem";
    } else {
      return isMobile ? "2rem" : "2.5rem";
    }
  }, [card.value.length, isMobile]);

  return (
    <Box
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={() => {
        if (!isMobile && playable && onPlay) {
          onPlay(card.id);
        }
      }}
      sx={{
        width: isMobile ? 100 : 120,
        height: isMobile ? 150 : 180,
        borderRadius: 3,
        background: background,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 1.5,
        boxSizing: "border-box",
        cursor: playable ? "pointer" : "not-allowed",
        opacity: playable ? 1 : 0.65,
        userSelect: "none",
        transform: transformStyle,
        transition: transitionStyle,
        boxShadow: playable
          ? `0 6px 16px ${glowColor}55, inset 0 0 10px rgba(255,255,255,0.2)`
          : "0 4px 8px rgba(0,0,0,0.3)",
        border: "3px solid #ffffff",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          transform:
            !isMobile && playable ? "translateY(-10px) scale(1.05)" : undefined,
          boxShadow:
            !isMobile && playable ? `0 12px 24px ${glowColor}99` : undefined,
        },
      }}
    >
      {/* Top-Left Corner Indicator */}
      <Typography
        sx={{
          fontWeight: 800,
          fontSize: isMobile ? "1.1rem" : "1.3rem",
          color: "#fff",
          textShadow: "1px 1px 2px rgba(0,0,0,0.6)",
          alignSelf: "flex-start",
        }}
      >
        {cardSymbol}
      </Typography>

      {/* Center Circle Graphic */}
      <Box
        sx={{
          width: "75%",
          height: "55%",
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          transform: "rotate(-15deg)",
          boxShadow:
            "inset 0 3px 6px rgba(0,0,0,0.2), 0 3px 6px rgba(0,0,0,0.3)",
          border: `2px solid ${isWild ? "#333" : glowColor}`,
        }}
      >
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: cardSymbolFontSize,
            color: isWild ? "#333" : glowColor,
            fontFamily: '"Outfit", sans-serif',
            transform: "rotate(15deg)", // counteract parent rotation
            textAlign: "center",
          }}
        >
          {cardSymbol}
        </Typography>
      </Box>

      {/* Bottom-Right Corner Indicator (Inverted) */}
      <Typography
        sx={{
          fontWeight: 800,
          fontSize: isMobile ? "1.1rem" : "1.3rem",
          color: "#fff",
          textShadow: "1px 1px 2px rgba(0,0,0,0.6)",
          alignSelf: "flex-end",
          transform: "rotate(180deg)",
        }}
      >
        {cardSymbol}
      </Typography>

      {/* Glow highlight for playable card in mobile */}
      {isMobile && playable && dragging && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255,255,255,0.15)",
            pointerEvents: "none",
          }}
        />
      )}
    </Box>
  );
};
