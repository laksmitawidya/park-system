import { ParkingSpace } from "./common-type";

const PARKING_SPACE_MARGIN = 20;
const PARKING_SPACE_WIDTH = 75;
const PARKING_SPACE_HEIGHT = 50;
const TOTAL_SLOT = 14;

export class ParkingLotMapHelpers {
  static TOTAL_SLOT = TOTAL_SLOT;
  static CANVAS_SIZE = 700;
  static PARKING_SPACE_MARGIN = PARKING_SPACE_MARGIN;
  static PARKING_SPACE_WIDTH = PARKING_SPACE_WIDTH;
  static PARKING_SPACE_HEIGHT = PARKING_SPACE_HEIGHT;

  static getParkingLotSpaces = () => {
    const topParkingSpaces: ParkingSpace[] = [];
    const bottomParkingSpaces: ParkingSpace[] = [];
    let xOffset = PARKING_SPACE_MARGIN;

    for (let i = 0; i < TOTAL_SLOT / 2; i++) {
      topParkingSpaces.push({
        id: i,
        x: xOffset,
        y: PARKING_SPACE_MARGIN,
        width: PARKING_SPACE_WIDTH,
        height: PARKING_SPACE_HEIGHT,
        isOccupied: false,
      });

      bottomParkingSpaces.push({
        id: i + 7,
        x: xOffset,
        y: PARKING_SPACE_MARGIN + PARKING_SPACE_HEIGHT,
        width: PARKING_SPACE_WIDTH,
        height: PARKING_SPACE_HEIGHT,
        isOccupied: false,
      });

      xOffset += PARKING_SPACE_WIDTH + PARKING_SPACE_MARGIN;
    }
    return [...topParkingSpaces, ...bottomParkingSpaces];
  };
}
