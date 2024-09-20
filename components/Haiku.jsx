"use client";
import Link from "next/link";
import { deleteHaiku } from "../actions/haikuController";
import { CldImage } from "next-cloudinary";

export default function Haiku(props) {
  const haiku = props.item;
  return (
    <div className="relative rounded-xl overflow-hidden max-w-[650px] mx-auto">
      <h3 className="text-center text-color-gray-600 text-xl">Before</h3>
      <CldImage
        width="650"
        height="300"
        sizes="650px"
        crop={{ type: "pad", source: true }}
        src={haiku.photo}
        alt="Description of my image"
      />

      <h3 className="text-center text-color-gray-600 text-xl">After</h3>
      <CldImage
        width="650"
        height="300"
        sizes="650px"
        fillBackground
        crop={{ type: "pad", source: true }}
        src={haiku.photo}
        alt="Description of my image"
        overlays={[
          {
            position: { x: 34, y: 154, angle: -10, gravity: "north_west" },
            text: {
              color: "black",
              fontFamily: "Source Sans Pro",
              fontSize: 42,
              fontWeight: "bold",
              text: `${haiku.line1}%0A${haiku.line2}%0A${haiku.line3}`,
            },
          },
          {
            position: { x: 30, y: 150, angle: -10, gravity: "north_west" },
            text: {
              color: "white",
              fontFamily: "Source Sans Pro",
              fontSize: 42,
              fontWeight: "bold",
              text: `${haiku.line1}%0A${haiku.line2}%0A${haiku.line3}`,
            },
          },
        ]}
      />
      {haiku.line1}
      <br />
      {haiku.line2}
      <br />
      {haiku.line3}
      <br />

      <Link href={`/edit-haiku/${haiku._id.toString()}`}>Edit</Link>
      <form action={deleteHaiku}>
        <input name="id" type="hidden" defaultValue={haiku._id.toString()} />
        <button>Delete</button>
      </form>
      <hr />
    </div>
  );
}
