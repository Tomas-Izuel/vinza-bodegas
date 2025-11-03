"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useStepForm } from "@/hooks/useStepForm";
import { EventoStepFormData } from "@/api/eventos/evento.type";
import { crearEvento } from "@/api/eventos/eventos.service";
import { EventoDetallesStep } from "./EventoDetallesStep";
import { EventoFechaStep } from "./EventoFechaStep";
import { EventoMultimediaStep } from "./EventoMultimediaStep";
import { EventoSuccessStep } from "./EventoSuccessStep";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Routes } from "@/lib/routes";

// Variantes de animación para los pasos
const stepVariants = {
  hidden: {
    opacity: 0,
    x: 50,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    x: -50,
    scale: 0.95,
  },
};

// Variantes para el indicador de pasos
const indicatorVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
  },
};

interface CrearEventoStepFormProps {
  categorias: Array<{ id: number; nombre: string }>;
  sucursales: Array<{ id: number; nombre: string }>;
}

export function CrearEventoStepForm({
  categorias,
  sucursales,
}: CrearEventoStepFormProps) {
  const router = useRouter();
  const stepForm = useStepForm<EventoStepFormData>({
    totalSteps: 3,
    onSubmit: async (data) => {
      try {
        console.log("data", data);
        await crearEvento(data);
        toast.success("Evento creado exitosamente");
        router.push(Routes.EVENTOS);
      } catch (error) {
        toast.error("Error al crear el evento", {
          description:
            error instanceof Error ? error.message : "Error al crear el evento",
        });
      }
    },
  });

  const handleStepSubmit = (data: Partial<EventoStepFormData>) => {
    stepForm.setStepData(data);
    stepForm.nextStep();
  };

  const handleFinalSubmit = async (data: Partial<EventoStepFormData>) => {
    await stepForm.setDataAndSubmit(data);
  };

  const handleCancel = () => {
    // Aquí podrías redirigir o mostrar un modal de confirmación
    if (
      confirm(
        "¿Estás seguro de que quieres cancelar? Se perderán todos los datos.",
      )
    ) {
      stepForm.reset();
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, title: "Detalles del evento" },
      { number: 2, title: "Fecha del evento" },
      { number: 3, title: "Multimedia" },
    ];

    return (
      <div className="flex items-center justify-center space-x-4 mb-8 bg-white py-4 border">
        {steps.map((step, index) => {
          const isCompleted = stepForm.currentStep > step.number;
          const isCurrent = stepForm.currentStep === step.number;

          return (
            <div key={step.number} className="flex items-center">
              <div className="flex items-center space-x-3">
                <motion.div
                  variants={indicatorVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2
                    ${
                      isCompleted
                        ? "bg-primary border-primary text-white"
                        : isCurrent
                          ? "bg-primary border-primary text-white"
                          : "bg-white border-gray-300 text-gray-400"
                    }
                  `}
                >
                  <AnimatePresence mode="wait">
                    {isCompleted ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Check className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <motion.span
                        key="number"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        0{step.number}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
                <motion.span
                  initial={{ opacity: 0.5 }}
                  animate={{
                    opacity: isCompleted || isCurrent ? 1 : 0.5,
                    color: isCompleted || isCurrent ? "#111827" : "#6B7280",
                  }}
                  transition={{ duration: 0.3 }}
                  className="text-sm font-medium"
                >
                  {step.title}
                </motion.span>
              </div>

              {index < steps.length - 1 && (
                <motion.div
                  className="w-12 h-px bg-gray-300 mx-6"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Si el evento se creó exitosamente, mostrar el paso de éxito
  if (stepForm.isSubmitting === false && stepForm.currentStep > 3) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <EventoSuccessStep />
      </motion.div>
    );
  }

  return (
    <section>
      {/* Indicador de pasos */}
      {renderStepIndicator()}

      {/* Contenido del paso actual */}
      <div className="bg-white border border-gray-200 rounded-lg p-8 overflow-hidden">
        <AnimatePresence mode="wait">
          {stepForm.currentStep === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <EventoDetallesStep
                initialData={stepForm.getCurrentData()}
                onNext={handleStepSubmit}
                onCancel={handleCancel}
                categorias={categorias}
                sucursales={sucursales}
              />
            </motion.div>
          )}

          {stepForm.currentStep === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <EventoFechaStep
                initialData={stepForm.getCurrentData()}
                eventData={stepForm.getCurrentData()}
                onNext={handleStepSubmit}
                onBack={() => stepForm.prevStep()}
              />
            </motion.div>
          )}

          {stepForm.currentStep === 3 && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <EventoMultimediaStep
                initialData={stepForm.getCurrentData()}
                onBack={() => stepForm.prevStep()}
                onSubmit={handleFinalSubmit}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
