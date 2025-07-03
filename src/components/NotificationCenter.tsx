import { useState, useEffect } from "react";
import { Bell, Clock, Calendar, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { notificationService } from "@/services/NotificationService";
import { useToast } from "@/hooks/use-toast";

const NotificationCenter = () => {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [scheduledCount, setScheduledCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Check current permission status
    if ("Notification" in window) {
      setPermission(Notification.permission as NotificationPermission);
    }
    
    // Update scheduled notifications count
    setScheduledCount(notificationService.getScheduledCount());
  }, []);

  const requestPermission = async () => {
    const granted = await notificationService.requestPermission();
    if (granted) {
      setPermission("granted");
      toast({
        title: "Notification permission granted! 🔔",
        description: "You'll now receive study reminders da!"
      });
    } else {
      toast({
        title: "Permission denied da!",
        description: "Enable notifications in browser settings to get reminders.",
        variant: "destructive"
      });
    }
  };

  const testNotification = () => {
    if (permission === "granted") {
      notificationService.testNotification();
      toast({
        title: "Test notification sent!",
        description: "Check if you received the notification da!"
      });
    } else {
      toast({
        title: "Permission needed da!",
        description: "Enable notifications first to test.",
        variant: "destructive"
      });
    }
  };

  const getPermissionStatus = () => {
    switch (permission) {
      case "granted":
        return { 
          status: "Enabled", 
          color: "text-green-400", 
          bgColor: "bg-green-400/10 border-green-400/30",
          icon: "✅"
        };
      case "denied":
        return { 
          status: "Blocked", 
          color: "text-red-400", 
          bgColor: "bg-red-400/10 border-red-400/30",
          icon: "❌"
        };
      default:
        return { 
          status: "Not Set", 
          color: "text-yellow-400", 
          bgColor: "bg-yellow-400/10 border-yellow-400/30",
          icon: "⚠️"
        };
    }
  };

  const statusInfo = getPermissionStatus();

  return (
    <div className="space-y-4">
      <Card className="card-dark border-aqua-primary/30">
        <CardHeader>
          <CardTitle className="text-aqua-primary flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Center
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Manage your study reminders and notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Permission Status */}
          <div className={`p-3 rounded-lg border ${statusInfo.bgColor}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{statusInfo.icon}</span>
                <span className={`font-medium ${statusInfo.color}`}>
                  Notifications: {statusInfo.status}
                </span>
              </div>
              {permission !== "granted" && (
                <Button
                  onClick={requestPermission}
                  size="sm"
                  className="btn-aqua"
                >
                  Enable
                </Button>
              )}
            </div>
          </div>

          {/* Scheduled Notifications Count */}
          <div className="bg-[hsl(var(--dark-surface))] p-3 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-aqua-secondary" />
                <span className="text-sm font-medium">Active Reminders</span>
              </div>
              <span className="text-aqua-primary font-bold">{scheduledCount}</span>
            </div>
          </div>

          {/* Test Notification */}
          <div className="space-y-2">
            <Button
              onClick={testNotification}
              variant="outline"
              className="w-full border-aqua-primary text-aqua-primary hover:bg-aqua-primary hover:text-black"
              disabled={permission !== "granted"}
            >
              <Bell className="w-4 h-4 mr-2" />
              Test Notification
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Send a test notification to check if it's working properly
            </p>
          </div>

          {/* Notification Info */}
          <div className="bg-[hsl(var(--dark-surface))] p-3 rounded-lg border border-aqua-primary/20">
            <h4 className="text-aqua-secondary font-medium mb-2">📱 How Notifications Work:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Notifications appear at your set reminder time</li>
              <li>• Message: "Intha subject padikalama da?" (Should we study this subject?)</li>
              <li>• Click notification to focus on TimeTutor</li>
              <li>• Notifications auto-close after 10 seconds</li>
              <li>• Works even when browser is minimized</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;