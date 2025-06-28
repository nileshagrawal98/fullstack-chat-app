import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Camera, Mail, User } from 'lucide-react';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

const CONFIRM_DELETE = "delete my account";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile, deleteProfileCleanup } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);
  const [confirmDeletionInput, setConfirmDeletionInput] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  console.log('confirmDeletionInput: ', confirmDeletionInput);

  const handleImageUpload = async (e) => {
    if (isUpdatingProfile) return;

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateProfile(base64Image);
    }
  };

  const handleAccountDeletion = async (e) => {
    e.preventDefault();

    setIsDeletingAccount(true);
    try {
      if (confirmDeletionInput === CONFIRM_DELETE) {
        await axiosInstance.post("/auth/delete-profile");
        await deleteProfileCleanup();
      }
    } catch (error) {
      toast.error("Failed to delete account: ", error.message);
    }
    setIsDeletingAccount(false);
  }

  return (
    <>
      <div className="h-screen pt-20">
        <div className="max-w-2xl mx-auto p-4 py-8">
          <div className="bg-base-300 rounded-xl p-6 space-y-8">
            <div className="text-center">
              <h1 className="text-2xl font-semibold ">Profile</h1>
              {/* <p className="mt-2">Your details</p> */}
            </div>

            {/* avatar upload section */}

            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={selectedImage || authUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4 "
                />
                <label
                  htmlFor="avatar-upload"
                  className={`
                    absolute bottom-0 right-0 
                    bg-base-content hover:scale-105
                    p-2 rounded-full cursor-pointer 
                    transition-all duration-200
                    ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                  `}
                >
                  <Camera className="w-5 h-5 text-base-200" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <p className="text-sm text-zinc-400">
                {isUpdatingProfile ? "Uploading..." : "Want a new look? Click the camera!"}
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border cursor-not-allowed">{authUser?.fullName}</p>
              </div>

              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border cursor-not-allowed">{authUser?.email}</p>
              </div>
            </div>

            <div className="mt-6 bg-base-300 rounded-xl px-6 pt-6">
              <h2 className="text-lg font-medium  mb-4">Account Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                  <span>Member Since</span>
                  <span>{authUser?.createdAt?.split("T")[0]}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Account Status</span>
                  <span className="text-green-500">Active</span>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-base-300 rounded-xl px-6">
              <h2 className="text-lg font-medium text-red-400 mb-1">Delete account</h2>
              <div className="py-2">
                <span>Once you delete your account, there is no going back. Please be certain.</span>
                <button className='mt-4 btn btn-error btn-sm' onClick={() => document.getElementById('deletion_modal').showModal()} >Delete this account</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deletion Popup */}
      <dialog id="deletion_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Confirm Deletion</h3>
          <p className="py-4">Please type "{CONFIRM_DELETE}" (without quotes) to verify.</p>
          <form method="dialog" className="modal-backdrop">
            <input
              type="text"
              className="w-full input input-bordered rounded-lg input-sm sm:input-md text-white"
              value={confirmDeletionInput}
              onChange={(e) => setConfirmDeletionInput(e.target.value)} />
            <button className='btn btn-sm btn-error mt-4' onClick={handleAccountDeletion} disabled={isDeletingAccount || (confirmDeletionInput !== CONFIRM_DELETE)}>Delete</button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}

export default ProfilePage