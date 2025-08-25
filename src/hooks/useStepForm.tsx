import { useState, useCallback } from "react";

export interface StepFormState<T> {
  stepData: Partial<T>;
  currentStep: number;
  isSubmitting: boolean;
  canGoNext: boolean;
}

export interface StepFormActions<T> {
  nextStep: (data?: Partial<T>) => void;
  prevStep: () => void;
  goToStep: (step: number, data?: Partial<T>) => void;
  setStepData: (data: Partial<T>) => void;
  submit: () => Promise<void>;
  reset: () => void;
  getCurrentData: () => Partial<T>;
  getAllData: () => T;
  setCanGoNext: (canGo: boolean) => void;
}

export interface UseStepFormOptions<T> {
  totalSteps: number;
  onSubmit: (data: T) => Promise<void>;
  onStepChange?: (step: number, data: Partial<T>) => void;
  onStepDataChange?: (step: number, data: Partial<T>) => void;
}

export function useStepForm<T extends Record<string, unknown>>({
  totalSteps,
  onSubmit,
  onStepChange,
  onStepDataChange,
}: UseStepFormOptions<T>): StepFormState<T> & StepFormActions<T> {
  const [state, setState] = useState<StepFormState<T>>({
    stepData: {},
    currentStep: 1,
    isSubmitting: false,
    canGoNext: true,
  });

  const updateState = useCallback((updates: Partial<StepFormState<T>>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const setStepData = useCallback(
    (data: Partial<T>) => {
      setState((prev) => ({
        ...prev,
        stepData: {
          ...prev.stepData,
          ...data,
        },
      }));
      onStepDataChange?.(state.currentStep, data);
    },
    [state.currentStep, onStepDataChange],
  );

  const nextStep = useCallback(
    (data?: Partial<T>) => {
      if (state.currentStep < totalSteps && state.canGoNext) {
        // Guardar datos si se proporcionan
        if (data) {
          setStepData(data);
        }

        const nextStepNumber = state.currentStep + 1;
        updateState({
          currentStep: nextStepNumber,
          canGoNext: true, // Reset para el siguiente paso
        });
        onStepChange?.(nextStepNumber, state.stepData);
      }
    },
    [
      state.currentStep,
      totalSteps,
      state.canGoNext,
      state.stepData,
      setStepData,
      updateState,
      onStepChange,
    ],
  );

  const prevStep = useCallback(() => {
    if (state.currentStep > 1) {
      const prevStepNumber = state.currentStep - 1;
      updateState({
        currentStep: prevStepNumber,
        canGoNext: true, // Permitir navegación hacia atrás
      });
      onStepChange?.(prevStepNumber, state.stepData);
    }
  }, [state.currentStep, updateState, onStepChange, state.stepData]);

  const goToStep = useCallback(
    (step: number, data?: Partial<T>) => {
      if (step >= 1 && step <= totalSteps) {
        // Guardar datos si se proporcionan
        if (data) {
          setStepData(data);
        }

        updateState({
          currentStep: step,
          canGoNext: step < totalSteps, // Solo permitir next si no es el último paso
        });
        onStepChange?.(step, state.stepData);
      }
    },
    [totalSteps, setStepData, updateState, onStepChange, state.stepData],
  );

  const getCurrentData = useCallback(() => {
    return state.stepData;
  }, [state.stepData]);

  const getAllData = useCallback(() => {
    return state.stepData as T;
  }, [state.stepData]);

  const setCanGoNext = useCallback(
    (canGo: boolean) => {
      updateState({ canGoNext: canGo });
    },
    [updateState],
  );

  const submit = useCallback(async () => {
    updateState({ isSubmitting: true });

    try {
      await onSubmit(getAllData());
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      updateState({ isSubmitting: false });
    }
  }, [getAllData, onSubmit, updateState]);

  const reset = useCallback(() => {
    updateState({
      stepData: {},
      currentStep: 1,
      isSubmitting: false,
      canGoNext: true,
    });
  }, [updateState]);

  return {
    ...state,
    nextStep,
    prevStep,
    goToStep,
    setStepData,
    submit,
    reset,
    getCurrentData,
    getAllData,
    setCanGoNext,
  };
}
