import { notifications } from '@mantine/notifications';

export function notifySuccess(message: string) {
  notifications.show({
    title: 'Listo',
    message,
    color: 'green',
  });
}

export function notifyError(message: string) {
  notifications.show({
    title: 'Error',
    message,
    color: 'red',
  });
}

export function getErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}
