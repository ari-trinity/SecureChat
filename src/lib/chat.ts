// tools for reading and writing the notebook.
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
	where,
} from "firebase/firestore";
// the notebook.
import { db } from "@/lib/firebase";

// a simple check: some letters, an @, more letters, a dot, more letters.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// true when the text looks like an email.
export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim().toLowerCase());
}

// build one room id from two emails. abc order means both phones build the same id.
export function makeRoomId(emailA: string, emailB: string): string {
  // clean both emails.
  const first = emailA.trim().toLowerCase();
  const second = emailB.trim().toLowerCase();
  // sort them so the order of arguments does not matter.
  const [left, right] = [first, second].sort();
  // join them. firestore allows @ and . in an id. it does not allow /.
  return `${left}__${right}`;
}

// find a signed-up person by email and create the room if this pair has never chatted.
export async function startChat(
  myEmail: string,
  otherEmailRaw: string,
): Promise<string> {
  // clean the typed email.
  const otherEmail = otherEmailRaw.trim().toLowerCase();
  // clean my email the same way.
  const me = myEmail.trim().toLowerCase();

  // stop early if the text is not an email.
  if (!isValidEmail(otherEmail)) {
    throw new Error("Type a real email, like friend@email.com.");
  }
  // a chat needs two different people.
  if (otherEmail === me) {
    throw new Error("Type someone else's email.");
  }

  // look in the users collection for that email.
  const found = await getDocs(
    query(collection(db, "users"), where("email", "==", otherEmail)),
  );
  // nobody has signed up with it yet.
  if (found.empty) {
    throw new Error(
      "No account uses that email yet. Ask them to sign up first.",
    );
  }

  // the shared page name.
  const roomId = makeRoomId(me, otherEmail);
  // point at that page.
  const roomRef = doc(db, "chatRooms", roomId);
  // see if the page is already there.
  const existing = await getDoc(roomRef);

  // first conversation for this pair: create the page.
  if (!existing.exists()) {
    await setDoc(roomRef, {
      participants: [me, otherEmail].sort(),
      lastMessage: "",
      updatedAt: serverTimestamp(),
    });
  }

  // the screen uses this id to open the conversation.
  return roomId;
}

// add one message and update the preview line on the chat list.
export async function sendMessage(
  roomId: string,
  text: string,
  senderId: string,
  senderEmail: string,
) {
  // cut off extra spaces.
  const cleanText = text.trim();
  // refuse a blank message.
  if (!cleanText) {
    throw new Error("Type a message first.");
  }
  // add a new document in chatRooms/{room}/messages.
  await addDoc(collection(db, "chatRooms", roomId, "messages"), {
    text: cleanText,
    senderId,
    senderEmail: senderEmail.trim().toLowerCase(),
    createdAt: serverTimestamp(),
  });
  // update the parent room so the chat list can show the newest line.
  await updateDoc(doc(db, "chatRooms", roomId), {
    lastMessage: cleanText,
    updatedAt: serverTimestamp(),
  });
}
