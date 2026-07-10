export interface ConfirmOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export interface ConfirmRequest extends ConfirmOptions {
  resolve: (value: boolean) => void;
}
