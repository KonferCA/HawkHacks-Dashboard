import { ages } from "@/data";
import { z } from "zod";
import type { ApplicationData } from "./types";

export const profileFormValidation = z.object({
	firstName: z
		.string()
		.min(1, "First name must contain at least 1 character(s)"),
	lastName: z.string().min(1, "Last name must contain at least 1 character(s)"),
	countryOfResidence: z
		.string()
		.min(1, "Please select the country you currently reside in."),
	city: z.string().min(1, "Please select the city you currently live in."),
	phone: z.string().min(1, "Phone number is empty"),
	school: z.string().min(1, "School is empty"),
	levelOfStudy: z.string().min(1, "Level of study is empty"),
	age: z.string().refine((val) => ages.includes(val)),
	discord: z.string().refine((val) => {
		if (val.length < 1) return false;

		if (val[0] === "@" && val.length === 1) return false;

		return true;
	}, "Invalid Discord username"),
	major: z
		.string()
		.array()
		.min(
			1,
			"Please select a major. If your major is not in the options, please type the major in the input field.",
		),
}) satisfies z.ZodType<
	Pick<
		ApplicationData,
		| "firstName"
		| "lastName"
		| "countryOfResidence"
		| "city"
		| "phone"
		| "school"
		| "levelOfStudy"
		| "age"
		| "discord"
		| "major"
	>
>;

export const hackerAppFormValidation = z.object({
	gender: z.string().transform((val) => val ?? "Prefer not to answer"),
	pronouns: z.string().array().min(1, "Please select your pronouns."),
	sexuality: z.string(),
	race: z.string(),
	diets: z.string().array(),
	allergies: z.string().array(),
	interests: z.string().array().min(1, "Please choose at least one interest."),
	hackathonExperience: z.string(),
	programmingLanguages: z.string().array(),
	participatingAs: z.enum(["Hacker", "Mentor", "Volunteer"]),
	applicantId: z.string(),
	agreedToHawkHacksCoC: z.boolean(),
	agreedToWLUCoC: z.boolean(),
	agreedToMLHCoC: z.boolean(),
	agreedToMLHToCAndPrivacyPolicy: z.boolean(),
	agreedToReceiveEmailsFromMLH: z.boolean(),
}) satisfies z.ZodType<
	Pick<
		ApplicationData,
		| "gender"
		| "pronouns"
		| "sexuality"
		| "race"
		| "diets"
		| "allergies"
		| "interests"
		| "hackathonExperience"
		| "programmingLanguages"
		| "participatingAs"
		| "applicantId"
		| "agreedToHawkHacksCoC"
		| "agreedToWLUCoC"
		| "agreedToMLHCoC"
		| "agreedToMLHToCAndPrivacyPolicy"
		| "agreedToReceiveEmailsFromMLH"
	>
>;

export const finalChecksValidation = z.object({
	referralSources: z
		.string()
		.array()
		.min(
			1,
			"Please tell us how you heard about HawkHacks. If non of the options reflect your situation, please write your answer in the text input.",
		),
	describeSalt: z
		.string()
		.min(1, "Please tell us how you would describe the taste of salt."),
}) satisfies z.ZodType<
	Pick<ApplicationData, "referralSources" | "describeSalt">
>;

export const hackerSpecificValidation = z.object({
	// hacker only
	reasonToBeInHawkHacks: z
		.string()
		.min(1, "Please tell us why you want to  particiapte at HawkHacks."),
	revolutionizingTechnology: z
		.string()
		.min(1, "Please tell us about a new tech you are most excited about."),
}) satisfies z.ZodType<
	Pick<ApplicationData, "reasonToBeInHawkHacks" | "revolutionizingTechnology">
>;

export const mentorSpecificValidation = z.object({
	// mentor only
	mentorResumeRef: z.string(), // we don't have an file upload yet, so this is not populated
	mentorExperience: z
		.string()
		.min(1, "Please let us know your past hackathon experiences."),
	reasonToBeMentor: z
		.string()
		.min(1, "Please tell us why you want to be a mentor at HawkHacks."),
}) satisfies z.ZodType<
	Pick<
		ApplicationData,
		"mentorResumeRef" | "mentorExperience" | "reasonToBeMentor"
	>
>;

export const volunteerSpecificValidation = z.object({
	// volunteer only
	volunteerExperience: z
		.string()
		.min(1, "Please tell us your past volunteering experiences at hackathons."),
	excitedToVolunteerFor: z
		.string()
		.min(
			1,
			"Please tell us what you are most excited to help out with at HawkHacks.",
		),
	reasonToBeVolunteer: z
		.string()
		.min(1, "Please tell us why you want to be a volunteer at HawkHacks."),
}) satisfies z.ZodType<
	Pick<
		ApplicationData,
		"volunteerExperience" | "excitedToVolunteerFor" | "reasonToBeVolunteer"
	>
>;
