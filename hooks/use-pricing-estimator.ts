import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import type { ToolInvocation } from "ai"
import { useForm } from "react-hook-form"

import { FEATURE_OPTIONS, PRICING } from "@/config/consts"
import {
  pricingEstimatorSchema,
  type PricingEstimatorValues,
} from "@/config/schemas"
import { createToolResult, stringifyToolResult } from "@/lib/tool-helpers"
import { getGlobalChatContext } from "@/hooks/use-chat-with-tools"

interface EstimatorState {
  isCalculating: boolean
  estimate: number | null
  askingForProject: boolean
}

export function usePricingEstimator(toolCall: ToolInvocation) {
  const [state, setState] = useState<EstimatorState>({
    isCalculating: false,
    estimate: null,
    askingForProject: true,
  })

  const form = useForm<PricingEstimatorValues>({
    resolver: zodResolver(pricingEstimatorSchema),
    defaultValues: {
      complexity: 50,
      timeframe: 50,
      selectedFeatures: [],
    },
  })

  // Get the global chat context
  const { addToolResult } = getGlobalChatContext()

  // Helper function to update a single property in state
  const updateState = <K extends keyof EstimatorState>(
    key: K,
    value: EstimatorState[K]
  ) => {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  // Toggle a feature selection
  const toggleFeature = (featureId: string) => {
    const currentFeatures = form.getValues("selectedFeatures") || []
    const newFeatures = currentFeatures.includes(featureId)
      ? currentFeatures.filter((id) => id !== featureId)
      : [...currentFeatures, featureId]

    form.setValue("selectedFeatures", newFeatures, { shouldValidate: true })
  }

  // Calculate the price estimate
  const calculateEstimate = async (values: PricingEstimatorValues) => {
    updateState("isCalculating", true)

    try {
      // Base price by project type
      const basePrice = PRICING.BASE_PRICE

      // Calculate feature costs
      const featureCost = values.selectedFeatures.reduce((sum, featureId) => {
        const feature = FEATURE_OPTIONS.find((f) => f.id === featureId)
        return sum + (feature?.value || 0)
      }, 0)

      // Complexity multiplier
      const complexityMultiplier =
        PRICING.MULTIPLIERS.complexity.min +
        (values.complexity / 100) * PRICING.MULTIPLIERS.complexity.range

      // Timeframe multiplier
      const timeframeMultiplier =
        PRICING.MULTIPLIERS.timeframe.min +
        ((100 - values.timeframe) / 100) * PRICING.MULTIPLIERS.timeframe.range

      const calculatedEstimate = Math.round(
        (basePrice + featureCost) * complexityMultiplier * timeframeMultiplier
      )

      // Simulate API call
      await new Promise((resolve) =>
        setTimeout(resolve, PRICING.CALCULATION_DELAY)
      )

      updateState("estimate", calculatedEstimate)

      // Create and submit tool result
      const result = createToolResult(true, {
        estimate: calculatedEstimate,
        currency: PRICING.CURRENCY,
        complexity: values.complexity,
        timeframe: values.timeframe,
        features: values.selectedFeatures,
      })

      addToolResult({
        toolCallId: toolCall.toolCallId,
        result: stringifyToolResult(result),
      })
    } catch (error) {
      console.error("Error calculating estimate:", error)

      addToolResult({
        toolCallId: toolCall.toolCallId,
        result: stringifyToolResult(
          createToolResult(false, {
            error: "Failed to calculate estimate",
          })
        ),
      })
    } finally {
      updateState("isCalculating", false)
    }
  }

  return {
    form,
    state,
    updateState,
    featureOptions: FEATURE_OPTIONS,
    toggleFeature,
    calculateEstimate,
  }
}
