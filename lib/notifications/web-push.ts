// ==============================================================================
// LifeQuest Web Push & Local Notification Client Engine
// Phase 10: Service Worker coordination and OS-level notifications
// ==============================================================================

export type NotificationPermissionStatus =
  | "default"
  | "granted"
  | "denied"
  | "unsupported";

export interface PushNotificationPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
  icon?: string;
  badge?: string;
}

class WebPushEngine {
  private registration: ServiceWorkerRegistration | null = null;
  private isRegistered = false;

  /**
   * Check if the browser supports notifications and Service Workers
   */
  public isSupported(): boolean {
    if (typeof window === "undefined") return false;
    return "Notification" in window && "serviceWorker" in navigator;
  }

  /**
   * Current permission status
   */
  public getPermissionStatus(): NotificationPermissionStatus {
    if (!this.isSupported()) return "unsupported";
    return Notification.permission as NotificationPermissionStatus;
  }

  /**
   * Register the Service Worker from /sw.js
   */
  public async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!this.isSupported() || this.isRegistered) {
      return this.registration;
    }

    try {
      this.registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      this.isRegistered = true;
      return this.registration;
    } catch (err) {
      console.warn("Service Worker registration failed:", err);
      return null;
    }
  }

  /**
   * Request notification permission from the user
   */
  public async requestPermission(): Promise<NotificationPermissionStatus> {
    if (!this.isSupported()) return "unsupported";

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        await this.registerServiceWorker();
      }
      return permission as NotificationPermissionStatus;
    } catch (err) {
      console.error("Failed to request notification permission:", err);
      return "denied";
    }
  }

  /**
   * Trigger a notification via Service Worker (or fallback Notification constructor)
   */
  public async showNotification(payload: PushNotificationPayload): Promise<boolean> {
    if (!this.isSupported()) return false;

    if (Notification.permission !== "granted") {
      const permission = await this.requestPermission();
      if (permission !== "granted") return false;
    }

    try {
      const reg = this.registration || (await this.registerServiceWorker());

      if (reg && reg.showNotification) {
        await reg.showNotification(payload.title, {
          body: payload.body,
          icon: payload.icon || "/favicon.ico",
          badge: payload.badge || "/favicon.ico",
          tag: payload.tag || "lifequest-alert",
          data: {
            url: payload.url || "/today",
            timestamp: Date.now(),
          },
          vibrate: [100, 50, 100],
        } as NotificationOptions);
        return true;
      } else {
        // Fallback for environments where registration isn't ready
        new Notification(payload.title, {
          body: payload.body,
          icon: payload.icon || "/favicon.ico",
        });
        return true;
      }
    } catch (err) {
      console.error("Failed to show notification:", err);
      return false;
    }
  }

  // ----------------------------------------------------------------------------
  // PRESET NOTIFICATION ARCHETYPES
  // ----------------------------------------------------------------------------

  /**
   * 1. Routine block transition warning (e.g. 5m before block starts)
   */
  public async notifyRoutineTransition(
    blockTitle: string,
    startTime: string,
    minutesUntil = 5
  ) {
    return this.showNotification({
      title: `⚡ Routine Transition: ${blockTitle}`,
      body: `Starts at ${startTime} (${minutesUntil} minutes remaining). Prepare your focus environment!`,
      url: "/routine",
      tag: "routine-transition",
    });
  }

  /**
   * 2. Morning briefing digest
   */
  public async notifyDailyDigest(taskCount: number, habitCount: number) {
    return this.showNotification({
      title: "🌅 Morning Briefing — LifeQuest",
      body: `Good morning! You have ${taskCount} tasks due and ${habitCount} daily habits to complete today.`,
      url: "/today",
      tag: "morning-digest",
    });
  }

  /**
   * 3. Streak defense warning
   */
  public async notifyStreakWarning(currentStreak: number) {
    return this.showNotification({
      title: "🔥 Streak Defense Alert!",
      body: `Your ${currentStreak}-day streak will expire at midnight. Check off pending objectives to protect your XP!`,
      url: "/habits",
      tag: "streak-warning",
    });
  }

  /**
   * 4. Focus session complete
   */
  public async notifyFocusComplete(minutes: number, earnedXp: number) {
    return this.showNotification({
      title: "🎯 Focus Sprint Completed!",
      body: `Outstanding discipline! ${minutes} minutes of deep work completed (+${earnedXp} XP awarded).`,
      url: "/focus",
      tag: "focus-complete",
    });
  }
}

export const webPush = new WebPushEngine();
