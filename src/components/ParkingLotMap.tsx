import { KonvaEventObject } from "konva/lib/Node";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Layer, Rect, Stage, Text } from "react-konva";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { OrderInfo, ParkingSpace } from "../utils/common-type";
import { ParkingLotMapHelpers } from "./../utils/parking-lot-map-helpers";
import { Button } from "antd";
import { FullscreenExitOutlined } from "@ant-design/icons";

const ParkingLotMap = ({
  onSelectParkingSpace,
}: {
  onSelectParkingSpace: (selectedData: OrderInfo | ParkingSpace) => void;
}) => {
  const { getItem } = useLocalStorage("orderInfo");
  const persistedData = getItem() ?? [];
  const occupiedIds = persistedData?.map((data) => data.id);

  const [position, setPosition] = useState({
    x: 20,
    y: 0,
  });

  const [scale, setScale] = useState(
    window.innerWidth / ParkingLotMapHelpers.CANVAS_SIZE
  );

  const [parkingSpaces, setParkingSpaces] = useState<ParkingSpace[]>(
    useMemo(() => ParkingLotMapHelpers.getParkingLotSpaces(), [])
  );

  useEffect(() => {
    const hasChanged = updatedParkingSpaces.some(
      (newSpace, index) =>
        newSpace.isOccupied !== parkingSpaces[index].isOccupied
    );

    if (hasChanged) {
      setParkingSpaces(updatedParkingSpaces);
    }
  }, [persistedData]);

  const updatedParkingSpaces: ParkingSpace[] = useMemo(() => {
    return parkingSpaces.map((parkingSpace) => {
      return {
        ...parkingSpace,
        isOccupied: occupiedIds?.includes(parkingSpace.id) ?? false,
      };
    });
  }, [parkingSpaces, occupiedIds]);

  const toggleParkingSpace = useCallback(
    (selectedSpace: ParkingSpace) => {
      setParkingSpaces((spaces) =>
        spaces.map((space) =>
          space.id === selectedSpace.id
            ? { ...space, isOccupied: !space.isOccupied }
            : space
        )
      );
      onSelectParkingSpace(selectedSpace);
    },
    [onSelectParkingSpace]
  );

  const scaleVal = window.innerWidth / ParkingLotMapHelpers.CANVAS_SIZE;

  useEffect(() => {
    const onResize = () => {
      setPosition({
        x: 20,
        y: 0,
      });
    };

    setScale(scaleVal);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [window.innerWidth]);

  const boundFunc = useMemo(
    () =>
      (
        pos: {
          x: number;
          y: number;
        },
        scale: number
      ) => {
        const x = Math.min(0, Math.max(pos.x, window.innerWidth * (1 - scale)));
        const y = Math.min(
          0,
          Math.max(pos.y, window.innerHeight * (1 - scale))
        );

        return {
          x,
          y,
        };
      },
    []
  );

  const onWheel = useCallback((e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.02;
    const stage = e.target.getStage();

    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointerPosition = stage.getPointerPosition();

    if (!oldScale || !pointerPosition) return;

    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    if (newScale <= 1) {
      return;
    }

    const x = pointerPosition.x * newScale;
    const y = pointerPosition.y * newScale;

    const pos = boundFunc({ x, y }, newScale);

    setScale(newScale);
    setPosition({
      x: pos.x,
      y: pos.y,
    });
  }, []);

  const onDragMove = useCallback((e: KonvaEventObject<DragEvent>) => {
    let x = e.target.x();
    let y = e.target.y();

    const maxDraggableHorizontalLimit = window.innerWidth * 0.25;
    const maxDraggableVerticalLimit = window.innerWidth * 0.1;

    // Negative value
    if (x <= -maxDraggableHorizontalLimit) {
      x = -maxDraggableHorizontalLimit;
    }

    if (y <= -maxDraggableVerticalLimit) {
      y = -maxDraggableVerticalLimit;
    }

    // Positive value
    if (x > maxDraggableHorizontalLimit) {
      x = maxDraggableHorizontalLimit;
    }
    if (y > maxDraggableVerticalLimit) {
      y = maxDraggableVerticalLimit;
    }

    e.target.x(x);
    e.target.y(y);

    setPosition({
      x,
      y,
    });
  }, []);

  return (
    <div
      className="flex flex-col items-center"
      style={{
        width: window.innerWidth,
      }}
    >
      <Button
        className="m-3"
        type="primary"
        icon={<FullscreenExitOutlined />}
        onClick={() => {
          setPosition({
            x: 0,
            y: 0,
          });

          setScale(scaleVal);
          window.location.reload();
        }}
      >
        Perbarui posisi
      </Button>
      <Stage
        style={{
          transition: "width 0.3s ease",
        }}
        width={window.innerWidth}
        height={window.innerHeight}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        draggable
        onDragMove={onDragMove}
        onWheel={onWheel}
      >
        <Layer>
          {parkingSpaces.map((space) => (
            <div key={space.id}>
              <Rect
                x={space.x}
                y={space.y}
                width={space.width}
                height={space.height}
                fill={space.isOccupied ? "red" : "MediumSeaGreen"}
                stroke="white"
                strokeWidth={2}
                onClick={() => {
                  toggleParkingSpace(space);
                }}
                onTap={() => {
                  toggleParkingSpace(space);
                }}
              />

              {space.isOccupied ? (
                <Text
                  text="P"
                  fontSize={20}
                  fill="white"
                  x={space.x + space.width / 2 - 10}
                  y={space.y + space.height / 2 - 15}
                />
              ) : (
                <Text
                  text={`A${space.id + 1}`}
                  fontSize={20}
                  fill="white"
                  x={space.x + space.width / 2 - 10}
                  y={space.y + space.height / 2 - 15}
                />
              )}
            </div>
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default ParkingLotMap;
