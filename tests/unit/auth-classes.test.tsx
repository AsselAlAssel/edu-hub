import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signIn } from "next-auth/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SigninWithPassword, {
	safeCallbackUrl,
} from "@/components/Auth/SigninWithPassword";
import { resourceSummary } from "@/components/Admin/Classes/ClassItem";
import type { ClassWithMeta } from "@/libs/class";
import ClassesPage from "@/scenes/ClassesPage/ClassesPage";
import {
	asAdmin,
	asGuest,
	asUser,
	navigationState,
	oid,
	renderWithTheme,
	routerMock,
} from "../utils";

beforeEach(() => {
	asGuest();
	navigationState.search = "";
	vi.mocked(signIn).mockReset();
	routerMock.push.mockReset();
});

describe("sign-in form", () => {
	it("labels fields, uses correct autocomplete and blocks empty submits", async () => {
		renderWithTheme(<SigninWithPassword />);
		const email = screen.getByLabelText(/البريد الإلكتروني/);
		const password = screen.getByLabelText(/كلمة المرور/, {
			selector: "input",
		});
		expect(email).toHaveAttribute("autocomplete", "email");
		expect(password).toHaveAttribute("autocomplete", "current-password");

		await userEvent.click(screen.getByRole("button", { name: "تسجيل الدخول" }));
		expect(
			await screen.findByText("البريد الإلكتروني مطلوب")
		).toBeInTheDocument();
		expect(screen.getByText("كلمة المرور مطلوبة")).toBeInTheDocument();
		expect(signIn).not.toHaveBeenCalled();
	});

	it("validates the email format", async () => {
		renderWithTheme(<SigninWithPassword />);
		await userEvent.type(
			screen.getByLabelText(/البريد الإلكتروني/),
			"not-an-email"
		);
		await userEvent.type(
			screen.getByLabelText(/كلمة المرور/, { selector: "input" }),
			"secret123"
		);
		await userEvent.click(screen.getByRole("button", { name: "تسجيل الدخول" }));
		expect(
			await screen.findByText("أدخل بريداً إلكترونياً صالحاً")
		).toBeInTheDocument();
	});

	it("toggles password visibility accessibly", async () => {
		renderWithTheme(<SigninWithPassword />);
		const password = screen.getByLabelText(/كلمة المرور/, {
			selector: "input",
		});
		expect(password).toHaveAttribute("type", "password");
		const toggle = screen.getByRole("button", { name: "إظهار كلمة المرور" });
		await userEvent.click(toggle);
		expect(password).toHaveAttribute("type", "text");
		expect(
			screen.getByRole("button", { name: "إخفاء كلمة المرور" })
		).toHaveAttribute("aria-pressed", "true");
	});

	it("shows an Arabic error alert for wrong credentials and a redirect on success", async () => {
		vi.mocked(signIn).mockResolvedValueOnce({
			error: "CredentialsSignin",
			ok: false,
			status: 401,
			url: null,
		});
		renderWithTheme(<SigninWithPassword />);
		await userEvent.type(
			screen.getByLabelText(/البريد الإلكتروني/),
			"Admin@Test.dev"
		);
		await userEvent.type(
			screen.getByLabelText(/كلمة المرور/, { selector: "input" }),
			"wrong-pass"
		);
		await userEvent.click(screen.getByRole("button", { name: "تسجيل الدخول" }));
		expect(await screen.findByRole("alert")).toHaveTextContent(
			"البريد الإلكتروني أو كلمة المرور غير صحيحة"
		);
		expect(signIn).toHaveBeenCalledWith("credentials", {
			email: "admin@test.dev",
			password: "wrong-pass",
			redirect: false,
		});

		vi.mocked(signIn).mockResolvedValueOnce({
			error: null,
			ok: true,
			status: 200,
			url: null,
		} as never);
		await userEvent.click(screen.getByRole("button", { name: "تسجيل الدخول" }));
		await vi.waitFor(() =>
			expect(routerMock.push).toHaveBeenCalledWith("/classes")
		);
	});

	it("only follows same-origin callback URLs", () => {
		expect(safeCallbackUrl("/admin/profile")).toBe("/admin/profile");
		expect(safeCallbackUrl("//evil.com")).toBe("/classes");
		expect(safeCallbackUrl("https://evil.com")).toBe("/classes");
		expect(safeCallbackUrl(null)).toBe("/classes");
	});
});

const makeClass = (
	n: number,
	extra: Partial<ClassWithMeta> = {}
): ClassWithMeta =>
	({
		id: oid(String(n)),
		name: `الصف ${n}`,
		description: "",
		image: null,
		createdAt: new Date(),
		updatedAt: new Date(),
		folders: [{ id: oid(`${n}f`) }],
		_count: { files: 0, videos: 0 },
		...extra,
	}) as unknown as ClassWithMeta;

describe("classes catalog", () => {
	it("lists classes as keyboard-reachable links to their root folder", () => {
		renderWithTheme(<ClassesPage classes={[makeClass(1), makeClass(2)]} />);
		const link = screen.getByRole("link", { name: "الصف 1" });
		expect(link).toHaveAttribute(
			"href",
			`/class/${oid("1")}/folder/${oid("1f")}`
		);
		expect(screen.getAllByRole("listitem")).toHaveLength(2);
	});

	it("shows real resource counts only when present", () => {
		expect(resourceSummary({ videos: 3, files: 1 })).toBe("3 فيديوهات · 1 ملف");
		expect(resourceSummary({ videos: 0, files: 0 })).toBeNull();
		renderWithTheme(
			<ClassesPage
				classes={[makeClass(1, { _count: { files: 2, videos: 1 } } as never)]}
			/>
		);
		expect(screen.getByText("1 فيديو · 2 ملفات")).toBeInTheDocument();
	});

	it("shows an empty state (no admin CTA for students)", () => {
		asUser();
		renderWithTheme(<ClassesPage classes={[]} />);
		expect(screen.getByText("لا توجد صفوف بعد")).toBeInTheDocument();
		expect(screen.queryByRole("button", { name: /إنشاء صف جديد/ })).toBeNull();
	});

	it("gives admins create and per-class actions; regular users see none", async () => {
		asUser();
		const { unmount } = renderWithTheme(
			<ClassesPage classes={[makeClass(1)]} />
		);
		expect(screen.queryByRole("button", { name: /خيارات الصف/ })).toBeNull();
		unmount();

		asAdmin();
		renderWithTheme(<ClassesPage classes={[makeClass(1)]} />);
		expect(
			screen.getByRole("button", { name: /إنشاء صف جديد/ })
		).toBeInTheDocument();
		await userEvent.click(
			screen.getByRole("button", { name: "خيارات الصف: الصف 1" })
		);
		await userEvent.click(
			await screen.findByRole("menuitem", { name: "حذف الصف" })
		);
		expect(
			await screen.findByRole("dialog", { name: "حذف الصف" })
		).toHaveTextContent("«الصف 1»");
	});
});
