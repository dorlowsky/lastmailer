import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { InsertEmail, BulkEmailRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useEmails() {
  return useQuery({
    queryKey: [api.emails.list.path],
    queryFn: async () => {
      const res = await fetch(api.emails.list.path);
      if (!res.ok) throw new Error("Failed to fetch emails");
      return api.emails.list.responses[200].parse(await res.json());
    },
  });
}

export function useSendEmail() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertEmail) => {
      const res = await fetch(api.emails.send.path, {
        method: api.emails.send.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const json = await res.json();
      
      if (!res.ok) {
        throw new Error(json.message || "Failed to send email");
      }
      
      return api.emails.send.responses[200].parse(json);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.emails.list.path] });
      toast({
        title: "Email Sent",
        description: data.message,
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Send",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useSendBulkEmails() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: BulkEmailRequest) => {
      const res = await fetch(api.emails.sendBulk.path, {
        method: api.emails.sendBulk.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const json = await res.json();
      
      if (!res.ok) {
        throw new Error(json.message || "Failed to send bulk emails");
      }
      
      return api.emails.sendBulk.responses[200].parse(json);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.emails.list.path] });
      toast({
        title: "Bulk Send Complete",
        description: data.message,
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Send",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
