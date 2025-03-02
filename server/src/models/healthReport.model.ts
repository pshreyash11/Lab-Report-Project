import mongoose, { Schema, Document } from "mongoose";

// Define an interface for the Health Report model
export interface IHealthReport extends Document {
  user_id: mongoose.Schema.Types.ObjectId;
  user_reported_symptoms: string[];
  user_medications: string[];

  health_trends: { test_name: string; observation: string; trend_analysis: string }[];
  dietary_recommendations: { deficiency: string; recommended_foods: string[] }[];
  lifestyle_suggestions: { condition: string; exercise_activity: string }[];
  warnings: { test_name: string; critical_level: string; suggested_action: string }[];
  supplements_medications: { deficiency: string; suggested_supplement: string; caution: string }[];
  comparative_insights: { test_name: string; previous_value: string; current_value: string; change_analysis: string }[];
  additional_insights: string;
}

const HealthReportSchema = new Schema<IHealthReport>({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true }, // Ensures only one report per user
  user_reported_symptoms: { type: [String], default: [] },
  user_medications: { type: [String], default: [] },

  health_trends: [{ test_name: String, observation: String, trend_analysis: String }],
  dietary_recommendations: [{ deficiency: String, recommended_foods: [String] }],
  lifestyle_suggestions: [{ condition: String, exercise_activity: String }],
  warnings: [{ test_name: String, critical_level: String, suggested_action: String }],
  supplements_medications: [{ deficiency: String, suggested_supplement: String, caution: String }],
  comparative_insights: [{ test_name: String, previous_value: String, current_value: String, change_analysis: String }],
  additional_insights: { type: String, default: "" }
});

// Ensuring that only the latest health report is stored per user
HealthReportSchema.index({ user_id: 1 }, { unique: true });

export default mongoose.model<IHealthReport>("HealthReport", HealthReportSchema);
