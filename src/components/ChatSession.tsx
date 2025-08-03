import { Session } from '@talkjs/react';

function Chat() {
    const appId = process.env.NEXT_PUBLIC_TALKJS_APP_ID ?? '';
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  return <Session appId={appId} userId={currentUser}></Session>;
}

export default Chat;