import { PAL, rays } from "../lib.mjs";
import {
  A_LEGS,
  aladdin,
  bumpy,
  compose,
  oval,
  place,
  ring,
  ringGenie,
  sparkles,
} from "./characters.mjs";

// Aladdin and the Magic Lamp, 4: trapped in the dark cave, Aladdin sits on the steps; he has rubbed
// the little ring on his finger, and whoosh! a small green genie pops out of it with a cheeky wink.
const A = "translate(174 286) scale(1.3)";
// the ring on his raised hand, in his own coordinates
const R = [42, -110];
const RX = 174 + R[0] * 1.3;
const RY = 286 + R[1] * 1.3;
const cave = bumpy(200, 152, 194, 144, 16, 1.05, -84);
const dark = `${cave}${oval(206, 150, 128, 100)}`;
// the stone steps he sits on, going up into the dark on the left
const steps =
  "M76 246L276 246L276 288M76 246L76 288M40 206L124 206L124 246M40 206L40 246M60 288L296 288";
const stepFill =
  "M76 246L276 246L276 288L76 288ZM40 206L124 206L124 246L40 246Z";

export default compose({
  title: "The Genie of the Ring",
  seed: 204,
  washes: [
    {
      c: PAL.slate,
      o: 0.45,
      d: `${cave}${oval(RX + 2, RY - 52, 60, 64)}`,
      rule: "evenodd",
    },
    { c: PAL.slate, o: 0.45, d: dark, rule: "evenodd" },
    { c: PAL.ink, o: 0.12, d: dark, rule: "evenodd" },
    { c: PAL.ochre, o: 0.3, d: oval(RX + 2, RY - 52, 60, 64) },
    { c: PAL.grey, o: 0.6, d: stepFill },
    { c: PAL.slate, o: 0.25, d: stepFill },
  ],
  lines: [steps],
  fine: [
    "M90 266l20 0M200 274l24 0M54 224l20 0",
    rays(RX + 2, RY - 50, 66, 84, 11, 4, 10),
    sparkles([
      [RX - 40, RY - 30, 0.9],
      [RX + 44, RY - 6, 0.8],
      [RX + 50, RY - 92, 0.7],
    ]),
  ],
  parts: [
    place(
      aladdin({
        mood: "wow",
        legs: A_LEGS.sit,
        arms: [
          [
            [-14, -79, 8.5],
            [-22, -66, 8],
            [-25, -52, 8],
            [-24, -44, 8],
          ],
          [
            [14, -79, 8.5],
            [28, -88, 8],
            [38, -100, 8],
            [41, -108, 8],
          ],
        ],
      }),
      A,
    ),
    place(ringGenie({ mood: "wink" }), `translate(${RX} ${RY - 4}) scale(1.3)`),
    place(ring(3.2), `translate(${RX} ${RY})`),
  ],
});
