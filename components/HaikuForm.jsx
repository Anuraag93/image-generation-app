"use client";
import { useState } from "react";
import { useFormState } from "react-dom";
import { createHaiku, editHaiku } from "../actions/haikuController";
import { CldUploadWidget } from "next-cloudinary";

export default function HaikuForm(props) {
  const [signature, setSignature] = useState();
  const [publicId, setPublicId] = useState();
  const [version, setVersion] = useState();

  let haikuFormAction;

  if (props.action === "create") {
    haikuFormAction = createHaiku;
  }

  if (props.action === "edit") {
    haikuFormAction = editHaiku;
  }

  const [formState, formAction] = useFormState(haikuFormAction, {});
  return (
    <form action={formAction} className="max-w-xs mx-auto">
      <div className="mb-3">
        <input
          type="text"
          autoComplete="off"
          name="line1"
          defaultValue={props.haiku?.line1}
          placeholder="line #1"
          className="input input-bordered w-full max-w-xs"
        />
        {formState.errors?.line1 && (
          <div role="alert" className="alert alert-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{formState.errors?.line1}</span>
          </div>
        )}
      </div>
      <div className="mb-3">
        <input
          type="text"
          autoComplete="off"
          name="line2"
          defaultValue={props.haiku?.line2}
          placeholder="line #2"
          className="input input-bordered w-full max-w-xs"
        />
        {formState.errors?.line2 && (
          <div role="alert" className="alert alert-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{formState.errors?.line2}</span>
          </div>
        )}
      </div>
      <div className="mb-3">
        <input
          type="text"
          autoComplete="off"
          name="line3"
          defaultValue={props.haiku?.line3}
          placeholder="line #3"
          className="input input-bordered w-full max-w-xs"
        />
        {formState.errors?.line3 && (
          <div role="alert" className="alert alert-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{formState.errors?.line3}</span>
          </div>
        )}
      </div>

      <div className="mb-4">
        <CldUploadWidget
          onSuccess={(result, { widget }) => {
            console.log(result?.info); // info.public_id for the photo

            setPublicId(result?.info.public_id);
            setSignature(result?.info.signature);
            setVersion(result?.info.version);
          }}
          onQueuesEnd={(result, { widget }) => widget.close()}
          signatureEndpoint="/widget-signature"
        >
          {({ open }) => {
            function handleClick(e) {
              e.preventDefault(); // prevent auto submit
              open();
            }
            return (
              <button className="btn btn-secondary" onClick={handleClick}>
                Upload an Image
              </button>
            );
          }}
        </CldUploadWidget>
      </div>

      <input type="hidden" name="public_id" defaultValue={publicId} />
      <input type="hidden" name="version" defaultValue={version} />
      <input type="hidden" name="signature" defaultValue={signature} />
      <input
        type="hidden"
        name="haikuId"
        defaultValue={props.haiku?._id.toString()}
      />
      <button className="btn btn-primary">Submit</button>
    </form>
  );
}
