"use client";

import { useState } from "react";

import Loader from "@/components/ui/loader";

import useAuth from "@/hooks/use-auth";
import ChangePasswordModal from "@/templates/Authentication/Profile/Components/ChangePasswordModal";
import ProfileHeader from "@/templates/Authentication/Profile/Components/ProfileHeader";
import ProfileInfo from "@/templates/Authentication/Profile/Components/ProfileInfo";
import SecuritySettings from "@/templates/Authentication/Profile/Components/SecuritySettings";
import UpdateProfileModal from "@/templates/Authentication/Profile/Components/UpdateProfileModal";

export default function ProfileTemplate() {
	const [isEditingProfile, setIsEditingProfile] = useState(false);
	const [isChangingPassword, setIsChangingPassword] = useState(false);
	const [show2FADialog, setShow2FADialog] = useState(false);

	const { user, isLoading, isAuthenticated } = useAuth();

	const handleEditProfile = (data: any) => {
		console.log("Profile updated:", data);
		setIsEditingProfile(false);
	};

	const handleChangePassword = (data: any) => {
		console.log("Password changed:", data);
		setIsChangingPassword(false);
	};

	const handleToggle2FA = () => {
		setShow2FADialog(!show2FADialog);
	};

	const handleDeleteAccount = () => {
		console.log("Account deletion confirmed");
	};

	if (isLoading || !isAuthenticated || !user) {
		return <Loader text="Loading user profile information..." />;
	}

	return (
		<div className="space-y-6">
			<ProfileHeader user={user} onEdit={() => setIsEditingProfile(true)} />
			<ProfileInfo user={user} />
			<SecuritySettings
				user={user}
				onChangePassword={() => setIsChangingPassword(true)}
				onToggle2FA={handleToggle2FA}
				onDeleteAccount={handleDeleteAccount}
			/>
			<UpdateProfileModal
				open={isEditingProfile}
				onOpenChange={setIsEditingProfile}
				user={user}
				onSubmit={handleEditProfile}
			/>
			<ChangePasswordModal
				open={isChangingPassword}
				onOpenChange={setIsChangingPassword}
				onSubmit={handleChangePassword}
			/>
		</div>
	);
}
