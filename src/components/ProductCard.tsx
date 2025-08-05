import { useState } from "react";
import { Plus, Minus, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

interface ProductCardProps {
  product: Product;
  quantity: number;
  onQuantityChange: (id: string, quantity: number) => void;
  onWhatsAppOrder: (product: Product, quantity: number) => void;
}

export const ProductCard = ({ 
  product, 
  quantity, 
  onQuantityChange, 
  onWhatsAppOrder 
}: ProductCardProps) => {
  const handleIncrement = () => {
    onQuantityChange(product.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      onQuantityChange(product.id, quantity - 1);
    }
  };

  const handleWhatsAppClick = () => {
    onWhatsAppOrder(product, quantity);
  };

  return (
    <Card className="p-4 transition-all duration-300 hover:shadow-[var(--shadow-elegant)] border-border/50">
      <div className="aspect-square mb-4 rounded-lg overflow-hidden bg-vizcaya-light-beige">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="space-y-3">
        <h3 className="font-medium text-foreground text-sm leading-tight">
          {product.name}
        </h3>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <p>{product.weight} x {product.unitsPerBulk} unidades</p>
          <p className="font-medium">{product.weightPerBulk} por bulto</p>
        </div>

        <div className="text-lg font-bold text-vizcaya-orange">
          ${product.priceUSD.toFixed(2)} USD
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-vizcaya-orange"
              onClick={handleDecrement}
              disabled={quantity === 0}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-vizcaya-orange"
              onClick={handleIncrement}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <Button
            onClick={handleWhatsAppClick}
            className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 h-8"
            disabled={quantity === 0}
          >
            <MessageCircle className="h-3 w-3 mr-1" />
            Pedir
          </Button>
        </div>
      </div>
    </Card>
  );
};