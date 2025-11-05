import { z } from "zod";

/**
 * Validation schemas for form inputs
 * Provides consistent validation across the application
 */

// Team name validation
export const teamNameSchema = z
  .string()
  .trim()
  .min(1, "Team name is required")
  .max(100, "Team name must be less than 100 characters")
  .regex(/^[a-zA-Z0-9\s\-_.]+$/, "Team name can only contain letters, numbers, spaces, hyphens, underscores, and periods");

// Message validation (for requests and other text fields)
export const messageSchema = z
  .string()
  .trim()
  .min(1, "Message is required")
  .max(1000, "Message must be less than 1000 characters");

// Student name validation
export const studentNameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(100, "Name must be less than 100 characters");

// Email validation
export const emailSchema = z
  .string()
  .trim()
  .email("Invalid email address")
  .max(255, "Email must be less than 255 characters");

// Request form validation schema
export const requestFormSchema = z.object({
  type: z.enum(["create_team", "join_team"], {
    required_error: "Request type is required",
  }),
  team_name: z.string().optional(),
  team_id: z.string().uuid().optional(),
  message: messageSchema,
}).refine((data) => {
  // If creating a team, team_name is required
  if (data.type === "create_team") {
    return data.team_name && teamNameSchema.safeParse(data.team_name).success;
  }
  // If joining a team, team_id is required
  if (data.type === "join_team") {
    return !!data.team_id;
  }
  return true;
}, {
  message: "Invalid request data",
  path: ["team_name"],
});

// Team creation validation schema (for RequestDialog)
export const teamCreationSchema = z.object({
  team_name: teamNameSchema,
  message: messageSchema,
  selected_members: z.array(z.string().uuid()).optional(),
  logo_url: z.string().url().optional().or(z.literal("")),
});

// Student form validation
export const studentFormSchema = z.object({
  name: studentNameSchema,
  university_email: emailSchema.refine(
    (email) => email.endsWith("@univ-tiaret.dz"),
    "University email must end with @univ-tiaret.dz"
  ),
  email_personal: emailSchema.optional().or(z.literal("")),
  status: z.enum(["active", "team_assigned", "inactive", "graduated"], {
    required_error: "Status is required",
  }),
});
