import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { ProductCard } from "@/components/ProductCard";
import { Cart } from "@/components/Cart";
import { CheckoutForm } from "@/components/CheckoutForm";
import { PoweredBy } from "@/components/PoweredBy";
import { useToast } from "@/hooks/use-toast";

// Import product images
import arvejaVerde from "@/assets/arveja-verde.jpg";
import avenaHojuelas from "@/assets/avena-hojuelas.jpg";
import caraotasNegras from "@/assets/caraotas-negras.jpg";
import maizCotufa from "@/assets/maiz-cotufa.jpg";
import avenaSaco from "@/assets/avena-saco.jpg";

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

interface CheckoutFormData {
  fullName: string;
  cedula: string;
  phone: string;
  address: string;
}

const products: Product[] = [
  {
    id: "1",
    name: "Arveja Verde Partida Vizcaya",
    image: arvejaVerde,
    weight: "500gm",
    unitsPerBulk: 24,
    weightPerBulk: "12kgrs",
    category: "legumbres",
    priceUSD: 45.00
  },
  {
    id: "2",
    name: "NutriAvena Avena en Hojuelas",
    image: avenaHojuelas,
    weight: "400grs",
    unitsPerBulk: 24,
    weightPerBulk: "9.600kgrs",
    category: "cereales",
    priceUSD: 38.50
  },
  {
    id: "3",
    name: "Caraotas Negras Vizcaya",
    image: caraotasNegras,
    weight: "500grs",
    unitsPerBulk: 24,
    weightPerBulk: "12kgrs",
    category: "legumbres",
    priceUSD: 42.00
  },
  {
    id: "4",
    name: "Maíz de Cotufa Vizcaya",
    image: maizCotufa,
    weight: "500grs",
    unitsPerBulk: 24,
    weightPerBulk: "12kgrs",
    category: "cereales",
    priceUSD: 35.00
  },
  {
    id: "5",
    name: "Avena Vizcaya en Hojuelas 200grs",
    image: avenaHojuelas,
    weight: "200grs",
    unitsPerBulk: 24,
    weightPerBulk: "4.800kgrs",
    category: "cereales",
    priceUSD: 28.00
  },
  {
    id: "6",
    name: "Avena Vizcaya en Hojuelas 400grs",
    image: avenaHojuelas,
    weight: "400grs",
    unitsPerBulk: 24,
    weightPerBulk: "9.600kgrs",
    category: "cereales",
    priceUSD: 38.50
  },
  {
    id: "7",
    name: "Saco Avena en Hojuelas Vizcaya 5KG",
    image: avenaSaco,
    weight: "5KG",
    unitsPerBulk: 1,
    weightPerBulk: "5KG",
    category: "especiales",
    priceUSD: 15.00
  },
  {
    id: "8",
    name: "Saco de Avena en Hojuelas Vizcaya 10KG",
    image: avenaSaco,
    weight: "10KG",
    unitsPerBulk: 1,
    weightPerBulk: "10KG",
    category: "especiales",
    priceUSD: 28.00
  }
];

