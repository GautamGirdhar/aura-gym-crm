"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";

interface Props {
  memberId: string;
}

export default function DeleteMemberButton({ memberId }: Props) {
  const handleDelete = async () => {
    const response = await fetch(`/api/members/${memberId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      window.location.href = "/members";
    }
  };

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button
          className="
            bg-red-600
            text-white
            px-5
            py-2
            rounded-lg
          "
        >
          Delete Member
        </button>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay
          className="
            fixed inset-0 bg-black/50
          "
        />

        <AlertDialog.Content
          className="
            fixed
            top-1/2 left-1/2
            -translate-x-1/2
            -translate-y-1/2
            bg-white
            rounded-2xl
            p-8
            w-100
          "
        >
          <AlertDialog.Title className="text-2xl font-bold">
            Delete Member
          </AlertDialog.Title>

          <AlertDialog.Description className="mt-4 text-gray-500">
            Do you really want to permanently delete this member? This action
            cannot be undone.
          </AlertDialog.Description>

          <div className="flex gap-4 mt-8">
            <AlertDialog.Cancel asChild>
              <button className="flex-1 border py-3 rounded-lg">Cancel</button>
            </AlertDialog.Cancel>

            <AlertDialog.Action asChild>
              <button
                onClick={handleDelete}
                className="
                  flex-1
                  bg-red-600
                  text-white
                  py-3
                  rounded-lg
                "
              >
                Delete Permanently
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
