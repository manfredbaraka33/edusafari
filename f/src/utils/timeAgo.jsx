import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

dayjs.extend(relativeTime);
dayjs.extend(utc);

export default function TimeAgo({ dateString }) {
  return (
    <span className="text-xs text-gray-500">
      {dayjs.utc(dateString).local().fromNow()} 
    </span>
  );
}
