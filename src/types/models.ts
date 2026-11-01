// timestamp is firestore's way of storing a date and time.
import { Timestamp } from "firebase/firestore";

// a person who has signed up.
export interface AppUser {
  // the id firebase made when they registered.
  uid: string;
  // their email, saved in lowercase.
  email: string;
  // when the account document was created. null while firebase is still saving it.
  createdAt: Timestamp | null;
}

// one conversation between exactly two people.
export interface ChatRoom {
  // the id made from both emails.
  id: string;
  // both emails, lowercase, in abc order.
  participants: string[];
  // the text of the newest message. empty when the chat is brand new.
  lastMessage: string;
  // when the newest message was sent.
  updatedAt: Timestamp | null;
}

// one line in a conversation.
export interface Message {
  // the id firestore made for this line.
  id: string;
  // the words that were sent.
  text: string;
  // the firebase user id of the sender.
  senderId: string;
  // the email of the sender.
  senderEmail: string;
  // when it was sent.
  createdAt: Timestamp | null;
}
