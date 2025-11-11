import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NotificationBell from "./NotificationBell";
import NotificationDropdown from "./NotificationDropdown";
import type { RootState } from "../../redux/features/store";
import { useGetAllMyNotificationQuery } from "../../redux/api/apiCommunication";
import { setNotifications } from "../../redux/features/notificationSlice";

function NotificationPanel() {
  const { data: notificationsResponse } = useGetAllMyNotificationQuery();
  const notifications = useSelector((state: RootState) => state.notifications);
  const [showDropdown, setShowDropdown] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const dispatch = useDispatch();

  useEffect(() => {
    if (notificationsResponse?.data) {
      dispatch(setNotifications(notificationsResponse?.data));
    }
  }, [notificationsResponse, dispatch]);

  return (
    <div className="relative">
      <NotificationBell
        unreadCount={unreadCount}
        onClick={() => setShowDropdown(!showDropdown)}
      />
      {showDropdown && <NotificationDropdown notifications={notifications} />}
    </div>
  );
}
export default NotificationPanel;
