import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, MapPin, ShoppingCart, Clock } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const MobileNav = () => {
    const location = useLocation();
    const { getTotalItems, setIsCartOpen } = useCart();
    const totalItems = getTotalItems();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden pb-safe">
            <div className="flex justify-around items-center h-16">
                <Link
                    to="/"
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive("/") ? "text-primary" : "text-gray-500"
                        } `}
                >
                    <Home size={24} />
                    <span className="text-xs font-medium">Menu</span>
                </Link>

                <Link
                    to="/locations"
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive("/locations") ? "text-primary" : "text-gray-500"
                        } `}
                >
                    <MapPin size={24} />
                    <span className="text-xs font-medium">Locations</span>
                </Link>

                <div className="relative w-full h-full">
                    <button
                        type="button"
                        onClick={() => setIsCartOpen(true)}
                        className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500"
                    >
                        <div className="relative">
                            <ShoppingCart size={24} />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </div>
                        <span className="text-xs font-medium">Cart</span>
                    </button>
                </div>

                <Link
                    to="/order-status"
                    className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive("/order-status") ? "text-primary" : "text-gray-500"
                        } `}
                >
                    <Clock size={24} />
                    <span className="text-xs font-medium">Orders</span>
                </Link>
            </div>
        </div>
    );
};

export default MobileNav;
