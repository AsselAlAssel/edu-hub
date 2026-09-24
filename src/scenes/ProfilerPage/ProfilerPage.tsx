"use client";
import { PageHeader, PageShell } from "@/components/ui/PageShell";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import WebOutlinedIcon from "@mui/icons-material/WebOutlined";
import { Box, Tab, Tabs } from "@mui/material";
import type { LandingPage } from "@prisma/client";
import { useState } from "react";
import LandingControls from "./components/LandingControls";
import UserInformation from "./components/UserInformation";
import UsersPanel from "./components/UsersPanel";

export default function ProfilerPage({
	landingData,
}: {
	landingData: LandingPage | null;
}) {
	const [section, setSection] = useState<"landing" | "users">("landing");

	return (
		<PageShell>
			<PageHeader
				eyebrow='الإدارة'
				title='لوحة التحكم'
				description='حدّث محتوى الصفحة الرئيسية وأدِر حسابات المستخدمين.'
			/>
			<Box
				sx={{
					display: "grid",
					gap: { xs: 3, md: 4 },
					gridTemplateColumns: { xs: "1fr", md: "280px minmax(0, 1fr)" },
					alignItems: "start",
				}}
			>
				<Box sx={{ position: { md: "sticky" }, top: { md: 96 } }}>
					<UserInformation />
				</Box>
				<Box
					sx={{
						minWidth: 0,
						// Panels rise in when shown (display:none → block restarts the animation).
						"& [role='tabpanel']:not([hidden])": {
							animation: "qaPanelIn 380ms cubic-bezier(0.22, 1, 0.36, 1) both",
						},
						"@keyframes qaPanelIn": {
							from: { opacity: 0, transform: "translateY(10px)" },
							to: { opacity: 1, transform: "none" },
						},
					}}
				>
					<Tabs
						value={section}
						onChange={(_, value) => setSection(value)}
						variant='scrollable'
						allowScrollButtonsMobile
						aria-label='أقسام لوحة التحكم'
						sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
					>
						<Tab
							icon={<WebOutlinedIcon />}
							iconPosition='start'
							label='الصفحة الرئيسية'
							value='landing'
							id='admin-tab-landing'
							aria-controls='admin-panel-landing'
						/>
						<Tab
							icon={<GroupOutlinedIcon />}
							iconPosition='start'
							label='المستخدمون'
							value='users'
							id='admin-tab-users'
							aria-controls='admin-panel-users'
						/>
					</Tabs>
					<Box
						role='tabpanel'
						id='admin-panel-landing'
						aria-labelledby='admin-tab-landing'
						hidden={section !== "landing"}
					>
						<LandingControls landingData={landingData} />
					</Box>
					<Box
						role='tabpanel'
						id='admin-panel-users'
						aria-labelledby='admin-tab-users'
						hidden={section !== "users"}
					>
						{section === "users" ? <UsersPanel /> : null}
					</Box>
				</Box>
			</Box>
		</PageShell>
	);
}
