import React, { useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useInboxNotifications,
  useUnreadInboxNotificationsCount,
  useUpdateRoomNotificationSettings,
} from "@liveblocks/react/suspense";
import { InboxNotification, InboxNotificationList } from "@liveblocks/react-ui";
import { useMediaQuery } from "@/hooks/useMediaQuery";

function NotifiationBox({ children }) {
  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
  
  const { inboxNotifications } = useInboxNotifications();
  const updateRoomNotificationSettings = useUpdateRoomNotificationSettings();
  const { count, error, isLoading } = useUnreadInboxNotificationsCount();
  
  useEffect(() => {
    updateRoomNotificationSettings({ threads: "all" });
  }, []);

  return (
    <Popover>
      <PopoverTrigger>
        <div className="flex gap-1 relative">
          {children}
          {count > 0 && (
            <span className={`absolute ${isMobile ? '-top-1 -right-1' : '-top-1 -right-2'} p-0.5 px-1.5 rounded-full text-[7px] bg-primary text-white min-w-[14px] text-center`}>
              {count}
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className={`${isMobile ? 'w-[300px]' : isTablet ? 'w-[400px]' : 'w-[500px]'} max-h-[400px] overflow-y-auto p-0`}
        align="end"
      >
        <div className="p-2 bg-gray-50 border-b">
          <h3 className="text-sm font-medium">Notifications</h3>
        </div>
        {inboxNotifications.length > 0 ? (
          <InboxNotificationList>
            {inboxNotifications.map((inboxNotification) => (
              <InboxNotification
                key={inboxNotification.id}
                inboxNotification={inboxNotification}
              />
            ))}
          </InboxNotificationList>
        ) : (
          <div className="p-4 text-center text-gray-500 text-sm">
            <p>No notifications yet</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default NotifiationBox;
