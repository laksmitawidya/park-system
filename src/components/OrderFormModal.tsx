import { Form, Input, InputNumber, Modal, Select } from "antd";
import dayjs from "dayjs";
import { OrderModalProps } from "../utils/common-type";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { ExclamationCircleFilled } from "@ant-design/icons";

const OrderFormModal = ({
  isOpen,
  onCancel,
  selectedData,
}: OrderModalProps) => {
  const [form] = Form.useForm();
  const { setItem } = useLocalStorage("orderInfo");

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setItem({
        ...values,
        id: selectedData.id,
        startAt: dayjs().toISOString(),
      });
      onCancel?.();
      await Modal.confirm({
        title: "Pemesanan Parkir Berhasil",
        content:
          "Parkir berhasil dipesan, silahkan klik box untuk melihat data pemesan",
        icon: <ExclamationCircleFilled />,
        onOk: () => {
          location.reload();
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      form.resetFields();
    }
  };

  return (
    <>
      <Modal
        title="Pesan Parkir"
        centered
        open={isOpen}
        onOk={handleOk}
        onCancel={onCancel}
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={{
            nama: "",
            noKendaraan: "",
            durasi: {
              value: "",
              unit: "",
            },
          }}
        >
          <Form.Item
            label="Nama"
            name="nama"
            colon={false}
            rules={[
              { required: true, message: "Masukkan nama pengguna kendaraan!" },
            ]}
          >
            <Input className="w-full" placeholder="ct: Diana" />
          </Form.Item>
          <Form.Item
            colon={false}
            label="Nomor Kendaraan"
            name="noKendaraan"
            rules={[{ required: true, message: "Masukkan nomor kendaraan!" }]}
          >
            <Input placeholder="ct: AB 1234 XY" />
          </Form.Item>

          <div className="flex gap-x-3">
            <Form.Item
              label="Durasi"
              colon={false}
              name={["durasi", "value"]}
              rules={[
                { required: true, message: "Masukkan durasi kendaraan!" },
              ]}
            >
              <InputNumber
                min={1}
                className="w-full"
                placeholder="ct: 1"
                onChange={(value) => {
                  form.setFieldsValue({
                    durasi: {
                      value: value,
                      unit: form.getFieldValue("durasi")?.unit || "hour",
                    },
                  });
                }}
              />
            </Form.Item>
            <Form.Item
              label="Unit"
              className="w-full"
              colon={false}
              name={["durasi", "unit"]}
              rules={[
                { required: true, message: "Masukkan unit durasi kendaraan!" },
              ]}
            >
              <Select
                placeholder="ct: jam"
                onChange={(value) => {
                  form.setFieldsValue({
                    durasi: {
                      value: form.getFieldValue("durasi").value,
                      unit: value,
                    },
                  });
                }}
                options={[
                  {
                    value: "day",
                    label: "Hari",
                  },
                  {
                    value: "hour",
                    label: "Jam",
                  },
                  {
                    value: "minute",
                    label: "Menit",
                  },
                ]}
              />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default OrderFormModal;
