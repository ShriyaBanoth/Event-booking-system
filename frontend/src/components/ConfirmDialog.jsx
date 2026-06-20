import Button from "./Button";

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  variant = "primary",
  submitting = false,
  onConfirm,
  onClose,
}) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onClick={() => !submitting && onClose()}
    >
      <div
        className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-1">{title}</h2>
        <p className="text-sm text-gray-500 mb-5">{message}</p>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClose} disabled={submitting} className="flex-1">
            Go back
          </Button>
          <Button variant={variant} onClick={onConfirm} loading={submitting} className="flex-1">
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
