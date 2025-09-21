import Link from 'next/link';
import { motion } from 'framer-motion';
// ...existing imports...

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="bg-white shadow-md py-4"
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center">
          <Link href="/">
            <a className="text-2xl font-bold text-primary">MySite</a>
          </Link>
        </div>
        {/* Right: Navigation Links */}
        <div className="flex space-x-6">
          <Link href="/about">
            <a className="text-gray-700 hover:text-primary transition-colors duration-300">About</a>
          </Link>
          <Link href="/services">
            <a className="text-gray-700 hover:text-primary transition-colors duration-300">Services</a>
          </Link>
          <Link href="/contact">
            <a className="text-gray-700 hover:text-primary transition-colors duration-300">Contact</a>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
