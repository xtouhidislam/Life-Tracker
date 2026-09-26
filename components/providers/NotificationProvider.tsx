"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  webPush,
  NotificationPermissionStatus,
  PushNotificationPayload,
} from "@/lib/notifications/web-push";
import { reminderScheduler } from "@/lib/notifications/reminder-scheduler";
import { useAuth } from "@/components/providers/AuthProvider";
import { getTasksAction } from "@/app/actions/tasks";
import { getHabitsAction } from "@/app/actions/habits";
import { getRoutinesAction } from "@/app/actions/routines";

interface NotificationContextType {
  permission: NotificationPermissionStatus;
  isSupported: boolean;
  requestPermission: () => Promise<NotificationPermissionStatus>;
  sendCustomNotification: (payload: PushNotificationPayload) => Promise<boolean>;
  sendTestAlert: (type: "routine" | "streak" | "digest" | "focus") => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType>({
  permission: "default",
  isSupported: false,
  requestPermission: async () => "default",
  sendCustomNotification: async () => false,
  sendTestAlert: async () => false,
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { stats } = useAuth();
  const [permission, setPermission] = useState<NotificationPermissionStatus>("default");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const supported = webPush.isSupported();
    setIsSupported(supported);
    if (supported) {
      const status = webPush.getPermissionStatus();
      setPermission(status);
      if (status === "granted") {
        webPush.registerServiceWorker();
      }
    }
  }, []);

  // Initialize background reminder scheduler when permission is granted
  useEffect(() => {
    if (permission !== "granted") return;

    let isMounted = true;

    async function initScheduler() {
      const [tasksRes, habitsRes, routinesRes] = await Promise.all([
        getTasksAction(),
        getHabitsAction(),
        getRoutinesAction(
          new Date().getDay() === 0 || new Date().getDay() === 6 ? "weekend" : "weekday"
        ),
      ]);

      if (isMounted) {
        reminderScheduler.start(
          routinesRes.blocks || [],
          tasksRes.tasks || [],
          habitsRes.habits || [],
          stats?.current_streak ?? 14
        );
      }
    }

    initScheduler();

    return () => {
      isMounted = false;
      reminderScheduler.stop();
    };
  }, [permission, stats?.current_streak]);

  const requestPermission = async (): Promise<NotificationPermissionStatus> => {
    const res = await webPush.requestPermission();
    setPermission(res);
    return res;
  };

  const sendCustomNotification = async (payload: PushNotificationPayload) => {
    return webPush.showNotification(payload);
  };

  const sendTestAlert = async (type: "routine" | "streak" | "digest" | "focus") => {
    if (type === "routine") {
      return webPush.notifyRoutineTransition("Deep Work (FastAPI Builds)", "11:00 AM", 5);
    } else if (type === "streak") {
      return webPush.notifyStreakWarning(stats?.current_streak ?? 14);
    } else if (type === "digest") {
      return webPush.notifyDailyDigest(4, 3);
    } else {
      return webPush.notifyFocusComplete(25, 10);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        permission,
        isSupported,
        requestPermission,
        sendCustomNotification,
        sendTestAlert,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
