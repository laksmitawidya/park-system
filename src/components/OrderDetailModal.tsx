import { ExclamationCircleFilled } from "@ant-design/icons";
import { Button, Modal, Typography } from "antd";
import dayjs from "dayjs";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { OrderInfo, OrderModalProps } from "../utils/common-type";
import SessionTimer from "./SessionTimer";

const OrderDetailModal = ({
  isOpen,
  onCancel,
  selectedData,
}: OrderModalProps) => {
  const { getItem, removeItem } = useLocalStorage("orderInfo");
  const persistedData = getItem() ?? [];
  const selectedPersistedData = persistedData?.find(
    (data) => data?.id === selectedData?.id
  );

  const showConfirm = () => {
    Modal.confirm({
      title: "Apakah anda yakin untuk mengakhiri sesi Parkir?",
      icon: <ExclamationCircleFilled />,
      content: "Data akan terhapus jika anda mengakhiri sesi parkir",
      onOk() {
        removeItem(selectedData as OrderInfo);
        location.reload();
      },
    });
  };

  return (
    <Modal
      title="Detail Pengguna Parkir"
      centered
      open={isOpen}
      onCancel={onCancel}
      footer={[
        <Button key="akhiriSesi" danger variant="filled" onClick={showConfirm}>
          Akhiri Sesi
        </Button>,
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
      ]}
    >
      {selectedPersistedData ? (
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-col">
            <Typography.Text type="secondary">Nama</Typography.Text>
            <Typography.Text>{selectedPersistedData.nama}</Typography.Text>
          </div>
          <div className="flex flex-col">
            <Typography.Text type="secondary">Area Parkir</Typography.Text>
            <Typography.Text>A{selectedPersistedData.id + 1}</Typography.Text>
          </div>
          <div className="flex flex-col">
            <Typography.Text type="secondary">Nomor Kendaraan</Typography.Text>
            <Typography.Text>
              {selectedPersistedData.noKendaraan}
            </Typography.Text>
          </div>
          <div className="flex flex-col">
            <Typography.Text type="secondary">Durasi</Typography.Text>
            <Typography.Text>
              {selectedPersistedData.durasi?.value}{" "}
              {selectedPersistedData.durasi?.unit}
            </Typography.Text>
          </div>
          <div className="flex flex-col">
            <Typography.Text type="secondary">Waktu Mulai</Typography.Text>
            <Typography.Text>
              {dayjs(selectedPersistedData.startAt).format(
                "DD-MM-YYYY HH:mm:ss"
              )}
            </Typography.Text>
          </div>
          <div className="flex flex-col">
            <Typography.Text type="secondary">Waktu Tersisa</Typography.Text>
            <Typography.Text>
              <SessionTimer
                duration={selectedPersistedData.durasi.value}
                unit={
                  selectedPersistedData.durasi.unit as "minute" | "day" | "hour"
                }
                startDate={selectedPersistedData.startAt}
              />
            </Typography.Text>
          </div>
        </div>
      ) : (
        <div>Data not found</div>
      )}
    </Modal>
  );
};

export default OrderDetailModal;
