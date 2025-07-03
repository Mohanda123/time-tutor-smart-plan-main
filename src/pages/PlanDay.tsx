import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Clock, AlertTriangle, Bell, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { notificationService } from "@/services/NotificationService";
import NotificationCenter from "@/components/NotificationCenter";

const PlanDay = () => {
  const [task, setTask] = useState("");
  const [timeRange, setTimeRange] = useState("");
  const [importance, setImportance] = useState("");
  const [enableNotification, setEnableNotification] = useState(false);
  const [notificationTime, setNotificationTime] = useState("");
  const { toast } = useToast();

  const handleAddTask = async () => {
    if (!task || !timeRange || !importance) {
      toast({
        title: "Oops! Details missing da!",
        description: "Fill pannama task add pannamudiyadhu. Complete all fields!",
        variant: "destructive"
      });
      return;
    }

    // Validate notification time if enabled
    if (enableNotification && !notificationTime) {
      toast({
        title: "Notification time missing da!",
        description: "Notification enable pannirukeenga but time set pannala!",
        variant: "destructive"
      });
      return;
    }

    // For now, we'll store in localStorage until Supabase is connected
    const existingPlans = JSON.parse(localStorage.getItem("timeTutorPlans") || "[]");
    const newPlan = {
      id: Date.now(),
      task,
      timeRange,
      importance,
      status: "Incomplete",
      date: new Date().toISOString().split('T')[0],
      enableNotification,
      notificationTime: enableNotification ? notificationTime : null
    };

    existingPlans.push(newPlan);
    localStorage.setItem("timeTutorPlans", JSON.stringify(existingPlans));

    // Schedule notification if enabled
    if (enableNotification && notificationTime) {
      const hasPermission = await notificationService.requestPermission();
      
      if (hasPermission) {
        // Parse notification time and create notification date
        const [hours, minutes] = notificationTime.split(':').map(Number);
        const notificationDate = new Date();
        notificationDate.setHours(hours, minutes, 0, 0);
        
        // If the time has passed today, schedule for tomorrow
        if (notificationDate.getTime() <= Date.now()) {
          notificationDate.setDate(notificationDate.getDate() + 1);
        }
        
        notificationService.scheduleNotification(
          newPlan.id.toString(),
          task,
          notificationDate,
          importance
        );
        
        toast({
          title: "Semma da! Task + Notification set! 🔔",
          description: `"${task}" added with reminder at ${notificationTime}. Notification ready!`
        });
      } else {
        toast({
          title: "Task added, but notification permission denied da!",
          description: "Enable notifications in browser settings for reminders.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Semma da! Task added successfully! 🎯",
        description: `"${task}" has been added to your plan. Time to crush it!`
      });
    }

    // Reset form
    setTask("");
    setTimeRange("");
    setImportance("");
    setEnableNotification(false);
    setNotificationTime("");
  };

  const testNotification = () => {
    notificationService.testNotification();
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <header className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="outline" size="icon" className="text-aqua-primary border-aqua-primary hover:bg-aqua-primary hover:text-black">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gradient">Plan My Day</h1>
        </div>
        <p className="text-aqua-secondary text-lg text-center">
          Smart ah plan pannalam da! Let's organize your day 📝
        </p>
      </header>

      {/* Main Form */}
      <main className="max-w-2xl mx-auto">
        <div className="card-dark space-y-6">
          <div className="text-center mb-6">
            <Plus className="w-12 h-12 text-aqua-primary mx-auto mb-2 animate-glow-pulse" />
            <p className="text-muted-foreground">Add tasks one by one to build your perfect day</p>
          </div>

          {/* Task Input */}
          <div className="space-y-2">
            <Label htmlFor="task" className="text-lg font-medium text-aqua-primary flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Enna subject/task padikapora?
            </Label>
            <Input
              id="task"
              placeholder="E.g., Math Revision, English Essay, Project Work..."
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="input-dark text-lg"
            />
          </div>

          {/* Time Range Input */}
          <div className="space-y-2">
            <Label htmlFor="time" className="text-lg font-medium text-aqua-primary flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Eppo padika pora? (Time Range)
            </Label>
            <Input
              id="time"
              placeholder="E.g., 8PM - 9PM, 2:30PM - 4:00PM"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="input-dark text-lg"
            />
            <p className="text-xs text-muted-foreground ml-1">
              Tip: Be specific with start and end times!
            </p>
          </div>

          {/* Importance Dropdown */}
          <div className="space-y-2">
            <Label className="text-lg font-medium text-aqua-primary">
              Task importance?
            </Label>
            <Select value={importance} onValueChange={setImportance}>
              <SelectTrigger className="input-dark text-lg">
                <SelectValue placeholder="Select importance level..." />
              </SelectTrigger>
              <SelectContent className="bg-[hsl(var(--dark-surface))] border-[hsl(var(--border))]">
                <SelectItem value="High" className="text-red-400 hover:bg-[hsl(var(--dark-card))]">
                  🔥 High Priority
                </SelectItem>
                <SelectItem value="Medium" className="text-yellow-400 hover:bg-[hsl(var(--dark-card))]">
                  ⚡ Medium Priority
                </SelectItem>
                <SelectItem value="Low" className="text-green-400 hover:bg-[hsl(var(--dark-card))]">
                  🌱 Low Priority
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notification Settings */}
          <div className="space-y-4 bg-[hsl(var(--dark-surface))] rounded-xl p-4 border border-aqua-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-aqua-primary" />
                <Label htmlFor="notifications" className="text-lg font-medium text-aqua-primary">
                  Smart Notifications
                </Label>
              </div>
              <Switch
                id="notifications"
                checked={enableNotification}
                onCheckedChange={setEnableNotification}
              />
            </div>
            
            <p className="text-sm text-muted-foreground">
              Get reminded to study with "Intha subject padikalama da?" 🔔
            </p>

            {enableNotification && (
              <div className="space-y-2 animate-fade-in">
                <Label htmlFor="notificationTime" className="text-sm font-medium text-aqua-secondary">
                  Reminder Time
                </Label>
                <Input
                  id="notificationTime"
                  type="time"
                  value={notificationTime}
                  onChange={(e) => setNotificationTime(e.target.value)}
                  className="input-dark"
                />
                <p className="text-xs text-muted-foreground">
                  We'll send a notification at this time asking if you're ready to study!
                </p>
                <Button
                  type="button"
                  onClick={testNotification}
                  variant="outline"
                  size="sm"
                  className="text-aqua-primary border-aqua-primary hover:bg-aqua-primary hover:text-black"
                >
                  <BellRing className="w-4 h-4 mr-2" />
                  Test Notification
                </Button>
              </div>
            )}
          </div>

          {/* Add Button */}
          <Button 
            onClick={handleAddTask}
            className="btn-aqua w-full text-lg py-6 font-semibold"
          >
            <Plus className="w-5 h-5 mr-2" />
            {enableNotification ? "Add Task + Set Reminder" : "Add to Today's Plan"}
          </Button>

          {/* Quick Tips */}
          <div className="bg-[hsl(var(--dark-surface))] rounded-xl p-4 border border-aqua-primary/20">
            <h3 className="text-aqua-secondary font-medium mb-2">💡 Planning Tips:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Set notification 15-30 mins before study time</li>
              <li>• Break big tasks into smaller chunks</li>
              <li>• Keep realistic time estimates</li>
              <li>• High priority tasks should get your peak energy hours</li>
            </ul>
          </div>
          
          {/* Notification Center */}
          <NotificationCenter />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 mt-8">
        <p className="text-xs text-muted-foreground">
          🧠 TimeTutor – Plan Smart. Win Smart. By Mohan
        </p>
      </footer>
    </div>
  );
};

export default PlanDay;