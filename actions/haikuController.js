"use server";

import { redirect } from "next/navigation";
import { getUserDataFromCookie } from "@/lib/getUser";
import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/db";
import cloudinary from "cloudinary";

const cloudinaryConfig = cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function isAlphaNumericWithBasics(text) {
  const regex = /^[a-zA-Z0-9 .,]*$/;
  return regex.test(text);
}
async function sharedHaikuLogic(formData, user) {
  const errors = {};

  const ourHaiku = {
    line1: formData.get("line1"),
    line2: formData.get("line2"),
    line3: formData.get("line3"),
    author: ObjectId.createFromHexString(user.userId),
  };

  if (typeof ourHaiku.line1 != "string") ourHaiku.line1 = "";
  if (typeof ourHaiku.line2 != "string") ourHaiku.line2 = "";
  if (typeof ourHaiku.line3 != "string") ourHaiku.line3 = "";

  //disable entering the linebreaks
  ourHaiku.line1 = ourHaiku.line1.replace(/(\r\n|\n|\r)/g, " ");
  ourHaiku.line2 = ourHaiku.line2.replace(/(\r\n|\n|\r)/g, " ");
  ourHaiku.line3 = ourHaiku.line3.replace(/(\r\n|\n|\r)/g, " ");

  ourHaiku.line1 = ourHaiku.line1.trim();
  ourHaiku.line2 = ourHaiku.line2.trim();
  ourHaiku.line3 = ourHaiku.line3.trim();

  if (ourHaiku.line1.length < 5) errors.line1 = "Too few syllables; must be 5.";
  if (ourHaiku.line1.length > 25)
    errors.line1 = "Too many syllables; maximum 25.";

  if (ourHaiku.line2.length < 7) errors.line2 = "Too few syllables; must be 7.";
  if (ourHaiku.line2.length > 35)
    errors.line2 = "Too many syllables; maximum 35.";

  if (ourHaiku.line3.length < 5) errors.line3 = "Too few syllables; must be 5.";
  if (ourHaiku.line3.length > 25)
    errors.line3 = "Too many syllables; maximum 25.";

  if (!isAlphaNumericWithBasics(ourHaiku.line1))
    errors.line1 = "No special characters allowed.";
  if (!isAlphaNumericWithBasics(ourHaiku.line2))
    errors.line2 = "No special characters allowed.";
  if (!isAlphaNumericWithBasics(ourHaiku.line3))
    errors.line3 = "No special characters allowed.";

  if (ourHaiku.line1.length == 0) errors.line1 = "This field is required.";
  if (ourHaiku.line2.length == 0) errors.line2 = "This field is required.";
  if (ourHaiku.line3.length == 0) errors.line3 = "This field is required.";

  // Verify Signature
  const expectedSignature = cloudinary.utils.api_sign_request(
    {
      public_id: formData.get("public_id"),
      version: formData.get("version"),
    },
    cloudinaryConfig.api_secret
  );
  if (expectedSignature === formData.get("signature")) {
    // safe signature
    ourHaiku.photo = formData.get("public_id");
  }

  return { errors, ourHaiku };
}

export const createHaiku = async function (prevState, formData) {
  // check if you are logged in to allow the user to create a haiku
  const user = await getUserDataFromCookie();

  if (!user) {
    return redirect("/");
  }
  const results = await sharedHaikuLogic(formData, user);

  if (results.errors.line1 || results.errors.line2 || results.errors.line3) {
    return { errors: results.errors };
  }

  //save into db
  const haikuCollection = await getCollection("haikus");
  const newHaiku = await haikuCollection.insertOne(results.ourHaiku);

  return redirect("/");
};

export const deleteHaiku = async function (formData) {
  // check if you are logged in to allow the user to create a haiku
  const user = await getUserDataFromCookie();

  if (!user) {
    return redirect("/");
  }
  // edit the existing haiku into db
  const haikuCollection = await getCollection("haikus");
  let haikuId = formData.get("id");
  if (typeof haikuId != "string") haikuId = "";

  //make sure you are the author of the post, otherwise fail the operation
  const haikuInQuestion = await haikuCollection.findOne({
    _id: ObjectId.createFromHexString(haikuId),
  });
  if (haikuInQuestion.author.toString() !== user.userId) {
    // rediect to home page because user is not authorized
    return redirect("/");
  }
  // update the post
  await haikuCollection.deleteOne({
    _id: ObjectId.createFromHexString(haikuId),
  });

  return redirect("/");
};

export const editHaiku = async function (prevState, formData) {
  // check if you are logged in to allow the user to create a haiku
  const user = await getUserDataFromCookie();

  if (!user) {
    return redirect("/");
  }
  const results = await sharedHaikuLogic(formData, user);

  if (results.errors.line1 || results.errors.line2 || results.errors.line3) {
    return { errors: results.errors };
  }

  // edit the existing haiku into db
  const haikuCollection = await getCollection("haikus");
  let haikuId = formData.get("haikuId");

  if (typeof haikuId != "string") haikuId = "";

  //make sure you are the author of the post, otherwise fail the operation
  const haikuInQuestion = await haikuCollection.findOne({
    _id: ObjectId.createFromHexString(haikuId),
  });
  if (haikuInQuestion.author.toString() !== user.userId) {
    // rediect to home page because user is not authorized
    return redirect("/");
  }

  // update the post
  await haikuCollection.findOneAndUpdate(
    { _id: ObjectId.createFromHexString(haikuId) },
    { $set: results.ourHaiku }
  );

  return redirect("/");
};
