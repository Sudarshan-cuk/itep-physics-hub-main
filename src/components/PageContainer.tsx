import { motion } from 'framer-motion';

const containerVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
	exit: { opacity: 0, y: -20, transition: { duration: 0.5 } }
};

export const PageContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<motion.div
			className="container mx-auto px-4 py-8"
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			exit="exit"
		>
			{children}
		</motion.div>
	);
};
