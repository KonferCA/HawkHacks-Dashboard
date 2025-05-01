import { type FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@chakra-ui/react";
import {
	TextInput,
	Select,
	ErrorAlert,
	MultiSelect,
	Steps,
	LoadingAnimation,
	PageWrapper,
} from "@components";
import type {
	ApplicationInputKeys,
	ApplicationData,
} from "@/components/forms/types";
import type { Step } from "@/components/types";
import { defaultApplication } from "@/components/forms/defaults";
import { uploadGeneralResume } from "@/services/firebase/files";
import { submitApplication } from "@/services/firebase/application";
import { TextArea } from "@/components/TextArea/TextArea";
import {
	referralSources,
	ages,
	genders,
	allergies,
	programmingLanguages,
	pronouns,
	diets,
	sexualityList,
	races,
	interests,
	hackathonExps,
	countryNames,
	schools,
	levelsOfStudy,
	cityNames,
	majorsList,
} from "@/data";
import { logEvent } from "firebase/analytics";
import { analytics } from "@/services/firebase";
import { Modal } from "@/components/Modal";
import { z } from "zod";
import { useAuth } from "@/providers";
import { useApplications } from "@/hooks/use-applications";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { paths } from "@/providers/RoutesProvider/data";
import { toaster } from "@/components/ui/toaster";
import { FileBrowser } from "@/components/FileBrowse/FileBrowse";

// Form validations
const profileFormValidation = z.object({
	firstName: z
		.string()
		.min(1, "First name must contain at least 1 character(s)"),
	lastName: z.string().min(1, "Last name must contain at least 1 character(s)"),
	countryOfResidence: z
		.string()
		.min(1, "Please select the country you currently reside in."),
	city: z.string().min(1, "Please select the city you currently live in."),
	phone: z.string().nonempty("Phone number is empty"),
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

const hackerAppFormValidation = z.object({
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

const hackerSpecificValidation = z.object({
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

const finalChecksValidation = z.object({
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

const stepValidations = [
	profileFormValidation,
	z.object({
		participatingAs: z.string().refine((val) => ["Hacker"].includes(val)),
	}),
	hackerAppFormValidation,
	finalChecksValidation,
];

function getLogEventName(component: string) {
	if (import.meta.env.PROD) return `app_interaction_${component}`;
	return "dev_app_interaction"; // not logging the different components becuase it will fill the reports with spam
}

// function isValidUrl(url: string) {
// 	return z.string().url().safeParse(url).success;
// }

export const ApplyPage = () => {
	// TODO: save steps in firebase to save progress
	const [steps, setSteps] = useState<Step[]>([
		{ position: 0, name: "Basic profile", status: "current" },
		{ position: 1, name: "Hacker questions", status: "upcoming" },
		{ position: 2, name: "Application", status: "upcoming" },
		{ position: 3, name: "Final checks", status: "upcoming" },
	]);
	const [activeStep, setActiveStep] = useState(0); // index
	const [errors, setErrors] = useState<string[]>([]);
	const { currentUser } = useAuth();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [generalResumeFile, setGeneralResumeFile] = useState<File | null>(null);
	const [submitted, setSubmitted] = useState(false);
	const [openConfirmPopUp, setOpenConfirmPopUp] = useState(false);
	const {
		applications,
		isLoading: loadingApplications,
		refreshApplications,
	} = useApplications();
	const userApp = applications[0] || null;
	const progressTrackRef = useRef(new Set<string>());
	const [sp] = useSearchParams();
	const navigate = useNavigate();

	if (!currentUser) return <Navigate to={paths.login} />;

	// we start with the default user profile
	const [application, setApplication] = useState<ApplicationData>(() => {
		const app: ApplicationData = {
			...defaultApplication,
			participatingAs: "Hacker", // Default to Hacker only
		};
		return app;
	});

	const trackProgress = (component: string) => {
		try {
			const event = getLogEventName(component);
			if (!progressTrackRef.current.has(event)) {
				logEvent(analytics, event);
				progressTrackRef.current.add(event);
			}
		} catch (e) {
			console.error(e);
		}
	};

	const handleChange = (
		name: ApplicationInputKeys,
		data: string | string[] | boolean,
	) => {
		// @ts-ignore the "name" key is controlled by the keyof typing, restricts having undefined keys, so disable is ok
		application[name] = data;
		setApplication({ ...application });
		trackProgress(name);
	};

	const clearErrors = () => setErrors([]);

	const validate = () => {
		clearErrors();

		// // Check URL validation status
		// const urlFields: (keyof ApplicationData)[] = [
		// 	"linkedinUrl",
		// 	"githubUrl",
		// 	"personalWebsiteUrl",
		// ] as const;
		// for (const field of urlFields) {
		// 	const fieldValue = application[field as keyof ApplicationData] as string;
		// 	if (fieldValue && !isValidUrl(fieldValue)) {
		// 		setErrors((prev) => [...prev, `${field} has an invalid URL.`]);
		// 		return false;
		// 	}
		// }

		// validate step form
		const validateFn = stepValidations[activeStep];

		const results = validateFn.safeParse(application);

		if (!results.success) {
			setErrors(results.error.issues.map((i) => i.message));
			return false;
		}

		if (activeStep === 1) {
			const validateFn = hackerSpecificValidation;
			const results = validateFn.safeParse(application);
			if (!results.success) {
				setErrors(results.error.issues.map((i) => i.message));
				return false;
			}
		}

		return true;
	};

	const nextStep = () => {
		if (activeStep < steps.length) {
			trackProgress(`step_${activeStep}`);
			setSteps((s) => {
				s[activeStep].status = "complete";
				s[activeStep + 1].status = "current";
				return s;
			});
			setActiveStep((s) => s + 1);
		}
	};

	const prevStep = () => {
		if (activeStep > 0) {
			setActiveStep((s) => s - 1);
		}
	};

	const jumpTo = (step: number) => {
		if (step > -1 && step < steps.length) {
			if (step <= activeStep) {
				setActiveStep(step);
			} else {
				if (!validate()) return;
				setActiveStep(step);
			}
		}
	};

	const submitApp = async (e?: FormEvent) => {
		if (e) {
			e.preventDefault();
		}

		clearErrors();
		if (!validate()) return;

		if (activeStep !== steps.length - 1) {
			nextStep();
			return;
		}

		const allRequiredChecked =
			// don't have the CoC for HH yet so we don't have to make it required for now
			// application.agreedToHawkHacksCoC &&
			application.agreedToWLUCoC &&
			application.agreedToMLHCoC &&
			application.agreedToMLHToCAndPrivacyPolicy;

		if (!allRequiredChecked) {
			setErrors(["Please read and check all the required boxes to proceed."]);
			return;
		}

		if (userApp && !openConfirmPopUp) {
			// show pop up to confirm resubmission
			setOpenConfirmPopUp(true);
			return;
		}

		setIsSubmitting(true);

		try {
			if (generalResumeFile) {
				application.generalResumeRef = await uploadGeneralResume(
					generalResumeFile,
					currentUser.uid,
				);
			}
		} catch (e) {
			console.error(e);
			toaster.error({
				title: "Error uploading sponsor resume",
				description: "Please try again later.",
			});
			setIsSubmitting(false);
			return;
		}

		try {
			trackProgress("submit");
			application.email = currentUser.email as string;
			await submitApplication(application, currentUser.uid);
			toaster.success({
				title: "Application Submitted!",
				description:
					"Thank you for applying! You'll hear from us via email within one week after applications close on May 3rd.",
			});
			await refreshApplications();
		} catch (e) {
			toaster.error({
				title: "Error Submitting Application",
				description: "Please retry later.",
			});
			console.error(e);
		} finally {
			setSubmitted(true);
			setIsSubmitting(false);
		}
	};

	useEffect(() => {
		if (!loadingApplications && !userApp) {
			trackProgress("open");
		}
	}, [userApp, loadingApplications]);

	useEffect(() => {
		if (userApp && !sp.get("restart")) {
			setApplication({
				...userApp,
			});
		}
	}, [userApp, sp]);

	if (loadingApplications)
		return (
			<PageWrapper>
				<LoadingAnimation />
			</PageWrapper>
		);

	if (submitted) return <Navigate to={paths.submitted} />;

	return (
		<PageWrapper>
			<div>
				<nav aria-label="Application progress">
					<Steps steps={steps} onClick={jumpTo} />
				</nav>
				{errors.length > 0 ? (
					<div className="my-8">
						<ErrorAlert errors={errors} />
					</div>
				) : null}
				<h3 className="text-center my-8">
					All fields with an <span className="font-bold">asterisk</span> are{" "}
					<span className="font-bold">required</span>.
				</h3>
				<form onSubmit={submitApp} className="mt-12">
					{/* basic profile */}
					<div
						className={`mx-auto lg:grid max-w-4xl space-y-8 lg:gap-x-6 lg:gap-y-8 lg:space-y-0 lg:grid-cols-6${
							activeStep !== 0 ? " hidden lg:hidden" : ""
						}`}
					>
						<div className="sm:col-span-3">
							<TextInput
								label="What is your first name?"
								type="text"
								id="firstName"
								autoComplete="given-name"
								placeholder="Steven"
								value={application.firstName}
								onChange={(e) => handleChange("firstName", e.target.value)}
								required
							/>
						</div>

						<div className="sm:col-span-3">
							<TextInput
								label="What is your last name?"
								type="text"
								id="lastName"
								autoComplete="family-name"
								placeholder="Wu"
								value={application.lastName}
								onChange={(e) => handleChange("lastName", e.target.value)}
								required
							/>
						</div>

						<div className="sm:col-span-2">
							<Select
								label="How old are you?"
								options={ages}
								initialValue={application.age ?? ""}
								onChange={(opt) => handleChange("age", opt)}
								required
							/>
						</div>
						<div className="sm:col-span-4">
							<TextInput
								label="What is your Discord username?"
								id="discord"
								placeholder="@username or username#1234"
								value={application.discord}
								onChange={(e) => handleChange("discord", e.target.value)}
								description="Discord will be our primary form of communication."
								required
							/>
						</div>

						<div className="sm:col-span-3">
							<Select
								label="Which country do you currently reside in?"
								options={countryNames}
								initialValue={application.countryOfResidence ?? ""}
								onChange={(opt) => handleChange("countryOfResidence", opt)}
								required
							/>
						</div>

						<div className="sm:col-span-3">
							<Select
								label="Which city do you live in?"
								options={cityNames}
								initialValue={application.city ?? ""}
								onChange={(opt) => handleChange("city", opt)}
								allowCustomValue
								required
							/>
						</div>

						<div className="col-span-6">
							<TextInput
								id="phone"
								label="Phone Number"
								onChange={(e) => handleChange("phone", e.target.value)}
								placeholder="+1 123-444-555"
								required
							/>
						</div>

						<div className="sm:col-span-3">
							<Select
								label="Which school are you currently attending?"
								options={schools}
								initialValue={application.school ?? ""}
								onChange={(opt) => handleChange("school", opt)}
								allowCustomValue
								required
							/>
							<p className="mt-2 text-sageGray">
								If you recently graduated, pick the school you graduated from.
							</p>
						</div>
						<div className="sm:col-span-3">
							<Select
								label="What is your current level of study?"
								options={levelsOfStudy}
								initialValue={application.levelOfStudy ?? ""}
								onChange={(opt) => handleChange("levelOfStudy", opt)}
								required
							/>
						</div>

						<div className="sm:col-span-full">
							<MultiSelect
								label="What is your major/field of study?"
								options={majorsList}
								onChange={(opts) => handleChange("major", opts)}
								initialValues={
									application.major.length ? application.major : []
								}
								allowCustomValue
								required
							/>
						</div>

						{/* end of basic profile */}

						{/* hacker specific questions */}
						<div
							className={`mx-auto sm:grid max-w-2xl space-y-8 sm:gap-x-6 sm:gap-y-8 sm:space-y-0 sm:grid-cols-6${
								activeStep !== 1 ? " hidden sm:hidden" : ""
							}`}
						>
							<div className="sm:col-span-full space-y-4">
								<input type="hidden" name="participatingAs" value="Hacker" />
							</div>
							<div className="sm:col-span-full">
								<TextArea
									id="hacker-specific-q1"
									label="Why do you want to participate at HawkHacks?"
									rows={4}
									required
									onChange={(e) =>
										handleChange("reasonToBeInHawkHacks", e.target.value)
									}
									value={
										application.reasonToBeInHawkHacks
											? application.reasonToBeInHawkHacks
											: ""
									}
								/>
							</div>
							<div className="sm:col-span-full">
								<TextArea
									id="hacker-specific-q2"
									label="In a few sentences, what up-and-coming or revolutionizing technology are you most excited about?"
									rows={4}
									required
									onChange={(e) =>
										handleChange("revolutionizingTechnology", e.target.value)
									}
									value={
										application.revolutionizingTechnology
											? application.revolutionizingTechnology
											: ""
									}
								/>
							</div>
						</div>
						{/* end of hacker specific questions */}

						{/* general questions */}
						<div
							className={`mx-auto sm:grid max-w-2xl space-y-8 sm:gap-x-6 sm:gap-y-8 sm:space-y-0 sm:grid-cols-6${
								activeStep !== 2 ? " hidden sm:hidden" : ""
							}`}
						>
							<div className="sm:col-span-full">
								<Select
									label="What gender do you identify as?"
									options={genders}
									allowCustomValue={true}
									required={true}
									onChange={(opt) => handleChange("gender", opt)}
									initialValue={application.gender || ""}
								/>
							</div>
							<div className="sm:col-span-full">
								<MultiSelect
									label="What are your pronouns?"
									options={pronouns}
									allowCustomValue={true}
									required={true}
									onChange={(opts) => handleChange("pronouns", opts)}
									initialValues={
										application.pronouns.length > 0 ? application.pronouns : []
									}
								/>
							</div>
							<div className="sm:col-span-full">
								<Select
									label="Please select any of the following that resonates with you:"
									options={sexualityList}
									allowCustomValue={true}
									required={true}
									onChange={(opt) => handleChange("sexuality", opt)}
									initialValue={application.sexuality || ""}
								/>
							</div>
							<div className="sm:col-span-full">
								<Select
									label="Which of the following best describes your racial or ethnic background?"
									options={races}
									allowCustomValue={false}
									required={true}
									onChange={(opt) => handleChange("race", opt)}
									initialValue={application.race || ""}
								/>
							</div>
							<div className="sm:col-span-full">
								<MultiSelect
									label="Do you have any dietary restrictions?"
									options={diets}
									allowCustomValue={true}
									required={true}
									onChange={(opts) => handleChange("diets", opts)}
									initialValues={
										application.diets.length > 0 ? application.diets : []
									}
								/>
							</div>
							<div className="sm:col-span-full">
								<MultiSelect
									label="Are there any allergens you have that we should be aware of?"
									options={allergies}
									allowCustomValue={true}
									required={true}
									onChange={(opts) => handleChange("allergies", opts)}
									initialValues={
										application.allergies.length > 0
											? application.allergies
											: []
									}
								/>
							</div>
							<div className="sm:col-span-full">
								<MultiSelect
									label="Which of the following fields interests you?"
									options={interests}
									allowCustomValue={true}
									required={true}
									onChange={(opts) => handleChange("interests", opts)}
									initialValues={
										application.interests.length > 0
											? application.interests
											: []
									}
								/>
							</div>
							<div className="sm:col-span-full">
								<Select
									label="How many Hackathons have you attended as a participant in the past?"
									options={hackathonExps}
									required={true}
									onChange={(opt) => handleChange("hackathonExperience", opt)}
									initialValue={application.hackathonExperience || ""}
								/>
							</div>
							<div className="sm:col-span-full">
								<MultiSelect
									label="What programming languages are you the most comfortable with or passionate about?"
									options={programmingLanguages}
									allowCustomValue={true}
									onChange={(opts) =>
										handleChange("programmingLanguages", opts)
									}
									initialValues={
										application.programmingLanguages.length > 0
											? application.programmingLanguages
											: []
									}
								/>
							</div>
						</div>
						{/* end of general questions */}

						{/* final steps - agreements */}
						<div
							className={`mx-auto sm:grid max-w-2xl space-y-8 sm:gap-x-6 sm:gap-y-8 sm:space-y-0 sm:grid-cols-6${
								activeStep !== 3 ? " hidden sm:hidden" : ""
							}`}
						>
							<div className="sm:col-span-full">
								<p className="text-gray-900 font-medium">
									If you would like to share your resume with our sponsors,
									please do so now.
								</p>
								<p className="text-sm italic">
									Sponsors will be conducting coffee chats/interviews during the
									hackathon, or might reach out via email for career or job
									opportunities.
								</p>
								<FileBrowser
									inputId="sponsors-resume-file-input"
									allowedFileTypes={[
										"image/*", //png, jpg, jpeg, jfif, pjpeg, pjp, gif, webp, bmp, svg
										"application/pdf", //pdf
										"application/msword", //doc, dot, wiz
										"application/vnd.openxmlformats-officedocument.wordprocessingml.document", //docx
										"application/rtf", //rtf
										"application/oda", //oda
										"text/markdown", //md, markdown, mdown, markdn
										"text/plain", //txt, text, conf, def, list, log, in, ini
										"application/vnd.oasis.opendocument.text", //odt
									]}
									onChange={(file) => {
										file && setGeneralResumeFile(file);
									}}
								/>
							</div>
							<div className="sm:col-span-full">
								<MultiSelect
									label="How did you hear about us?"
									options={referralSources}
									onChange={(opts) => handleChange("referralSources", opts)}
									allowCustomValue
									required
									initialValues={
										application.referralSources.length > 0
											? application.referralSources
											: []
									}
								/>
							</div>
							<div className="sm:col-span-full">
								<TextInput
									label="How would you describe the taste of salt to someone who hasn't tasted it, and can't ever taste it?"
									id="funsie-1"
									onChange={(e) => handleChange("describeSalt", e.target.value)}
									required
									value={application.describeSalt}
								/>
							</div>
							<div className="sm:col-span-full h-12" />
							<div className="sm:col-span-full flex items-start gap-x-2">
								<input
									type="checkbox"
									checked={application.agreedToWLUCoC}
									onChange={(e) =>
										handleChange("agreedToWLUCoC", e.target.checked)
									}
								/>
								<p>
									* I have read and agree to abide by the{" "}
									<a
										href="https://www.wlu.ca/about/governance/assets/resources/12.3-non-academic-student-code-of-conduct.html"
										target="_blank"
										rel="noopener noreferrer"
										className="text-sky-600 underline"
									>
										Wilfrid Laurier University Code of Conduct
									</a>{" "}
									during the hackathon.
								</p>
							</div>
							<div className="sm:col-span-full flex items-start gap-x-2">
								<input
									type="checkbox"
									checked={application.agreedToMLHCoC}
									onChange={(e) =>
										handleChange("agreedToMLHCoC", e.target.checked)
									}
								/>
								<p>
									* I have read and agree to the{" "}
									<a
										className="text-sky-600 underline"
										href="https://static.mlh.io/docs/mlh-code-of-conduct.pdf"
									>
										MLH Code of Conduct
									</a>
									.
								</p>
							</div>
							<div className="sm:col-span-full flex items-start gap-x-2">
								<input
									type="checkbox"
									checked={application.agreedToMLHToCAndPrivacyPolicy}
									onChange={(e) =>
										handleChange(
											"agreedToMLHToCAndPrivacyPolicy",
											e.target.checked,
										)
									}
								/>
								<p>
									* I authorize you to share my application/registration
									information with Major League Hacking for event
									administration, ranking, and MLH administration in line with
									the{" "}
									<a
										className="text-sky-600 underline"
										href="https://mlh.io/privacy"
									>
										MLH Privacy Policy
									</a>
									. I further agree to the terms of both the{" "}
									<a
										className="text-sky-600 underline"
										href="https://github.com/MLH/mlh-policies/blob/main/contest-terms.md)and"
									>
										MLH Contest Terms and Conditions
									</a>
									.
								</p>
							</div>
							<div className="sm:col-span-full flex items-start gap-x-2">
								<input
									type="checkbox"
									checked={application.agreedToReceiveEmailsFromMLH}
									onChange={(e) =>
										handleChange(
											"agreedToReceiveEmailsFromMLH",
											e.target.checked,
										)
									}
								/>
								<p>
									I authorize MLH to send me occasional emails about relevant
									events, career opportunities, and community announcements.
								</p>
							</div>
						</div>
						{/* end of final steps - agreements */}
					</div>
					{/* adding some more white space between the last input field and the buttons */}
					<div className="h-12 md:h-28" />
					{/* just a separator line */}
					<div className="h-0.5 bg-gray-300 my-6" />
					<div>
						{errors.length > 0 ? (
							<p className="text-center text-red-600">
								Oh no! It appears that the are errors in the form.
							</p>
						) : null}
					</div>
					<div className="flex items-center justify-between px-4 py-4 sm:px-8">
						<div className="space-x-4">
							<Button
								disabled={activeStep === 0 || isSubmitting}
								onClick={prevStep}
								type="button"
							>
								Back
							</Button>
							<Button
								className="text-charcoalBlack"
								onClick={() => navigate(paths.home)}
								type="button"
							>
								Cancel
							</Button>
						</div>
						<Button
							type="submit"
							disabled={isSubmitting}
							// I mean.... why not? for funsies
							className={isSubmitting ? "animate-spin" : ""}
						>
							{isSubmitting
								? "Submitting..."
								: activeStep === steps.length - 1
									? userApp
										? "Re-submit"
										: "Submit"
									: "Next"}
						</Button>
					</div>
				</form>
			</div>

			<Modal
				title="Confirm Re-submission"
				subTitle=""
				open={openConfirmPopUp}
				onClose={() => setOpenConfirmPopUp(false)}
			>
				<div className="mt-12 space-y-4 text-center">
					<p>This will replace your previous submission.</p>
					<p>Are you sure you want to continue?</p>
				</div>
				<div className="flex gap-12 justify-center items-center mt-12">
					<Button onClick={() => setOpenConfirmPopUp(false)}>Cancel</Button>
					<Button
						onClick={() => {
							submitApp();
						}}
					>
						Confirm
					</Button>
				</div>
			</Modal>
		</PageWrapper>
	);
};
