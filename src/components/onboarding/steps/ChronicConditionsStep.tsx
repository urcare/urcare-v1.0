import React from "react";

interface ChronicConditionsStepProps {
  selected: string[];
  onToggle: (condition: string) => void;
  error?: string;
}

const chronicConditions = [
  // Top Lifestyle Disorders (Clear & Relatable Wording)
  {
    id: "type2_diabetes_prediabetes",
    title: "Type 2 Diabetes / Prediabetes",
    description: "Sugar spikes, on or at risk of meds",
    category: "Top Lifestyle Disorders",
  },
  {
    id: "high_blood_pressure_hypertension",
    title: "High Blood Pressure (Hypertension)",
    description: "Elevated BP, on tablets, or family history",
    category: "Top Lifestyle Disorders",
  },
  {
    id: "high_cholesterol_triglycerides",
    title: "High Cholesterol / Triglycerides",
    description: "Heart risk, statins, or family history",
    category: "Top Lifestyle Disorders",
  },
  {
    id: "obesity_overweight",
    title: "Obesity / Overweight",
    description: "Struggling with weight, belly fat, BMI > 25",
    category: "Top Lifestyle Disorders",
  },
  {
    id: "pcos_hormonal_imbalance",
    title: "PCOS / Hormonal Imbalance (for women)",
    description: "Irregular cycles, fertility issues, weight gain",
    category: "Top Lifestyle Disorders",
  },
  {
    id: "fatty_liver_nafld",
    title: "Fatty Liver (NAFLD)",
    description: "Abnormal liver tests, belly weight, or doctor's diagnosis",
    category: "Top Lifestyle Disorders",
  },
  {
    id: "chronic_stress_anxiety",
    title: "Stress / Anxiety",
    description: "Burnout, overthinking, sleep struggles",
    category: "Top Lifestyle Disorders",
  },
  {
    id: "sleep_disorders_poor_sleep",
    title: "Sleep Disorders / Poor Sleep",
    description: "Insomnia, restless nights, or low recovery",
    category: "Top Lifestyle Disorders",
  },
  {
    id: "digestive_disorders_ibs_gut_issues",
    title: "Digestive Disorders (IBS / Gut Issues)",
    description: "Bloating, acidity, constipation, irregular digestion",
    category: "Top Lifestyle Disorders",
  },

  // Additional Lifestyle Disorders
  {
    id: "heart_disease_cardiac_risk",
    title: "Heart Disease (Cardiac Risk)",
    description: "Cardiovascular issues, family history of heart problems",
    category: "Additional Disorders",
  },
  {
    id: "thyroid_disorders",
    title: "Thyroid Disorders (Hypo / Hyper)",
    description: "Underactive or overactive thyroid, metabolism issues",
    category: "Additional Disorders",
  },
  {
    id: "chronic_pain",
    title: "Pain (Back Pain, Joint Pain, Arthritis)",
    description: "Persistent pain affecting daily activities",
    category: "Additional Disorders",
  },
  {
    id: "osteoarthritis_joint_problems",
    title: "Osteoarthritis / Early Joint Problems",
    description: "Joint stiffness, mobility issues, early arthritis",
    category: "Additional Disorders",
  },
  {
    id: "metabolic_syndrome",
    title: "Metabolic Syndrome (multiple risk factors)",
    description: "Combination of diabetes, high BP, obesity, high cholesterol",
    category: "Additional Disorders",
  },
  {
    id: "low_energy_chronic_fatigue",
    title: "Low Energy / Fatigue",
    description: "Persistent tiredness, low stamina, energy crashes",
    category: "Additional Disorders",
  },
  {
    id: "vitamin_deficiencies",
    title: "Vitamin Deficiencies (D, B12, Calcium)",
    description: "Low vitamin levels affecting health and energy",
    category: "Additional Disorders",
  },
  {
    id: "migraine_frequent_headaches",
    title: "Migraine / Frequent Headaches",
    description: "Recurring headaches, migraine episodes",
    category: "Additional Disorders",
  },
  {
    id: "low_immunity",
    title: "Low Immunity (frequent infections)",
    description: "Frequent colds, infections, slow recovery",
    category: "Additional Disorders",
  },
  {
    id: "gout_high_uric_acid",
    title: "Gout / High Uric Acid",
    description: "Joint inflammation, uric acid buildup",
    category: "Additional Disorders",
  },
  {
    id: "menopause_related_issues",
    title: "Menopause-related Lifestyle Issues (Women)",
    description: "Hormonal changes, weight gain, mood swings",
    category: "Additional Disorders",
  },
  {
    id: "none_of_the_above",
    title: "None of the above",
    description: "I don't have any of these conditions",
    category: "None",
  },
];

export const ChronicConditionsStep: React.FC<ChronicConditionsStepProps> = ({
  selected,
  onToggle,
  error,
}) => {
  // Group conditions by category
  const groupedConditions = chronicConditions.reduce((acc, condition) => {
    if (!acc[condition.category]) {
      acc[condition.category] = [];
    }
    acc[condition.category].push(condition);
    return acc;
  }, {} as Record<string, typeof chronicConditions>);

  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="text-center space-y-2 py-2">
        <p className="text-gray-600 text-xs">
          Choose all that apply — your Health Twin will adapt your plan.
        </p>
      </div>

      {/* Plain list of all conditions (no category headers) */}
      <div className="grid grid-cols-1 gap-3">
        {chronicConditions.map((condition) => (
          <button
            key={condition.id}
            onClick={() => onToggle(condition.id)}
            className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
              selected.includes(condition.id)
                ? "border-gray-900 bg-gray-900 text-white shadow-lg scale-105"
                : "border-gray-200 bg-white text-gray-700 hover:border-primary/30 hover:bg-primary/5"
            }`}
          >
            <div className="space-y-1">
              <span className="font-medium text-sm block">
                {condition.title}
              </span>
              <span className="text-xs opacity-75">
                {condition.description}
              </span>
            </div>
          </button>
        ))}
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center mt-2">{error}</div>
      )}
    </div>
  );
};
