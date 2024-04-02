import { isFunction } from "./utils";

function setRef<T>(
  ref: React.MutableRefObject<T | null> | React.RefCallback<T> | null,
  value: T | null
) {
  if (isFunction(ref)) {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

export function mergeRefs<T>(
  refs: (React.MutableRefObject<T> | React.RefCallback<T> | null)[]
): React.RefCallback<T> {
  return (value) => {
    for (const ref of refs) {
      setRef(ref, value);
    }
  };
}
