import { format12HourTime } from "./Schedule";

describe("format12HourTime", () => {
	test("should format time correctly", () => {
		expect(format12HourTime("0:00")).toBe("12:00 AM");
		expect(format12HourTime("1:00")).toBe("1:00 AM");
		expect(format12HourTime("12:00")).toBe("12:00 PM");
		expect(format12HourTime("13:00")).toBe("1:00 PM");
		expect(format12HourTime("23:30")).toBe("11:30 PM");
	});
});
