import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export const MyPage = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{
        y: -100,
        opacity: 0.2,
      }}
      animate={{
        y: 0,
        opacity: 1,
        transition: {
          duration: 0.5,
          type: 'keyframes',
        },
      }}
      exit={{
        y: -100,
        opacity: 0,
      }}
    >
      {children}
    </motion.div>
  );
};
