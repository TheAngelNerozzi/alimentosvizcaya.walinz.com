import { useState } from "react";
import { User, Phone, MapPin, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface CheckoutFormData {
  fullName: string;
  cedula: string;
  phone: string;
  address: string;
}

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutForm = ({ onSubmit, isOpen, onClose }: CheckoutFormProps) => {
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    cedula: "",
    phone: "",
    address: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      fullName: "",
      cedula: "",
      phone: "",
      address: "",
    });
  };

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border shadow-[var(--shadow-elegant)]">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground mb-2">
              Datos del Comprador
            </h2>
            <p className="text-sm text-muted-foreground">
              Complete sus datos para procesar el pedido
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4" />
                Nombre Completo
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                placeholder="Ingrese su nombre completo"
                required
                className="border-border focus:ring-vizcaya-orange"
              />
            </div>

            <div>
              <Label htmlFor="cedula" className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4" />
                Cédula de Identidad
              </Label>
              <Input
                id="cedula"
                value={formData.cedula}
                onChange={(e) => handleChange("cedula", e.target.value)}
                placeholder="V-12345678"
                required
                className="border-border focus:ring-vizcaya-orange"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4" />
                Teléfono
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+58 412-1234567"
                required
                className="border-border focus:ring-vizcaya-orange"
              />
            </div>

            <div>
              <Label htmlFor="address" className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4" />
                Dirección
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Ingrese su dirección completa"
                required
                rows={3}
                className="border-border focus:ring-vizcaya-orange"
              />
            </div>

            <div className="bg-vizcaya-light-beige p-4 rounded-lg">
              <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Método de Pago
              </h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Pago Móvil:</strong></p>
                <p>Banco: Banco de Venezuela</p>
                <p>Teléfono: 0412-1234567</p>
                <p>Cédula: V-12345678</p>
                <p>Titular: Alimentos Vizcaya C.A.</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-border"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-vizcaya-orange hover:bg-vizcaya-dark-orange text-white"
              >
                Continuar
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};