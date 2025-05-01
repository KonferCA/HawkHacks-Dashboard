import type { ApplicationData } from "@/components/forms/types";

export const defaultApplication: ApplicationData = {
	firstName: "",
	lastName: "",
	phone: "",
	school: "",
	levelOfStudy: "",
	age: "",
	discord: "",
	countryOfResidence: "",
	city: "",
	major: [],

	gender: "",
	pronouns: [],
	sexuality: "",
	race: "",
	diets: [],
	allergies: [],
	interests: [],
	hackathonExperience: "",
	programmingLanguages: [],
	participatingAs: "Hacker",
	applicantId: "",
	agreedToMLHCoC: false,
	agreedToWLUCoC: false,
	agreedToHawkHacksCoC: false,
	agreedToReceiveEmailsFromMLH: false,
	agreedToMLHToCAndPrivacyPolicy: false,
	referralSources: [],
	describeSalt: "",
	generalResumeRef: "",

	// hacker only
	reasonToBeInHawkHacks: "",
	revolutionizingTechnology: "",

	email: "",

	hackathonYear: "2025", // maybe there is a better way to define this
	rsvp: false,
};
