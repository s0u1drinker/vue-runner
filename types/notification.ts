type NotificationName = [ 'message', 'error', 'info', 'success' ]

export type NotificationType = NotificationName[number]

export type Notification = {
  id: string,
  type: NotificationType,
  text: string,
  idTimer?: ReturnType<typeof setTimeout> | null,
}