import React, { useState, useContext, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import {
  Menu,
  Search,
  User,
  ShoppingCart,
  X,
  ChevronLeft,
  ChevronDown,
} from "lucide-react";
import { assets } from "../assets/assets";
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { setShowSearch, getCartCount, token, setToken, setCartItems } =
    useContext(ShopContext);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
        setActiveCategory(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setActiveCategory(null);
  }, [location]);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    setIsProfileDropdownOpen(false);
  };

  const categories = {
    collection: {
      label: "Collection",
      subcategories: [
        {
          title: "Categories",
          items: [
            { name: "Tops", category: "Tops" },
            { name: "Bottoms", category: "Bottoms" },
            { name: "Outerwears", category: "Outerwears" },
          ],
        },
        {
          title: "Types",
          items: [
            { name: "Polo", subCategory: "Polo" },
            { name: "Shorts", subCategory: "Shorts" },
            { name: "Cargo", subCategory: "Cargo" },
            { name: "Jeans", subCategory: "Jeans" },
            { name: "Jackets", subCategory: "Jackets" },
            { name: "Sweatshirt", subCategory: "Sweatshirt" },
            { name: "Hoodies", subCategory: "Hoodies" },
          ],
        },
        {
          title: "Sort By",
          items: [
            { name: "Price: Low to High", sort: "low-high" },
            { name: "Price: High to Low", sort: "high-low" },
            { name: "Relevant", sort: "relevant" },
          ],
        },
      ],
    },
  };

  const handleCollectionClick = (item) => {
    const searchParams = new URLSearchParams();

    if (item.category) {
      searchParams.append("category", item.category);
    }
    if (item.subCategory) {
      searchParams.append("subCategory", item.subCategory);
    }
    if (item.sort) {
      searchParams.append("sort", item.sort);
    }

    const url = `/collection${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    navigate(url);
    setActiveCategory(null);
  };

  return (
    <div className="bg-white relative z-50">
      {/* Top Banner */}
      <div className="bg-black text-white text-xs py-2 px-4 text-center">
        <p className="animate-pulse">Free Shipping on Orders Over ₦100,000</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 transition-transform duration-200 hover:scale-105"
          >
            <img src={assets.log2} className="w-28" alt="Logo" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) => `
                relative text-sm font-medium tracking-wide
                ${isActive ? "text-black" : "text-gray-600"}
                before:content-[''] before:absolute before:-bottom-1 before:left-0 
                before:w-full before:h-0.5 before:bg-black 
                before:origin-right before:scale-x-0 before:transition-transform
                hover:before:scale-x-100 hover:before:origin-left
              `}
            >
              HOME
            </NavLink>

            <NavLink
              to="/collection"
              className={({ isActive }) => `
                relative text-sm font-medium tracking-wide
                ${isActive ? "text-black" : "text-gray-600"}
                before:content-[''] before:absolute before:-bottom-1 before:left-0 
                before:w-full before:h-0.5 before:bg-black 
                before:origin-right before:scale-x-0 before:transition-transform
                hover:before:scale-x-100 hover:before:origin-left
              `}
            >
              COLLECTION
            </NavLink>

            {/* Collection Mega Menu Trigger */}
            {/* <div
              className="relative group"
              onMouseEnter={() => setActiveCategory("collection")}
              onMouseLeave={() => setActiveCategory(null)}
            > */}

            {/* Mega Menu */}
            {/* {activeCategory === "collection" && (
                <div className="absolute top-full left-0 w-screen max-w-4xl bg-white shadow-xl rounded-b-lg transform translate-y-2 opacity-100 transition-all duration-200">
                  <div className="grid grid-cols-3 gap-8 p-8">
                    {categories.collection.subcategories.map((section, idx) => (
                      <div key={idx} className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                          {section.title}
                        </h3>
                        <ul className="space-y-2">
                          {section.items.map((item, itemIdx) => (
                            <li key={itemIdx}>
                              <button
                                onClick={() => handleCollectionClick(item)}
                                className="text-sm text-gray-600 hover:text-black transition-colors"
                              >
                                {item.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="bg-gray-50 px-8 py-4 rounded-b-lg">
                    <p className="text-sm text-gray-500">
                      Free shipping on all orders over $100
                    </p>
                  </div>
                </div>
              )}
            </div>  */}

            {/* {/* {activeCategory === "collection" && (
      <div className="absolute top-full left-0 w-screen max-w-4xl bg-white shadow-xl rounded-b-lg transform translate-y-2 opacity-100 transition-all duration-200">
        <div className="grid grid-cols-3 gap-8 p-8">
          {categories.collection.subcategories.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <Link
                      to={`/collection?${new URLSearchParams(
                        item.category ? { category: item.category } :
                        item.subCategory ? { subCategory: item.subCategory } :
                        item.sort ? { sort: item.sort } : {}
                      ).toString()}`}
                      className="text-sm text-gray-600 hover:text-black transition-colors block w-full text-left"
                      onClick={() => handleCollectionClick(item)}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 px-8 py-4 rounded-b-lg">
          <p className="text-sm text-gray-500">
            Free shipping on all orders over 100,000
          </p>
        </div>
      </div>
    )}
</div> */}

            {/* Rest of the navbar code remains the same */}

            <NavLink
              to="/about"
              className={({ isActive }) => `
                relative text-sm font-medium tracking-wide
                ${isActive ? "text-black" : "text-gray-600"}
                before:content-[''] before:absolute before:-bottom-1 before:left-0 
                before:w-full before:h-0.5 before:bg-black 
                before:origin-right before:scale-x-0 before:transition-transform
                hover:before:scale-x-100 hover:before:origin-left
              `}
            >
              ABOUT
            </NavLink>

            <NavLink
              to="/contact"
              className={({ isActive }) => `
                relative text-sm font-medium tracking-wide
                ${isActive ? "text-black" : "text-gray-600"}
                before:content-[''] before:absolute before:-bottom-1 before:left-0 
                before:w-full before:h-0.5 before:bg-black 
                before:origin-right before:scale-x-0 before:transition-transform
                hover:before:scale-x-100 hover:before:origin-left
              `}
            >
              CONTACT
            </NavLink>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() =>
                  token
                    ? setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    : navigate("/login")
                }
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                aria-label="Profile"
              >
                <User className="w-5 h-5" />
              </button>

              {/* Profile Dropdown */}
              {token && isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 ring-1 ring-black ring-opacity-5 transform transition-all duration-200 ease-out">
                  <button
                    onClick={() => navigate("/orders")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                  >
                    Orders
                  </button>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            <Link
              to="/cart"
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label={`Cart with ${getCartCount()} items`}
            >
              <ShoppingCart className="w-5 h-5" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-110">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
          fixed inset-0 bg-white transform transition-transform duration-300 ease-in-out z-50
          ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
            {token ? (
              <button
                onClick={logout}
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            <nav className="px-4 py-6 space-y-2">
              {["Home", "Collection", "About", "Contact"].map((item) => (
                <Link
                  key={item}
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 text-lg font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  {item}
                </Link>
              ))}
            </nav>

            {token && (
              <div className="px-4 py-6 border-t">
                <Link
                  to="/orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-3 px-4 text-lg font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  Orders
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
