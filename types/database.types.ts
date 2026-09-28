export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string
          avatar_url: string | null
          bio: string | null
          timezone: string
          primary_currency: string
          theme: string
          sound_enabled: boolean
          particles_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name: string
          avatar_url?: string | null
          bio?: string | null
          timezone?: string
          primary_currency?: string
          theme?: string
          sound_enabled?: boolean
          particles_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          avatar_url?: string | null
          bio?: string | null
          timezone?: string
          primary_currency?: string
          theme?: string
          sound_enabled?: boolean
          particles_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          user_id: string
          total_xp: number
          current_level: number
          current_streak: number
          longest_streak: number
          last_active_date: string | null
          total_tasks_completed: number
          total_habits_completed: number
          total_focus_minutes: number
          updated_at: string
        }
        Insert: {
          user_id: string
          total_xp?: number
          current_level?: number
          current_streak?: number
          longest_streak?: number
          last_active_date?: string | null
          total_tasks_completed?: number
          total_habits_completed?: number
          total_focus_minutes?: number
          updated_at?: string
        }
        Update: {
          user_id?: string
          total_xp?: number
          current_level?: number
          current_streak?: number
          longest_streak?: number
          last_active_date?: string | null
          total_tasks_completed?: number
          total_habits_completed?: number
          total_focus_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string
          icon: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color?: string
          icon?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string
          icon?: string
          created_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          category_id: string | null
          title: string
          description: string | null
          priority: "low" | "medium" | "high" | "urgent"
          difficulty: "small" | "normal" | "difficult" | "milestone"
          xp_value: number
          due_date: string | null
          due_time: string | null
          estimated_duration_minutes: number | null
          is_recurring: boolean
          recurrence_rule: string | null
          parent_goal_id: string | null
          is_completed: boolean
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id?: string | null
          title: string
          description?: string | null
          priority?: "low" | "medium" | "high" | "urgent"
          difficulty?: "small" | "normal" | "difficult" | "milestone"
          xp_value?: number
          due_date?: string | null
          due_time?: string | null
          estimated_duration_minutes?: number | null
          is_recurring?: boolean
          recurrence_rule?: string | null
          parent_goal_id?: string | null
          is_completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string | null
          title?: string
          description?: string | null
          priority?: "low" | "medium" | "high" | "urgent"
          difficulty?: "small" | "normal" | "difficult" | "milestone"
          xp_value?: number
          due_date?: string | null
          due_time?: string | null
          estimated_duration_minutes?: number | null
          is_recurring?: boolean
          recurrence_rule?: string | null
          parent_goal_id?: string | null
          is_completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      task_occurrences: {
        Row: {
          id: string
          task_id: string
          user_id: string
          occurrence_date: string
          is_cancelled: boolean
          is_completed: boolean
          completed_at: string | null
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          occurrence_date: string
          is_cancelled?: boolean
          is_completed?: boolean
          completed_at?: string | null
        }
        Update: {
          id?: string
          task_id?: string
          user_id?: string
          occurrence_date?: string
          is_cancelled?: boolean
          is_completed?: boolean
          completed_at?: string | null
        }
        Relationships: []
      }
      task_completions: {
        Row: {
          id: string
          task_id: string
          user_id: string
          completed_date: string
          completed_at: string
          xp_awarded: number
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          completed_date?: string
          completed_at?: string
          xp_awarded?: number
        }
        Update: {
          id?: string
          task_id?: string
          user_id?: string
          completed_date?: string
          completed_at?: string
          xp_awarded?: number
        }
        Relationships: []
      }
      habits: {
        Row: {
          id: string
          user_id: string
          category_id: string | null
          title: string
          description: string | null
          frequency: "daily" | "weekdays" | "weekends" | "weekly"
          target_days_per_week: number
          time_of_day: "morning" | "afternoon" | "evening" | "anytime"
          current_streak: number
          longest_streak: number
          xp_per_completion: number
          is_archived: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id?: string | null
          title: string
          description?: string | null
          frequency?: "daily" | "weekdays" | "weekends" | "weekly"
          target_days_per_week?: number
          time_of_day?: "morning" | "afternoon" | "evening" | "anytime"
          current_streak?: number
          longest_streak?: number
          xp_per_completion?: number
          is_archived?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string | null
          title?: string
          description?: string | null
          frequency?: "daily" | "weekdays" | "weekends" | "weekly"
          target_days_per_week?: number
          time_of_day?: "morning" | "afternoon" | "evening" | "anytime"
          current_streak?: number
          longest_streak?: number
          xp_per_completion?: number
          is_archived?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      habit_completions: {
        Row: {
          id: string
          habit_id: string
          user_id: string
          completion_date: string
          completed_at: string
          notes: string | null
          xp_awarded: number
        }
        Insert: {
          id?: string
          habit_id: string
          user_id: string
          completion_date?: string
          completed_at?: string
          notes?: string | null
          xp_awarded?: number
        }
        Update: {
          id?: string
          habit_id?: string
          user_id?: string
          completion_date?: string
          completed_at?: string
          notes?: string | null
          xp_awarded?: number
        }
        Relationships: []
      }
      routines: {
        Row: {
          id: string
          user_id: string
          name: string
          type: "weekday" | "weekend" | "custom"
          description: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: "weekday" | "weekend" | "custom"
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: "weekday" | "weekend" | "custom"
          description?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      routine_items: {
        Row: {
          id: string
          routine_id: string
          title: string
          description: string | null
          activity_type: string | null
          start_time: string
          end_time: string
          duration_minutes: number
          order_index: number
          energy_level: "high" | "medium" | "low" | "rest" | null
          icon: string | null
          xp_reward: number
          created_at: string
        }
        Insert: {
          id?: string
          routine_id: string
          title: string
          description?: string | null
          activity_type?: string | null
          start_time: string
          end_time: string
          duration_minutes: number
          order_index?: number
          energy_level?: "high" | "medium" | "low" | "rest" | null
          icon?: string | null
          xp_reward?: number
          created_at?: string
        }
        Update: {
          id?: string
          routine_id?: string
          title?: string
          description?: string | null
          activity_type?: string | null
          start_time?: string
          end_time?: string
          duration_minutes?: number
          order_index?: number
          energy_level?: "high" | "medium" | "low" | "rest" | null
          icon?: string | null
          xp_reward?: number
          created_at?: string
        }
        Relationships: []
      }
      routine_completions: {
        Row: {
          id: string
          routine_id: string
          routine_item_id: string | null
          user_id: string
          completion_date: string
          completed_at: string
          xp_awarded: number
        }
        Insert: {
          id?: string
          routine_id: string
          routine_item_id?: string | null
          user_id: string
          completion_date?: string
          completed_at?: string
          xp_awarded?: number
        }
        Update: {
          id?: string
          routine_id?: string
          routine_item_id?: string | null
          user_id?: string
          completion_date?: string
          completed_at?: string
          xp_awarded?: number
        }
        Relationships: []
      }
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          vision: string | null
          track: string
          target_year: number
          target_quarter: number | null
          target_month: number | null
          status: "not_started" | "in_progress" | "completed" | "paused"
          progress_percentage: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          vision?: string | null
          track?: string
          target_year?: number
          target_quarter?: number | null
          target_month?: number | null
          status?: "not_started" | "in_progress" | "completed" | "paused"
          progress_percentage?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          vision?: string | null
          track?: string
          target_year?: number
          target_quarter?: number | null
          target_month?: number | null
          status?: "not_started" | "in_progress" | "completed" | "paused"
          progress_percentage?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      goal_milestones: {
        Row: {
          id: string
          goal_id: string
          title: string
          description: string | null
          target_month: number
          status: "pending" | "in_progress" | "completed"
          xp_reward: number
          is_completed: boolean
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          goal_id: string
          title: string
          description?: string | null
          target_month: number
          status?: "pending" | "in_progress" | "completed"
          xp_reward?: number
          is_completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          goal_id?: string
          title?: string
          description?: string | null
          target_month?: number
          status?: "pending" | "in_progress" | "completed"
          xp_reward?: number
          is_completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      roadmap_nodes: {
        Row: {
          id: string
          goal_id: string | null
          milestone_id: string | null
          parent_node_id: string | null
          node_type: "milestone" | "action" | "decision" | "checkpoint"
          title: string
          description: string | null
          status: "locked" | "unlocked" | "active" | "completed"
          xp_reward: number
          position_x: number
          position_y: number
          created_at: string
        }
        Insert: {
          id?: string
          goal_id?: string | null
          milestone_id?: string | null
          parent_node_id?: string | null
          node_type: "milestone" | "action" | "decision" | "checkpoint"
          title: string
          description?: string | null
          status?: "locked" | "unlocked" | "active" | "completed"
          xp_reward?: number
          position_x?: number
          position_y?: number
          created_at?: string
        }
        Update: {
          id?: string
          goal_id?: string | null
          milestone_id?: string | null
          parent_node_id?: string | null
          node_type?: "milestone" | "action" | "decision" | "checkpoint"
          title?: string
          description?: string | null
          status?: "locked" | "unlocked" | "active" | "completed"
          xp_reward?: number
          position_x?: number
          position_y?: number
          created_at?: string
        }
        Relationships: []
      }
      focus_sessions: {
        Row: {
          id: string
          user_id: string
          task_id: string | null
          duration_seconds: number
          environment_sound: string | null
          notes: string | null
          xp_earned: number
          started_at: string
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id?: string | null
          duration_seconds: number
          environment_sound?: string | null
          notes?: string | null
          xp_earned?: number
          started_at: string
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string | null
          duration_seconds?: number
          environment_sound?: string | null
          notes?: string | null
          xp_earned?: number
          started_at?: string
          completed_at?: string
        }
        Relationships: []
      }
      expenses: {
        Row: {
          id: string
          user_id: string
          category_id: string | null
          amount: number
          currency: string
          description: string | null
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_id?: string | null
          amount: number
          currency?: string
          description?: string | null
          date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_id?: string | null
          amount?: number
          currency?: string
          description?: string | null
          date?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      xp_events: {
        Row: {
          id: string
          user_id: string
          source_type: "task" | "habit" | "routine" | "focus" | "roadmap" | "achievement" | "bonus"
          source_id: string | null
          xp_amount: number
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          source_type: "task" | "habit" | "routine" | "focus" | "roadmap" | "achievement" | "bonus"
          source_id?: string | null
          xp_amount: number
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          source_type?: "task" | "habit" | "routine" | "focus" | "roadmap" | "achievement" | "bonus"
          source_id?: string | null
          xp_amount?: number
          description?: string | null
          created_at?: string
        }
        Relationships: []
      }
      achievements: {
        Row: {
          id: string
          title: string
          description: string
          badge_icon: string
          tier: "bronze" | "silver" | "gold" | "platinum"
          xp_bonus: number
        }
        Insert: {
          id: string
          title: string
          description: string
          badge_icon: string
          tier?: "bronze" | "silver" | "gold" | "platinum"
          xp_bonus?: number
        }
        Update: {
          id?: string
          title?: string
          description?: string
          badge_icon?: string
          tier?: "bronze" | "silver" | "gold" | "platinum"
          xp_bonus?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
