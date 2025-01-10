import { Alert, Typography } from "antd";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useEffect, useState } from "react";

dayjs.extend(duration);

const SessionTimer = ({
  startDate,
  duration,
  unit,
}: {
  startDate: string;
  duration: number;
  unit: "minute" | "day" | "hour";
}) => {
  const [remainingTime, setRemainingTime] = useState("");
  const [overTime, setOverTime] = useState("");

  useEffect(() => {
    const endTime = dayjs(startDate).add(duration, unit);

    const updateTimer = () => {
      const now = dayjs();
      const remainingDiff = endTime.diff(now);
      const overtimeDiff = now.diff(endTime);

      if (remainingDiff <= 0) {
        const timeOvertime = dayjs.duration(overtimeDiff);
        setOverTime(
          `${timeOvertime.days()}d ${timeOvertime.hours()}h ${timeOvertime.minutes()}m ${timeOvertime.seconds()}s`
        );
        setRemainingTime("");
      } else {
        const timeLeft = dayjs.duration(remainingDiff);
        setRemainingTime(
          `${timeLeft.days()}d ${timeLeft.hours()}h ${timeLeft.minutes()}m ${timeLeft.seconds()}s`
        );
        setOverTime("");
      }
    };

    updateTimer();

    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [startDate, duration, unit]);

  return (
    <div className="flex gap-x-1">
      {remainingTime && (
        <Typography.Text type="success" className="font-bold">
          {remainingTime}
        </Typography.Text>
      )}
      {overTime && (
        <Alert
          className="my-1 text-red-700"
          message={`Sesi sudah habis. Overtime: ${overTime}`}
          type="error"
          showIcon
        />
      )}
    </div>
  );
};

export default SessionTimer;
