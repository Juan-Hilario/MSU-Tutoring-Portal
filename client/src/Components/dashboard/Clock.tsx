import { useEffect, useState } from "react";
import moment from "moment";

export default function Clock() {
  const [time, setTime] = useState(moment());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(moment());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <>{time.format("HH:mm:ss")}</>;
}
