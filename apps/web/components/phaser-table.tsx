"use client";

import { useEffect, useRef } from "react";

type PhaserType = typeof import("phaser");

type Props = {
  leftRank?: number;
  rightRank?: number;
  drawnRank?: number;
  outcomeLabel?: string;
};

export function PhaserTable({ leftRank, rightRank, drawnRank, outcomeLabel }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<import("phaser").Game | null>(null);

  useEffect(() => {
    let active = true;

    async function mountGame() {
      const Phaser = (await import("phaser")) as PhaserType;

      if (!containerRef.current || !active) {
        return;
      }

      gameRef.current?.destroy(true);

      const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
        key: "table-scene",
        active: true,
      };

      class TableScene extends Phaser.Scene {
        constructor() {
          super(sceneConfig);
        }

        create() {
          const width = 720;
          const height = 300;
          this.cameras.main.setBackgroundColor("#0f3b37");

          this.add.circle(360, 150, 180, 0x15544d, 0.94);
          this.add.rectangle(360, 150, 640, 220, 0x11332f, 0.88).setStrokeStyle(2, 0xf6c98f, 0.45);

          this.addCard(width * 0.28, height * 0.5, leftRank ?? "?", "#ffe7cc");
          this.addCard(width * 0.72, height * 0.5, rightRank ?? "?", "#ffe7cc");
          this.addCard(width * 0.5, height * 0.5, drawnRank ?? "?", drawnRank ? "#fff6ed" : "#e7dcc8");

          if (outcomeLabel) {
            this.add
              .text(width / 2, height - 30, outcomeLabel, {
                fontFamily: "Georgia",
                fontSize: "20px",
                color: "#ffd099",
              })
              .setOrigin(0.5);
          }
        }

        addCard(x: number, y: number, rank: number | string, fillColor: string) {
          const card = this.add.container(x, y);
          const background = this.add.rectangle(0, 0, 110, 150, Phaser.Display.Color.HexStringToColor(fillColor).color, 1);
          background.setStrokeStyle(3, 0x5b1f16, 0.9);
          const text = this.add.text(0, 0, String(rank), {
            fontFamily: "Georgia",
            fontSize: "38px",
            color: "#5b1f16",
          });
          text.setOrigin(0.5);
          card.add([background, text]);
        }
      }

      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: 720,
        height: 300,
        parent: containerRef.current,
        transparent: true,
        scene: TableScene,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      });
    }

    mountGame();

    return () => {
      active = false;
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [leftRank, rightRank, drawnRank, outcomeLabel]);

  return (
    <div
      ref={containerRef}
      className="mx-auto h-[220px] w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-table-felt p-2 sm:h-[260px] lg:h-[300px]"
    />
  );
}
