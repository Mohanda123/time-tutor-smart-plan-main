export interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

export class NotificationService {
  private static instance: NotificationService;
  private scheduledNotifications: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {
    this.requestPermission();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async requestPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  }

  scheduleNotification(
    taskId: string,
    task: string,
    notificationTime: Date,
    importance: string
  ): void {
    // Clear existing notification for this task
    this.cancelNotification(taskId);

    const now = new Date();
    const timeUntilNotification = notificationTime.getTime() - now.getTime();

    if (timeUntilNotification <= 0) {
      console.log("Notification time has already passed");
      return;
    }

    const timeoutId = setTimeout(() => {
      this.showNotification(task, importance);
      this.scheduledNotifications.delete(taskId);
    }, timeUntilNotification);

    this.scheduledNotifications.set(taskId, timeoutId);

    console.log(`Notification scheduled for ${task} at ${notificationTime.toLocaleString()}`);
  }

  private showNotification(task: string, importance: string): void {
    if (Notification.permission !== "granted") {
      return;
    }

    const importanceEmoji = this.getImportanceEmoji(importance);
    const motivationalMsg = this.getRandomMotivationalMessage();

    const notification = new Notification("TimeTutor Reminder 🧠⏰", {
      body: `${importanceEmoji} ${task} - ${motivationalMsg}\n\nIntha subject padikalama da?`,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: `timetutor-${Date.now()}`,
      requireInteraction: true
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto close after 10 seconds if not interacted with
    setTimeout(() => {
      notification.close();
    }, 10000);
  }

  private getImportanceEmoji(importance: string): string {
    switch (importance) {
      case "High": return "🔥";
      case "Medium": return "⚡";
      case "Low": return "🌱";
      default: return "📚";
    }
  }

  private getRandomMotivationalMessage(): string {
    const messages = [
      "Time to shine da!",
      "Let's crush this task!",
      "Study time hero!",
      "Knowledge awaits you!",
      "Smart minds never rest!",
      "Excellence is calling!",
      "Future success starts now!",
      "Brain power activated!"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  cancelNotification(taskId: string): void {
    const timeoutId = this.scheduledNotifications.get(taskId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.scheduledNotifications.delete(taskId);
      console.log(`Notification cancelled for task ${taskId}`);
    }
  }

  cancelAllNotifications(): void {
    this.scheduledNotifications.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    this.scheduledNotifications.clear();
    console.log("All notifications cancelled");
  }

  getScheduledCount(): number {
    return this.scheduledNotifications.size;
  }

  // For testing - trigger immediate notification
  testNotification(): void {
    if (Notification.permission === "granted") {
      this.showNotification("Sample Math Problem", "High");
    }
  }
}

export const notificationService = NotificationService.getInstance();