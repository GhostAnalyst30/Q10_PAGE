"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Shield } from "lucide-react";

interface KeyConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (key: string) => Promise<void>;
  title?: string;
  description?: string;
}

export function KeyConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Confirmar identidad",
  description = "Ingresa tu clave de superadmin para continuar",
}: KeyConfirmDialogProps) {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onConfirm(key);
      setKey("");
      onOpenChange(false);
    } catch {
      // error handled by parent
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary mb-4">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-key">Clave de seguridad</Label>
            <Input
              id="admin-key"
              type="password"
              placeholder="••••••••"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            variant="gradient"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Confirmar"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
