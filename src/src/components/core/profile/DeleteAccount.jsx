/* eslint-disable no-unused-vars */
import { useState } from "react";
import { deleteAccount } from "../../../services/auth";
import Confirmation from "../common/confirmmation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { logout } from "../../../Slices/authslice";
import { persistor } from "../../../store/store";
const DeleteAccount = () => {
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();
  return (
    <div>
      <div className="mt-10 rounded-lg border border-red-900/40 bg-linear-to-r from-[#2a0b17] via-[#3a0f1f] to-[#2a0b17] p-6">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 0H7m3-3h4a1 1 0 011 1v1H9V5a1 1 0 011-1z"
              />
            </svg>
          </div>

          {/* Content */}
          <div>
            <h3 className="text-lg font-semibold text-red-400">
              Delete Account
            </h3>

            <p className="mt-2 text-sm text-red-200/80">
              Would you like to delete account?
            </p>

            <p className="mt-1 text-sm text-red-200/60">
              This account contains Paid Courses. Deleting your account will
              remove all the content associated with it.
            </p>

            <button
              onClick={() => {
                setConfirmationModal({
                  text1: "Do You Want to Delete Account",
                  text2: "Your Account Will Shutdown In 2 Working Days",
                  btn1text: "Confirm",
                  btn2text: "Cancel",
                  btn1handler: async () => {
                    if (isProcessing) return;

                    setIsProcessing(true);
                    const toastId = toast.loading("Deleting your account...");
                    try {
                      await deleteAccount();
                      dispatch(logout());
                      persistor.purge();

                      toast.success("Account deletion request submitted", {
                        id: toastId,
                      });
                      setTimeout(() => {
                        window.location.href = "/account-deactivated";
                      }, 1500);
                    } catch (e) {
                      setIsProcessing(false);
                    }
                  },

                  btn2handler: () => {
                    if (isProcessing) return;
                    setConfirmationModal(null);
                  },

                  flagAccountDelete: true,
                });
              }}
              className="mt-3 text-sm font-medium text-red-400 underline hover:text-red-300"
            >
              I want to delete my account.
            </button>
            {confirmationModal && (
              <Confirmation
                modalData={confirmationModal}
                loading={isProcessing}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;
