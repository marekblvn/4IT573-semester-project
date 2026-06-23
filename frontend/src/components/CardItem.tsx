import React, { useState, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { UNO_COLORS } from '../theme';

export interface CardData {
  id: string;
  color: 'Red' | 'Blue' | 'Yellow' | 'Green' | 'Wild';
  value: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'Skip' | 'Reverse' | 'Draw2' | 'Wild' | 'Wild4';
}

interface CardItemProps {
  card: CardData;
  playable: boolean;
  onPlay?: (cardId: string) => void;
  isMobile?: boolean;
}

export const CardItem: React.FC<CardItemProps> = ({ card, playable, onPlay, isMobile = false }) => {
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const touchStartY = useRef(0);
  const PLAY_THRESHOLD = -120; // Drag up 120px to play

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!playable || !isMobile || !onPlay) return;
    touchStartY.current = e.touches[0].clientY;
    setDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging || !isMobile) return;
    const currentY = e.touches[0].clientY;
    const diffY = currentY - touchStartY.current;

    // Only allow dragging upwards (negative Y)
    if (diffY < 0) {
      setDragY(diffY);
    } else {
      setDragY(diffY * 0.2); // Apply resistance for dragging downwards
    }
  };

  const handleTouchEnd = () => {
    if (!dragging || !isMobile) return;
    setDragging(false);

    if (dragY < PLAY_THRESHOLD && onPlay) {
      onPlay(card.id);
    }
    setDragY(0);
  };

  const getCardSymbol = (value: string) => {
    switch (value) {
      case 'Skip': return 'Ø';
      case 'Reverse': return '⇆';
      case 'Draw2': return '+2';
      case 'Wild4': return '+4';
      case 'Wild': return 'W';
      default: return value;
    }
  };

  // Card coloring
  const isWild = card.color === 'Wild';
  const background = isWild ? UNO_COLORS.Wild : UNO_COLORS[card.color];
  const glowColor = isWild ? 'rgba(255,255,255,0.4)' : UNO_COLORS[card.color];

  // Dragging translation styles
  const transformStyle = dragging
    ? `translateY(${dragY}px) scale(1.05)`
    : 'translateY(0px) scale(1)';
  const transitionStyle = dragging ? 'none' : 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 1.5,
        boxSizing: 'border-box',
        cursor: playable ? 'pointer' : 'not-allowed',
        opacity: playable ? 1 : 0.65,
        userSelect: 'none',
        transform: transformStyle,
        transition: transitionStyle,
        boxShadow: playable 
          ? `0 6px 16px ${glowColor}55, inset 0 0 10px rgba(255,255,255,0.2)`
          : '0 4px 8px rgba(0,0,0,0.3)',
        border: '3px solid #ffffff',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: !isMobile && playable ? 'translateY(-10px) scale(1.05)' : undefined,
          boxShadow: !isMobile && playable ? `0 12px 24px ${glowColor}99` : undefined,
        },
      }}
    >
      {/* Top-Left Corner Indicator */}
      <Typography
        sx={{
          fontWeight: 800,
          fontSize: isMobile ? '1.1rem' : '1.3rem',
          color: '#fff',
          textShadow: '1px 1px 2px rgba(0,0,0,0.6)',
          alignSelf: 'flex-start',
        }}
      >
        {getCardSymbol(card.value)}
      </Typography>

      {/* Center Circle Graphic */}
      <Box
        sx={{
          width: '75%',
          height: '55%',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          transform: 'rotate(-15deg)',
          boxShadow: 'inset 0 3px 6px rgba(0,0,0,0.2), 0 3px 6px rgba(0,0,0,0.3)',
          border: `2px solid ${isWild ? '#333' : glowColor}`,
        }}
      >
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: isMobile 
              ? (card.value.length > 3 ? '1.2rem' : '2rem') 
              : (card.value.length > 3 ? '1.5rem' : '2.5rem'),
            color: isWild ? '#333' : glowColor,
            fontFamily: '"Outfit", sans-serif',
            transform: 'rotate(15deg)', // counteract parent rotation
            textAlign: 'center',
          }}
        >
          {getCardSymbol(card.value)}
        </Typography>
      </Box>

      {/* Bottom-Right Corner Indicator (Inverted) */}
      <Typography
        sx={{
          fontWeight: 800,
          fontSize: isMobile ? '1.1rem' : '1.3rem',
          color: '#fff',
          textShadow: '1px 1px 2px rgba(0,0,0,0.6)',
          alignSelf: 'flex-end',
          transform: 'rotate(180deg)',
        }}
      >
        {getCardSymbol(card.value)}
      </Typography>

      {/* Glow highlight for playable card in mobile */}
      {isMobile && playable && dragging && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255,255,255,0.15)',
            pointerEvents: 'none',
          }}
        />
      )}
    </Box>
  );
};
