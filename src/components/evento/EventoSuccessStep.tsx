"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export function EventoSuccessStep() {
  const router = useRouter();

  const handleGoToEvents = () => {
    router.push("/eventos");
  };

  return (
    <div className="text-center space-y-6 py-12">
      <motion.div
        className="flex justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          duration: 0.6,
          delay: 0.2,
          type: "spring",
          stiffness: 200,
          damping: 20,
        }}
      >
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1,
            delay: 0.8,
            repeat: 1,
          }}
        >
          <CheckCircle className="w-20 h-20 text-black" />
        </motion.div>
      </motion.div>

      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <motion.h2
          className="text-2xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          ¡Evento creado exitosamente!
        </motion.h2>
        <motion.p
          className="text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          Podrás visualizar este evento junto a tus otros eventos en la lista
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
      >
        <Button onClick={handleGoToEvents} className="px-8 py-3 text-lg">
          Ir a mis eventos
        </Button>
      </motion.div>
    </div>
  );
}
