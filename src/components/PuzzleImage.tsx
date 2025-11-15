"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

interface PuzzleImageProps {
  src: string;
  alt: string;
  gridCols?: number;
  gridRows?: number;
}

export default function PuzzleImage({
  src,
  alt,
  gridCols = 6,
  gridRows = 4,
}: PuzzleImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // クライアントサイドのみでランダム値を生成
  const initialPositions = useMemo(() => {
    if (!isMounted) return [];

    const totalPieces = gridCols * gridRows;
    return Array.from({ length: totalPieces }, (_, index) => {
      const row = Math.floor(index / gridCols);
      const col = index % gridCols;

      // ランダムなオフセット（画面外から）
      const randomX = (Math.random() - 0.5) * 1500;
      const randomY = (Math.random() - 0.5) * 1500;
      const randomRotation = (Math.random() - 0.5) * 360;
      const randomScale = 0.3 + Math.random() * 0.4;

      return {
        x: randomX,
        y: randomY,
        rotation: randomRotation,
        scale: randomScale,
        row,
        col,
      };
    });
  }, [isMounted, gridCols, gridRows]);

  useEffect(() => {
    // コンポーネントがマウントされたことを記録
    setIsMounted(true);

    // 少し遅延させてアニメーションを開始
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    // アニメーション完了後に統合画像を表示
    const totalDuration = 1.5 + gridCols * gridRows * 0.03;
    const completeTimer = setTimeout(() => {
      setAnimationComplete(true);
    }, totalDuration * 1000 + 200);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [gridCols, gridRows]);

  const totalPieces = gridCols * gridRows;
  const pieces = Array.from({ length: totalPieces }, (_, i) => i);

  // マウント前は何も表示しない
  if (!isMounted) {
    return (
      <div className="absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* アニメーション完了後の統合画像 */}
      {animationComplete && (
        <div className="absolute inset-0">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      )}

      {/* ピースアニメーション */}
      {!animationComplete &&
        pieces.map((index) => {
          const position = initialPositions[index];
          if (!position) return null;

          const { x, y, rotation, scale, row, col } = position;
          const width = 100 / gridCols;
          const height = 100 / gridRows;
          const left = col * width;
          const top = row * height;

          return (
            <motion.div
              key={index}
              className="absolute overflow-hidden"
              style={{
                width: `${width + 0.1}%`,
                height: `${height + 0.1}%`,
                left: `${left}%`,
                top: `${top}%`,
              }}
              initial={{
                x: x,
                y: y,
                rotate: rotation,
                scale: scale,
                opacity: 0,
              }}
              animate={
                isLoaded
                  ? {
                      x: 0,
                      y: 0,
                      rotate: 0,
                      scale: 1,
                      opacity: 1,
                    }
                  : {}
              }
              transition={{
                duration: 1.5,
                delay: index * 0.03,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              <div
                className="relative w-full h-full"
                style={{
                  width: `${gridCols * 100}%`,
                  height: `${gridRows * 100}%`,
                  transform: `translate(-${left}%, -${top}%)`,
                }}
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
                />
              </div>
            </motion.div>
          );
        })}
    </div>
  );
}
