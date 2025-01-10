import { Button, Input, Modal, Table, Typography } from "antd";
import { OrderInfo } from "../utils/common-type";
import { ColumnsType } from "antd/es/table";
import duration from "dayjs/plugin/duration";
import dayjs from "dayjs";
import { useState } from "react";
import { ParkingLotMapHelpers } from "../utils/parking-lot-map-helpers";

dayjs.extend(duration);

const AvailableSlotModal = ({
  isOpen,
  onCancel,
  data,
  onOrderParkingSlot,
}: {
  isOpen: boolean;
  onCancel: () => void;
  data: OrderInfo[];
  onOrderParkingSlot: (data: OrderInfo) => void;
}) => {
  const allSlots = new Map();
  data.forEach((item) => {
    allSlots.set(item.id, item);
  });

  for (let i = 0; i < ParkingLotMapHelpers.TOTAL_SLOT; i++) {
    if (!allSlots.has(i)) {
      allSlots.set(i, {
        nama: "",
        noKendaraan: "",
        durasi: {
          value: 0,
          unit: "",
        },
        id: i,
        startAt: "",
      });
    }
  }

  const allData = Array.from(allSlots.values());
  const [filteredData, setFilteredData] = useState(allData);

  const columns: ColumnsType<OrderInfo> = [
    {
      title: "Area Parkir",
      dataIndex: "id",
      render: (value) => (value !== undefined ? <div>A{value + 1}</div> : "-"),
    },
    {
      title: "Waktu Mulai Parkir",
      render: (_, row) => {
        return (
          <div>
            {row.startAt
              ? dayjs(row.startAt).format("DD-MM-YYYY HH:mm:ss")
              : "-"}
          </div>
        );
      },
    },
    {
      title: "Durasi",
      dataIndex: "durasi",
      render: (value) =>
        value ? (
          <div>
            {value?.value || "-"} {value?.unit}
          </div>
        ) : (
          "-"
        ),
    },
    {
      title: "Nama",
      dataIndex: "nama",
      render: (value) => (value ? <div>{value}</div> : "-"),
    },
    {
      title: "Nomor Kendaraan",
      dataIndex: "noKendaraan",
    },

    {
      title: "Status/Aksi",
      render: (_, row) => {
        const endTime = dayjs(row.startAt).add(
          row.durasi.value,
          row.durasi.unit as "minute" | "day" | "hour"
        );
        const now = dayjs();
        const remainingDiff = endTime.diff(now);
        if (row.startAt && row.durasi) {
          return remainingDiff <= 0 ? (
            <span className="text-red-700">Sesi overtime</span>
          ) : (
            <span className="text-green-700">Sesi masih berjalan</span>
          );
        }
        return (
          <Typography.Link
            onClick={() => {
              onOrderParkingSlot(row);
            }}
          >
            Pesan
          </Typography.Link>
        );
      },
    },
  ];

  return (
    <>
      <Modal
        title="Cari Tempat Parkir"
        open={isOpen}
        onCancel={onCancel}
        footer={<Button onClick={onCancel}>Cancel</Button>}
        width={{
          xs: "90%",
          sm: "80%",
          md: "70%",
          lg: "60%",
          xl: "50%",
          xxl: "40%",
        }}
      >
        <Input
          onChange={(e) => {
            const { value } = e.target;
            const filteredData = allData.filter((val) => {
              const matches = `A${val.id + 1}`;
              return matches.toLowerCase().includes(value.toLowerCase());
            });
            setFilteredData(filteredData);
          }}
          allowClear
          placeholder="Cari Area"
        />
        <Table
          className="h-3/4"
          dataSource={filteredData ?? allData}
          columns={columns}
          pagination={false}
          scroll={{ y: 320 }}
        />
      </Modal>
    </>
  );
};

export default AvailableSlotModal;