const Index = () => {
  const [currentCategory, setCurrentCategory] = useState("all");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<{
    items: CartItem[];
    total: { usd: number; bs: number };
  } | null>(null);
  const { toast } = useToast();

  const filteredProducts = products.filter(product => 
    currentCategory === "all" || product.category === currentCategory
  );

  const cartItems: CartItem[] = products
    .filter(product => quantities[product.id] > 0)
    .map(product => ({
      product,
      quantity: quantities[product.id]
    }));

  const handleQuantityChange = (productId: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: quantity
    }));
  };

  const generateWhatsAppMessage = (
    product: Product, 
    quantity: number, 
    customerData?: CheckoutFormData
  ) => {
    const message = `¡Hola! Me interesa hacer un pedido:

📦 *Producto:* ${product.name}
📏 *Presentación:* ${product.weight} x ${product.unitsPerBulk} unidades
📊 *Cantidad:* ${quantity} bulto(s)
💰 *Total:* $${(product.priceUSD * quantity).toFixed(2)} USD

${customerData ? `
👤 *Datos del cliente:*
• Nombre: ${customerData.fullName}
• Cédula: ${customerData.cedula}
• Teléfono: ${customerData.phone}
• Dirección: ${customerData.address}

💳 *Método de pago:* Pago Móvil
` : ''}

¿Pueden confirmar disponibilidad y procesar mi pedido?`;

    return encodeURIComponent(message);
  };

  const generateWhatsAppMessageForCart = (
    items: CartItem[], 
    total: { usd: number; bs: number },
    customerData: CheckoutFormData
  ) => {
    const itemsList = items.map(item => 
      `• ${item.product.name} - ${item.quantity} bulto(s) - $${(item.product.priceUSD * item.quantity).toFixed(2)}`
    ).join('\n');

    const message = `¡Hola! Me interesa hacer este pedido completo:

📦 *Productos:*
${itemsList}

💰 *Total:* $${total.usd.toFixed(2)} USD
💰 *Total Bs:* Bs. ${total.bs.toLocaleString('es-VE', { minimumFractionDigits: 2 })}

👤 *Datos del cliente:*
• Nombre: ${customerData.fullName}
• Cédula: ${customerData.cedula}
• Teléfono: ${customerData.phone}
• Dirección: ${customerData.address}

💳 *Método de pago:* Pago Móvil

¿Pueden confirmar disponibilidad y procesar mi pedido?`;

    return encodeURIComponent(message);
  };

  const handleWhatsAppOrder = (product: Product, quantity: number) => {
    if (quantity === 0) {
      toast({
        title: "Cantidad requerida",
        description: "Debe seleccionar al menos 1 bulto para hacer el pedido",
        variant: "destructive"
      });
      return;
    }

    const message = generateWhatsAppMessage(product, quantity);
    const whatsappUrl = `https://wa.me/14424474116?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleWhatsAppOrderAll = (items: CartItem[], total: { usd: number; bs: number }) => {
    setPendingOrder({ items, total });
    setIsCheckoutOpen(true);
  };

  const handleCheckoutSubmit = (customerData: CheckoutFormData) => {
    if (!pendingOrder) return;

    const message = generateWhatsAppMessageForCart(
      pendingOrder.items, 
      pendingOrder.total, 
      customerData
    );
    const whatsappUrl = `https://wa.me/14424474116?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Clear cart and close form
    setQuantities({});
    setIsCheckoutOpen(false);
    setPendingOrder(null);
    
    toast({
      title: "Pedido enviado",
      description: "Su pedido ha sido enviado por WhatsApp. Le responderemos pronto.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        currentCategory={currentCategory} 
        onCategoryChange={setCurrentCategory} 
      />
      
      <main className="md:ml-64 p-4 md:p-6">
        {/* Header */}
        <div className="mb-8 pt-16 md:pt-0">
          <div className="bg-gradient-to-r from-vizcaya-orange to-vizcaya-dark-orange text-white rounded-lg p-6 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Alimentos Vizcaya
            </h1>
            <p className="text-white/90 text-sm md:text-base">
              Calidad premium para mayoristas • Pedidos directos por WhatsApp
            </p>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {currentCategory === "all" ? "Todos los Productos" : 
               currentCategory === "legumbres" ? "Legumbres" :
               currentCategory === "cereales" ? "Cereales" : 
               "Presentaciones Especiales"}
            </h2>
            <p className="text-muted-foreground text-sm">
              Productos de alta calidad para distribuidores y mayoristas
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-20">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={quantities[product.id] || 0}
              onQuantityChange={handleQuantityChange}
              onWhatsAppOrder={handleWhatsAppOrder}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No hay productos en esta categoría
            </p>
          </div>
        )}
      </main>

      <Cart 
        items={cartItems}
        onWhatsAppOrderAll={handleWhatsAppOrderAll}
      />

      <CheckoutForm
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSubmit={handleCheckoutSubmit}
      />

      <PoweredBy />
    </div>
  );
};

export default Index;