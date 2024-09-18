import { ObjectId } from "mongodb";
import HaikuForm from "../../../components/HaikuForm";
import { getCollection } from "../../../lib/db";
import { getUserDataFromCookie } from "../../../lib/getUser";
import { redirect } from "next/navigation";

async function getDoc(id) {
  const haikuCollection = await getCollection("haikus");
  const result = await haikuCollection.findOne({
    _id: ObjectId.createFromHexString(id),
  });
  return result;
}

export default async function Page(props) {
  const doc = await getDoc(props.params.id);
  const user = await getUserDataFromCookie();

  // only let author user to edit this post
  if (user.userId !== doc.author.toString()) {
    return redirect("/");
  }

  return (
    <div>
      <h2 className="text-center text-4xl text-gray-600 mb-7 ">Edit Post</h2>
      <HaikuForm haiku={doc} action="edit" />
    </div>
  );
}
