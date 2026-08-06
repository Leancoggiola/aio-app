import { notifications } from '@mantine/notifications';

export function notifySuccess(message: string) {
  notifications.show({
    title: 'Listo',
    message,
    color: 'success',
    priority: 0,
  });
}

export function notifyError(message: string) {
  notifications.show({
    title: 'Error',
    message,
    color: 'destructive',
    priority: 10,
  });
}

export function getErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}
