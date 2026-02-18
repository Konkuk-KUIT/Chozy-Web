import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BottomSheet from "./BottomSheet";
import SheetRow from "./SheetRow";
import DeleteConfirmModal from "../../../components/DeleteConfirmModal";
import SuccessModal from "../../../components/SuccessModal";

import notInterestedIcon from "../../../assets/community/notInterested.svg";
import blockIcon from "../../../assets/community/block.svg";
import editIcon from "../../../assets/community/edit.svg";
import deleteIcon from "../../../assets/community/delete.svg";

import { blockUser } from "../../../api/domains/community/etc/blocks/api";

type Props = {
  open: boolean;
  onClose: () => void;
  isMine: boolean;

  // 고정 액션을 위해 필요한 식별자만 받자
  feedId: number;
  authorUserPk: number;
  onBlocked?: () => void;
};

export default function FeedEtcSheet({
  open,
  onClose,
  isMine,
  feedId,
  authorUserPk,
  onBlocked,
}: Props) {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [, setBlockDoneOpen] = useState(false);

  const handleEdit = () => {
    onClose();
  };

  const handleDelete = async () => {
    onClose();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    onClose();

    try {
      setShowSuccess(true);
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleNotInterested = async () => {
    onClose();
    console.log("not interested", feedId);
  };

  // 차단
  const handleBlock = async () => {
    onClose();

    try {
      const data = await blockUser(authorUserPk);
      console.log("blockUser response:", data);

      if (data.code !== 1000) {
        throw new Error(data.message ?? "차단에 실패했어요.");
      }

      setBlockDoneOpen(true);

      window.setTimeout(async () => {
        setBlockDoneOpen(false);
        onBlocked?.();
        navigate("/community", { replace: true });
      }, 900);
    } catch (e: any) {
      console.error("차단 실패:", e);
      alert(e?.message ?? "차단에 실패했어요.");
    }
  };

  return (
    <>
      <BottomSheet open={open} onClose={onClose}>
        <div className="overflow-hidden">
          {isMine ? (
            <div className="divide-y divide-[#F2F2F2]">
              <SheetRow label="수정하기" icon={editIcon} onClick={handleEdit} />
              <SheetRow
                label="삭제하기"
                icon={deleteIcon}
                danger
                onClick={handleDelete}
              />
            </div>
          ) : (
            <div className="divide-y divide-[#F2F2F2]">
              <SheetRow
                label="관심 없음"
                icon={notInterestedIcon}
                onClick={handleNotInterested}
              />
              <SheetRow
                label="차단하기"
                icon={blockIcon}
                onClick={handleBlock}
              />
            </div>
          )}
        </div>
      </BottomSheet>

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <SuccessModal isOpen={showSuccess} message="삭제를 완료했어요" />
    </>
  );
}
