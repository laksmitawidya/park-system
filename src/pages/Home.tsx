import { Alert, Button } from "antd";
import { useEffect, useState } from "react";
import AvailableSlotModal from "../components/AvailableSlotModal.js";
import OrderDetailModal from "../components/OrderDetailModal.js";
import OrderFormModal from "../components/OrderFormModal.js";
import ParkingLotMap from "../components/ParkingLotMap.js";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { OrderInfo, ParkingSpace } from "../utils/common-type.js";
import { ParkingLotMapHelpers } from "../utils/parking-lot-map-helpers.js";
import { SearchOutlined } from "@ant-design/icons";

const Home = () => {
  const [isOrderFormModalOpen, setOrderFormModalOpen] = useState(false);
  const [isOrderDetailModalOpen, setOrderDetailModalOpen] = useState(false);
  const [isAvailableSlotModalOpen, setIsAvailableSlotModalOpen] =
    useState(false);
  const [selectedData, setSelectedData] = useState<
    OrderInfo | ParkingSpace | null
  >(null);

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const { getItem } = useLocalStorage("orderInfo");
  const persistedData = getItem() ?? [];

  const onSelectParkingSpace = (selectedOrder: OrderInfo | ParkingSpace) => {
    setSelectedData(selectedOrder);
    if ((selectedOrder as ParkingSpace).isOccupied) {
      setOrderDetailModalOpen(true);
    } else {
      setOrderFormModalOpen(true);
    }
  };

  return (
    <>
      <div
        className="flex flex-col p-5 items-center w-screen"
        style={{
          width: `${width}px`,
          transition: "width 0.3s ease",
        }}
      >
        <h1 className="text-slate-50 text-3xl font-bold mb-5">Sistem Parkir</h1>
        <div className="text-slate-50 text-lg max-w-[500px] flex-wrap text-center">
          Silahkan memilih tempat parkir yang kosong dengan melakukan klik pada
          bagian box bewarna hijau atau klik tombol berikut untuk mencari
          ketersediaan tempat parkir.
        </div>
        <Button
          className="my-5"
          icon={<SearchOutlined />}
          type="primary"
          onClick={() => {
            setIsAvailableSlotModalOpen(true);
          }}
        >
          Cari tempat parkir
        </Button>
        <div className="flex gap-x-10 rounded border justify-between py-2 px-3 mb-3 sm:w-full md:w-2/3 xl:w-1/3 w-full">
          <div>
            <div className="text-slate-50 text-lg">Tempat Parkir Terisi</div>
            <div className="text-slate-50 text-3xl">
              {persistedData?.length}
            </div>
          </div>
          <div>
            <div className="text-slate-50 text-lg">Tempat Parkir Kosong</div>
            <div className="text-slate-50 text-3xl">
              {ParkingLotMapHelpers.TOTAL_SLOT - (persistedData?.length || 0)}
            </div>
          </div>
        </div>

        <Alert
          className="sm:w-full md:w-2/3 xl:w-1/3 w-full"
          message={
            <>
              <div className="font-bold">Keterangan: </div>
              <div className="flex">
                <span className="font-bold mr-1">A1-A7:</span> Sisi Atas;
                <span className="font-bold mx-1">A8-A14:</span> Sisi Bawah.
              </div>
              <div>
                <span className="font-bold mr-1">Warna Hijau:</span> Available;
                <span className="font-bold mx-1">Warna Merah:</span> Booked.
              </div>
            </>
          }
          type="info"
          showIcon
        />
      </div>

      <ParkingLotMap onSelectParkingSpace={onSelectParkingSpace} />
      <OrderFormModal
        selectedData={selectedData as ParkingSpace}
        isOpen={isOrderFormModalOpen}
        onCancel={() => {
          setOrderFormModalOpen(false);
        }}
      />
      <OrderDetailModal
        selectedData={selectedData as OrderInfo}
        isOpen={isOrderDetailModalOpen}
        onCancel={() => {
          setOrderDetailModalOpen(false);
        }}
      />
      <AvailableSlotModal
        onOrderParkingSlot={onSelectParkingSpace}
        data={persistedData}
        isOpen={isAvailableSlotModalOpen}
        onCancel={() => {
          setIsAvailableSlotModalOpen(false);
        }}
      />
    </>
  );
};

export default Home;
