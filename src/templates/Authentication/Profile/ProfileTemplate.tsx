"use client";

import { useState } from "react";
import { toast } from "sonner";

import Loader from "@/components/ui/loader";

import useAuth from "@/hooks/use-auth";
import { useUpdateProfileMutation } from "@/templates/Authentication/Login/Redux/AuthenticationAPISlice";
import ProfileHeader from "@/templates/Authentication/Profile/Components/ProfileHeader";
import ProfileInfo from "@/templates/Authentication/Profile/Components/ProfileInfo";
import SecuritySettings from "@/templates/Authentication/Profile/Components/SecuritySettings";
import UpdateProfileModal from "@/templates/Authentication/Profile/Components/UpdateProfileModal";
import { UpdateProfileSchema } from "@/templates/Authentication/Profile/Validation/Profile.schema";

export default function ProfileTemplate() {
	const [isEditingProfile, setIsEditingProfile] = useState(false);

	const { user, isLoading, isAuthenticated } = useAuth();

	const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();

	const handleEditProfile = async (data: UpdateProfileSchema) => {
		await updateProfile(data)
			.unwrap()
			.then(() => {
				// Optionally show a success message
				setIsEditingProfile(false);
				toast.success("Profile updated successfully");
			})
			.catch(() => {
				toast.error("Failed to update profile. Please try again.");
			});
	};

	const handleDeleteAccount = () => {
		console.log("Account deletion confirmed");
	};

	if (isLoading || !isAuthenticated || !user) {
		return <Loader text="Loading user profile information..." />;
	}

	return (
		<div className="space-y-6 p-3 md:p-0">
			<ProfileHeader user={user} onEdit={() => setIsEditingProfile(true)} />
			<ProfileInfo user={user} />
			<SecuritySettings user={user} onDeleteAccount={handleDeleteAccount} />
			<UpdateProfileModal
				open={isEditingProfile}
				onOpenChange={setIsEditingProfile}
				user={user}
				onSubmit={handleEditProfile}
				isUpdating={isUpdatingProfile}
			/>
		</div>
	);
}
