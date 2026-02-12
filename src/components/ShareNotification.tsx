interface ShareNotificationProps {
  message: string;
  url: string;
}

export function ShareNotification({ message, url }: ShareNotificationProps) {
  return (
    <div className="share-notification" role="status" aria-live="polite">
      <span>{message}</span>
      <a href={url} target="_blank" rel="noreferrer">
        Link öffnen
      </a>
    </div>
  );
}
