export type OrderModalProps = {
  isOpen: boolean;
  onCancel: () => void;
  selectedData: ParkingSpace | OrderInfo;
};

export type ParkingSpace = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  isOccupied: boolean;
};

export type OrderInfo = {
  nama: string;
  noKendaraan: string;
  durasi: { value: number; unit: string };
  id: number;
  startAt: string;
};
