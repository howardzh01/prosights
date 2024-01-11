import React from "react";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { TIMESCALE_TRANSITION_DIC } from "../../../constants";

function GenericTimeScale({ timescale, setTimescale }) {
  return (
    <div className="flex items-center gap-1 self-end">
      <button
        type="button"
        disabled={timescale === "year"}
        onClick={() => setTimescale(TIMESCALE_TRANSITION_DIC[timescale][1])}
      >
        <MinusCircleIcon
          className={`w-6 h-6 ${
            timescale === "year" ? "text-customGray-200" : "text-customGray-800"
          }`}
        />
      </button>
      <button
        type="button"
        disabled={timescale === "month"}
        onClick={() => setTimescale(TIMESCALE_TRANSITION_DIC[timescale][0])}
      >
        <PlusCircleIcon
          className={`w-6 h-6 ${
            timescale === "month"
              ? "text-customGray-200"
              : "text-customGray-800"
          }`}
        />
      </button>
    </div>
  );
}

export default GenericTimeScale;
