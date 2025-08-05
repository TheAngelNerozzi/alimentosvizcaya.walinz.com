import { useState } from "react";
import { Menu, X, Home, Package, Wheat, Coffee, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import vizcayaLogo from "@/assets/vizcaya-logo.png";

interface SidebarProps {
  currentCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: "all", name: "Todos los Productos", icon: Home },
  { id: "legumbres", name: "Legumbres", icon: Wheat },
  { id: "cereales", name: "Cereales", icon: Coffee },
  { id: "especiales", name: "Presentaciones Especiales", icon: Package },
];

export const Sidebar = ({ currentCategory, onCategoryChange }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-card border-vizcaya-orange"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-vizcaya-orange to-vizcaya-dark-orange p-6 transform transition-transform duration-300 ease-in-out z-40",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="mb-8 text-center">
            <img 
              src={vizcayaLogo} 
              alt="Alimentos Vizcaya" 
              className="w-32 h-auto mx-auto mb-2 bg-white rounded-lg p-2"
            />
            <h1 className="text-white font-bold text-lg">Alimentos Vizcaya</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            <h2 className="text-white/80 text-sm font-medium mb-4 uppercase tracking-wide">
              Categorías
            </h2>
            <ul className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <li key={category.id}>
                    <button
                      onClick={() => {
                        onCategoryChange(category.id);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left",
                        currentCategory === category.id
                          ? "bg-white text-vizcaya-orange"
                          : "text-white hover:bg-white/10"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{category.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer Info */}
          <div className="text-white/60 text-xs text-center">
            <p>Venezuela • Mayoristas</p>
            <p className="mt-1">Pedidos vía WhatsApp</p>
          </div>
        </div>
      </aside>
    </>
  );
};