import { useState, useEffect } from "react";
import { ShoppingCart, MessageCircle, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  image: string;
  weight: string;
  unitsPerBulk: number;
  weightPerBulk: string;
  category: string;
  priceUSD: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onWhatsAppOrderAll: (items: CartItem[], total: { usd: number; bs: number }) => void;
}

export const Cart = ({ items, onWhatsAppOrderAll }: CartProps) => {
  const [exchangeRate, setExchangeRate] = useState(36.50); // Tasa ejemplo BCV
  const [isOpen, setIsOpen] = useState(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalUSD = items.reduce((sum, item) => sum + (item.product.priceUSD * item.quantity), 0);
  const totalBS = totalUSD * exchangeRate;

  const handleOrderAll = () => {
    onWhatsAppOrderAll(items, { usd: totalUSD, bs: totalBS });
  };

  if (totalItems === 0) {
    return (
      <div className="fixed bottom-4 right-4 z-30">
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShoppingCart className="h-5 w-5" />
            <span className="text-sm">Carrito vacío</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-30">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-vizcaya-orange hover:bg-vizcaya-dark-orange text-white rounded-full shadow-[var(--shadow-elegant)] relative"
          size="lg"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          <span>Ver Carrito</span>
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {totalItems}
          </Badge>
        </Button>
      ) : (
        <Card className="w-80 max-h-96 overflow-hidden bg-card border-border shadow-[var(--shadow-elegant)]">
          <div className="p-4 border-b border-border bg-vizcaya-light-beige">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Carrito ({totalItems} items)
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground"
              >
                Cerrar
              </Button>
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto p-4 space-y-3">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3 text-sm">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-12 h-12 object-cover rounded bg-vizcaya-light-beige"
                />
                <div className="flex-1">
                  <p className="font-medium text-foreground leading-tight">
                    {item.product.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {item.quantity} x ${item.product.priceUSD.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-vizcaya-orange">
                    ${(item.product.priceUSD * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border bg-vizcaya-light-beige">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-foreground">Total USD:</span>
                <span className="font-bold text-vizcaya-orange text-lg">
                  ${totalUSD.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Bs:</span>
                <span className="font-medium text-foreground">
                  Bs. {totalBS.toLocaleString('es-VE', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="text-xs text-muted-foreground text-center">
                <Calculator className="h-3 w-3 inline mr-1" />
                Tasa BCV: Bs. {exchangeRate.toFixed(2)}
              </div>
            </div>

            <Button
              onClick={handleOrderAll}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Ordenar por WhatsApp
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};