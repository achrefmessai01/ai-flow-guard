import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LiteLLMLog {
  id: number;
  spend: number | null;
  total_tokens: number | null;
  prompt_tokens: number | null;
  completion_tokens: number | null;
  starttime: string | null;
  endtime: string | null;
  latency_sec: number | null;
  user_id: string | null;
  status: string | null;
  prompt: string | null;
  model: string | null;
  response_text: string | null;
  security_analysis: any;
  performance_cost_analysis: any;
  created_at: string | null;
}

export const useLiteLLMLogs = (limit = 50) => {
  return useQuery({
    queryKey: ["litellm_logs", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("litellm_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });
};

export const useSecurityAlerts = () => {
  return useQuery({
    queryKey: ["security_alerts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("litellm_logs")
        .select("*")
        .not("security_analysis", "is", null)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      
      return data?.filter(log => {
        const analysis = log.security_analysis as any;
        return analysis?.severity === "CRITICAL" || analysis?.severity === "HIGH";
      });
    },
    refetchInterval: 10000, // Check for security alerts every 10 seconds
  });
};

export const useOverallPerformance = () => {
  return useQuery({
    queryKey: ["overall_performance"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("overall_perf")
        .select("data")
        .limit(1)
        .single();

      if (error) throw error;
      return data?.data?.output || null;
    },
    refetchInterval: 60000, // Refresh every minute
  });
};

export const usePerformanceMetrics = () => {
  return useQuery({
    queryKey: ["performance_metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("litellm_logs")
        .select("spend, total_tokens, latency_sec, status, model, created_at")
        .not("spend", "is", null);

      if (error) throw error;

      const logs = data || [];
      const totalRequests = logs.length;
      const totalSpend = logs.reduce((sum, log) => sum + (log.spend || 0), 0);
      const successfulRequests = logs.filter(log => log.status === "success").length;
      const successRate = totalRequests > 0 ? (successfulRequests / totalRequests * 100).toFixed(1) : "0";
      
      const avgLatency = logs.length > 0 
        ? (logs.reduce((sum, log) => sum + (log.latency_sec || 0), 0) / logs.length).toFixed(1)
        : "0";

      // Find most used model
      const modelCounts = logs.reduce((acc, log) => {
        if (log.model) {
          acc[log.model] = (acc[log.model] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);
      
      const topModel = Object.entries(modelCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || "N/A";

      return {
        totalRequests,
        totalSpend: totalSpend.toFixed(2),
        successRate: `${successRate}%`,
        avgLatency: `${avgLatency}s`,
        topModel,
      };
    },
    refetchInterval: 30000,
  });
};